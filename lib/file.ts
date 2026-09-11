import { asBuffer } from "@/lib/utils";

export async function readFileAsArrayBuffer(
  file: File
): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadBuffer(buffer: Uint8Array, filename: string) {
  downloadBlob(new Blob([asBuffer(buffer)]), filename);
}
