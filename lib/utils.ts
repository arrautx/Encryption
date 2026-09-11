import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * TypeScript 5.9 treats `Uint8Array<ArrayBufferLike>` as not assignable to
 * `BufferSource`/`BlobPart`; this normalizes views onto plain ArrayBuffers.
 */
export function asBuffer(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  return bytes.buffer instanceof ArrayBuffer
    ? (bytes as Uint8Array<ArrayBuffer>)
    : new Uint8Array(bytes.slice().buffer as ArrayBuffer);
}
