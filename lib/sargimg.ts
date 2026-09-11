import {
  aesGcmDecrypt,
  aesGcmEncrypt,
  deriveKey,
} from "@/lib/crypto";
import { readFileAsArrayBuffer } from "@/lib/file";

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const MAGIC = "SARG1";

export const ERROR_INVALID_FILE = "Invalid .sargimg file";
export const ERROR_DECRYPT_FAILED = "Incorrect password or corrupted file";

export interface DecryptResult {
  blob: Blob;
  filename: string;
}

export async function encryptImage(
  file: File,
  password: string
): Promise<Uint8Array> {
  const imageBuffer = await readFileAsArrayBuffer(file);
  const salt = crypto.getRandomValues(
    new Uint8Array(new ArrayBuffer(SALT_LENGTH))
  );
  const iv = crypto.getRandomValues(new Uint8Array(new ArrayBuffer(IV_LENGTH)));
  const key = await deriveKey(password, salt);
  const ciphertext = await aesGcmEncrypt(key, iv, imageBuffer);

  const enc = new TextEncoder();
  const magic = enc.encode(MAGIC);
  const filenameBytes = enc.encode(file.name);
  if (filenameBytes.length > 255) throw new Error("Filename too long");
  const mimetypeBytes = enc.encode(file.type);
  if (mimetypeBytes.length > 255) throw new Error("Mimetype too long");

  const result = new Uint8Array(
    magic.length +
      salt.length +
      iv.length +
      1 +
      filenameBytes.length +
      1 +
      mimetypeBytes.length +
      ciphertext.byteLength
  );
  let offset = 0;
  result.set(magic, offset);
  offset += magic.length;
  result.set(salt, offset);
  offset += salt.length;
  result.set(iv, offset);
  offset += iv.length;
  result[offset++] = filenameBytes.length;
  result.set(filenameBytes, offset);
  offset += filenameBytes.length;
  result[offset++] = mimetypeBytes.length;
  result.set(mimetypeBytes, offset);
  offset += mimetypeBytes.length;
  result.set(new Uint8Array(ciphertext), offset);

  return result;
}

export async function decryptSargimg(
  file: File,
  password: string
): Promise<DecryptResult> {
  const buffer = await readFileAsArrayBuffer(file);
  const data = new Uint8Array(buffer);
  const dec = new TextDecoder();

  if (data.length < 35 || dec.decode(data.slice(0, 5)) !== MAGIC) {
    throw new Error(ERROR_INVALID_FILE);
  }

  let offset = 5;
  const salt = data.slice(offset, offset + SALT_LENGTH);
  offset += SALT_LENGTH;
  const iv = data.slice(offset, offset + IV_LENGTH);
  offset += IV_LENGTH;

  const filenameLen = data[offset++];
  if (data.length < offset + filenameLen + 1) {
    throw new Error(ERROR_INVALID_FILE);
  }
  const filename = dec.decode(data.slice(offset, offset + filenameLen));
  offset += filenameLen;

  const mimetypeLen = data[offset++];
  if (data.length < offset + mimetypeLen) {
    throw new Error(ERROR_INVALID_FILE);
  }
  const mimetype = dec.decode(data.slice(offset, offset + mimetypeLen));
  offset += mimetypeLen;

  const ciphertext = data.slice(offset);

  const key = await deriveKey(password, salt);

  try {
    const plaintext = await aesGcmDecrypt(key, iv, ciphertext);
    const blob = new Blob([plaintext], { type: mimetype });
    return { blob, filename };
  } catch {
    throw new Error(ERROR_DECRYPT_FAILED);
  }
}
