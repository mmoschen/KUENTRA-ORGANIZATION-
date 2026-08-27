import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const readline = createInterface({ input, output });
const password = await readline.question("Contraseña administrativa: ");
await readline.close();

if (password.length < 12) {
  throw new Error("Usá una contraseña de al menos 12 caracteres.");
}

const salt = randomBytes(16);
const key = await new Promise((resolve, reject) => {
  scrypt(password, salt, 64, { N: 16_384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, derivedKey) => {
    if (error) reject(error);
    else resolve(derivedKey);
  });
});

console.log(`\nADMIN_PASSWORD_HASH=scrypt$${salt.toString("base64url")}$${key.toString("base64url")}`);
