import { webcrypto } from "crypto";

// #############
// ### Utils ###
// #############

// Function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("base64");
}

// Function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  var buff = Buffer.from(base64, "base64");
  return buff.buffer.slice(buff.byteOffset, buff.byteOffset + buff.byteLength);
}

// ################
// ### RSA keys ###
// ################

// Generates a pair of private / public RSA keys
type GenerateRsaKeyPair = {
  publicKey: webcrypto.CryptoKey;
  privateKey: webcrypto.CryptoKey;
};
export async function generateRsaKeyPair2(): Promise<any> {
  const {
    generateKeyPair,
  } = require('node:crypto');
  
  generateKeyPair('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
      publicExponent: new Uint8Array([1, 0, 1])
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'sha-256',
    },
  }, (err: any, publicKey: any, privateKey: any) => {
    return {publicKey, privateKey};
  });
}

export async function generateRsaKeyPair(): Promise<GenerateRsaKeyPair> {
  const { publicKey, privateKey } = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return {publicKey: publicKey, privateKey: privateKey}
}

// Export a crypto public key to a base64 string format
export async function exportPubKey(key: webcrypto.CryptoKey): Promise<string> {
  // TODO implement this function to return a base64 string version of a public key
  const jwk = await crypto.subtle.exportKey("jwk", key);
  const jwkString = JSON.stringify(jwk);
  const base64Key = Buffer.from(jwkString).toString("base64");
  return base64Key;
}

// Export a crypto private key to a base64 string format
export async function exportPrvKey(key: webcrypto.CryptoKey | null): Promise<string | null> {
  // TODO implement this function to return a base64 string version of a private key
  if (key === null) {
    return null;
  }
  const jwk = await crypto.subtle.exportKey("jwk", key);
  const jwkString = JSON.stringify(jwk);
  const base64Key = Buffer.from(jwkString).toString("base64");

  return base64Key;
}

// Import a base64 string public key to its native format
export async function importPubKey(strKey: string): Promise<webcrypto.CryptoKey> {
  // TODO implement this function to go back from the result of the exportPubKey function to it's native crypto key object
  const jwkString = Buffer.from(strKey, "base64").toString("utf-8");
  const jwk = JSON.parse(jwkString);
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSA-OAEP", hash: "SHA-256" }, true, ["encrypt"]);
  return key;
}

// Import a base64 string private key to its native format
export async function importPrvKey(strKey: string): Promise<webcrypto.CryptoKey> {
  // TODO implement this function to go back from the result of the exportPrvKey function to it's native crypto key object
  const jwkString = Buffer.from(strKey, "base64").toString("utf-8");
  const jwk = JSON.parse(jwkString);
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSA-OAEP", hash: "SHA-256" }, true, ["decrypt"]);
  return key;
}

// Encrypt a message using an RSA public key
export async function rsaEncrypt(b64Data: string,strPublicKey: string): Promise<string> {
  // TODO implement this function to encrypt a base64 encoded message with a public key
  const publicKey = await importPubKey(strPublicKey);
  const data = base64ToArrayBuffer(b64Data);
  const encryptedData = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data);
  const encryptedBase64 = arrayBufferToBase64(encryptedData);
  return encryptedBase64;
}

// Decrypts a message using an RSA private key
export async function rsaDecrypt(data: string,privateKey: webcrypto.CryptoKey): Promise<string> {
  // TODO implement this function to decrypt a base64 encoded message with a private key
  // tip: use the provided base64ToArrayBuffer function
  const encryptedData = base64ToArrayBuffer(data);
  const decryptedData = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, encryptedData);
  const decryptedString = new TextDecoder().decode(decryptedData);
  return decryptedString;
}

// ######################
// ### Symmetric keys ###
// ######################

// Generates a random symmetric key
export async function createRandomSymmetricKey(): Promise<webcrypto.CryptoKey> {
  // TODO implement this function using the crypto package to generate a symmetric key.
  //      the key should be used for both encryption and decryption. Make sure the
  //      keys are extractable.
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256
    },
    true, 
    ["encrypt", "decrypt"]
  );

  return key;
}

// Export a crypto symmetric key to a base64 string format
export async function exportSymKey(key: webcrypto.CryptoKey): Promise<string> {
  // TODO implement this function to return a base64 string version of a symmetric key
  const jwk = await crypto.subtle.exportKey("jwk", key);
  const jwkString = JSON.stringify(jwk);
  const base64Key = Buffer.from(jwkString).toString("base64");
  return base64Key;
}

// Import a base64 string format to its crypto native format
export async function importSymKey(
  strKey: string
): Promise<webcrypto.CryptoKey> {
  // TODO implement this function to go back from the result of the exportSymKey function to it's native crypto key object
  const jwkString = Buffer.from(strKey, "base64").toString("utf-8");
  const jwk = JSON.parse(jwkString);
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "AES-CBC" }, true, ["encrypt", "decrypt"]);
  return key;
}

// Encrypt a message using a symmetric key
export async function symEncrypt(key: webcrypto.CryptoKey,data: string): Promise<string> {
  // TODO implement this function to encrypt a base64 encoded message with a public key
  // tip: encode the data to a uin8array with TextEncoder
  const dataArray = new TextEncoder().encode(data);
  const encryptedData = await crypto.subtle.encrypt({ name: "AES-CBC" }, key, dataArray);
  const encryptedBase64 = Buffer.from(encryptedData).toString("base64");
  return encryptedBase64;
}

// Decrypt a message using a symmetric key
export async function symDecrypt(strKey: string,encryptedData: string): Promise<string> {
  // TODO implement this function to decrypt a base64 encoded message with a private key
  // tip: use the provided base64ToArrayBuffer function and use TextDecode to go back to a string format
  const key = await importSymKey(strKey);
  const encryptedArray = base64ToArrayBuffer(encryptedData);
  const decryptedData = await crypto.subtle.decrypt({ name: "AES-CBC" }, key, encryptedArray);
  const decryptedString = new TextDecoder().decode(decryptedData);
  return decryptedString;
}
