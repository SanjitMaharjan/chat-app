import { encrypt, compare } from "./rsa.js";

const message = "sarkar@123";
const encryptedMessage = encrypt(message);
console.log("Encrypted Message:", encryptedMessage);

const decryptedMessage = compare(encryptedMessage, "sarkar@123");
console.log("Decrypted Message:", decryptedMessage ? "Correct" : "Incorrect");
