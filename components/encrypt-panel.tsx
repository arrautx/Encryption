"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Lock } from "lucide-react";

import { ImageDropZone } from "@/components/image-drop-zone";
import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { downloadBuffer } from "@/lib/file";
import { encryptImage } from "@/lib/sargimg";

function getBaseName(name: string): string {
  const lastDot = name.lastIndexOf(".");
  return lastDot > 0 ? name.slice(0, lastDot) : name;
}

export function EncryptPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Object URL lifecycle: create per file, revoke on replace/unmount.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Only image files are supported.");
      return;
    }
    setError(null);
    setFile(f);
  }, []);

  const handleRemove = useCallback(() => {
    setFile(null);
    setError(null);
  }, []);

  const handleEncrypt = async () => {
    if (!file || !password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const encrypted = await encryptImage(file, password);
      downloadBuffer(encrypted, `${getBaseName(file.name)}.sargimg`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encryption failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <Lock className="size-4" />
        <span>Encrypt</span>
      </div>

      <ImageDropZone
        file={file}
        previewUrl={previewUrl}
        onFile={handleFile}
        onRemove={handleRemove}
        disabled={busy}
      />

      <PasswordField
        id="encrypt-password"
        placeholder="Encryption password"
        value={password}
        onChange={setPassword}
        disabled={busy}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="truncate text-sm text-muted-foreground">
          {file ? (
            <span>
              Output:{" "}
              <span className="text-foreground">
                {getBaseName(file.name)}.sargimg
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground/60">Output: —</span>
          )}
        </div>
        <Button onClick={handleEncrypt} disabled={!file || !password || busy}>
          <Download />
          Encrypt
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </section>
  );
}
