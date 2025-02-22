// Constants for key and nonce sizes
const KEY_SIZE = 32; // 256-bit key
const NONCE_SIZE = 12; // 96-bit nonce

const SIGMA = new Uint8Array([
    101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107
]);

function rotate(v, c) {
    return (v << c) | (v >>> (32 - c));
}

function quarterRound(x, a, b, c, d) {
    x[a] += x[b]; x[d] = rotate(x[d] ^ x[a], 16);
    x[c] += x[d]; x[b] = rotate(x[b] ^ x[c], 12);
    x[a] += x[b]; x[d] = rotate(x[d] ^ x[a], 8);
    x[c] += x[d]; x[b] = rotate(x[b] ^ x[c], 7);
}

function chacha20Block(key, counter, nonce) {
    const state = new Uint32Array(16);
    state.set(SIGMA, 0);
    state.set(new Uint32Array(key.buffer), 4);
    state[12] = counter;
    state.set(new Uint32Array(nonce.buffer), 13);

    const workingState = new Uint32Array(state);

    for (let i = 0; i < 10; i++) {
        quarterRound(workingState, 0, 4, 8, 12);
        quarterRound(workingState, 1, 5, 9, 13);
        quarterRound(workingState, 2, 6, 10, 14);
        quarterRound(workingState, 3, 7, 11, 15);
        quarterRound(workingState, 0, 5, 10, 15);
        quarterRound(workingState, 1, 6, 11, 12);
        quarterRound(workingState, 2, 7, 8, 13);
        quarterRound(workingState, 3, 4, 9, 14);
    }

    for (let i = 0; i < 16; i++) {
        workingState[i] += state[i];
    }

    const output = new Uint8Array(workingState.buffer);
    return output;
}

function chacha20Encrypt(key, nonce, plaintext) {
    const ciphertext = new Uint8Array(plaintext.length);
    let counter = 0;

    for (let i = 0; i < plaintext.length; i += 64) {
        const block = chacha20Block(key, counter++, nonce);
        for (let j = 0; j < 64 && i + j < plaintext.length; j++) {
            ciphertext[i + j] = plaintext[i + j] ^ block[j];
        }
    }

    return ciphertext;
}

function chacha20Decrypt(key, nonce, ciphertext) {
    // Decryption is symmetric to encryption in ChaCha20
    return chacha20Encrypt(key, nonce, ciphertext);
}

// Utilities for converting between hex strings and Uint8Arrays
function hexToUint8Array(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

function uint8ArrayToHex(array) {
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Example usage
const key = hexToUint8Array('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f');
const nonce = hexToUint8Array('000000000000004a00000000');

function encrypt(rawText) {
    const plaintext = new TextEncoder().encode(rawText);
    const encrypted = chacha20Encrypt(key, nonce, plaintext);
    return uint8ArrayToHex(encrypted);
}

function decrypt(hexCiphertext) {
    const ciphertext = hexToUint8Array(hexCiphertext);
    const decrypted = chacha20Decrypt(key, nonce, ciphertext);
    return new TextDecoder().decode(decrypted);
}

// module.exports = { encrypt, decrypt, hexToUint8Array, uint8ArrayToHex };
export {
    encrypt, decrypt, hexToUint8Array, uint8ArrayToHex
}