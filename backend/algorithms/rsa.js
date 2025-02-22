// Utility functions for BigInt operations
function modExp(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp >> 1n;
        base = (base * base) % mod;
    }
    return result;
}

function gcd(a, b) {
    while (b !== 0n) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function modInverse(a, m) {
    let m0 = m, t, q;
    let x0 = 0n, x1 = 1n;

    if (m === 1n) return 0n;

    while (a > 1n) {
        q = a / m;
        t = m;
        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0n) x1 += m0;

    return x1;
}

// Function to generate RSA keys
function generateRSAKeys(bitLength) {
    const e = 65537n; // Public exponent
    let p, q, n, phi, d;

    do {
        p = generatePrime(bitLength / 2);
        q = generatePrime(bitLength / 2);
        n = p * q;
        phi = (p - 1n) * (q - 1n);
    } while (gcd(e, phi) !== 1n);

    d = modInverse(e, phi);

    return {
        publicKey: { e, n },
        privateKey: { d, n }
    };
}

// Function to generate a random prime number of a given bit length
function generatePrime(bitLength) {
    while (true) {
        const candidate = randomBigInt(bitLength);
        if (isPrime(candidate)) return candidate;
    }
}

// Utility function to generate a random BigInt of a given bit length
function randomBigInt(bitLength) {
    let rnd = BigInt('0b' + Array(bitLength).fill().map(() => Math.random() < 0.5 ? '0' : '1').join(''));
    rnd |= 1n << BigInt(bitLength - 1); // Ensure the most significant bit is set
    rnd |= 1n; // Ensure the number is odd
    return rnd;
}

// Function to check if a number is prime (Miller-Rabin primality test)
function isPrime(n, k = 5) {
    if (n === 2n || n === 3n) return true;
    if (n <= 1n || n % 2n === 0n) return false;

    let s = 0n, d = n - 1n;
    while (d % 2n === 0n) {
        d /= 2n;
        s++;
    }

    WitnessLoop: for (let i = 0; i < k; i++) {
        const a = 2n + randomBigInt(n.toString(2).length - 2) % (n - 3n);
        let x = modExp(a, d, n);
        if (x === 1n || x === n - 1n) continue;

        for (let r = 1n; r < s; r++) {
            x = modExp(x, 2n, n);
            if (x === 1n) return false;
            if (x === n - 1n) continue WitnessLoop;
        }

        return false;
    }

    return true;
}

// RSA encryption
function rsaEncrypt(message, publicKey) {
    const m = BigInt('0x' + Buffer.from(message).toString('hex'));
    const { e, n } = publicKey;
    const c = modExp(m, e, n);
    return c.toString(16);
}

// RSA decryption
function rsaDecrypt(ciphertext, privateKey) {
    const c = BigInt('0x' + ciphertext);
    const { d, n } = privateKey;
    const m = modExp(c, d, n);
    return Buffer.from(m.toString(16), 'hex').toString();
}

// Example usage
// const { publicKey, privateKey } = generateRSAKeys(1024);

const publicKey = {
    e: 65537n,
    n: 137405962554182596405258850471164835195025053626094735000354579453463720060563164443347029248554325351857372444587729439509055915897782821823529981217164030275662136415132962931813939070077032236570711091683504785003432673428572682957010781190061743781421039863142382119124872648353886917943118365947509800817n
};

const privateKey = {
    d: 112244466657013892627858123179643264369758476447298590612615511323689423030689680205670484731534924730107211059301595789760849863641968676459778462157896947808359499656373288385975837233979091619528671777367734596350815014335815143161267252235235450863895523779225308918108320213289975807454626648916598421633n,
    n: 137405962554182596405258850471164835195025053626094735000354579453463720060563164443347029248554325351857372444587729439509055915897782821823529981217164030275662136415132962931813939070077032236570711091683504785003432673428572682957010781190061743781421039863142382119124872648353886917943118365947509800817n
}

function encrypt(rawText) {
    return rsaEncrypt(rawText, publicKey);
}

function decrypt(hexCiphertext) {
    return rsaDecrypt(hexCiphertext, privateKey);
}

function compare(hexCiphertext, rawText) {
    const decryptedText = decrypt(hexCiphertext, privateKey);
    return decryptedText == rawText;
}

export { encrypt, compare, generateRSAKeys, rsaEncrypt, rsaDecrypt };