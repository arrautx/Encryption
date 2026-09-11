import { asBuffer } from "@/lib/utils";

const PBKDF2_ITERATIONS = 210_000;

export async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    asBuffer(new TextEncoder().encode(password)),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: asBuffer(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function aesGcmEncrypt(
  key: CryptoKey,
  iv: Uint8Array,
  data: ArrayBuffer
): Promise<ArrayBuffer> {
  return crypto.subtle.encrypt(
    { name: "AES-GCM", iv: asBuffer(iv) },
    key,
    data
  );
}

export async function aesGcmDecrypt(
  key: CryptoKey,
  iv: Uint8Array,
  data: Uint8Array
): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt(
    { name: "AES-GCM", iv: asBuffer(iv) },
    key,
    asBuffer(data)
  );
}
