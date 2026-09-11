"use client";

import { useCallback, useState } from "react";
import { File as FileIcon, Upload } from "lucide-react";

import { DropZone } from "@/components/drop-zone";
import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { downloadBlob } from "@/lib/file";
import { decryptSargimg } from "@/lib/sargimg";

export function DecryptPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setError(null);
  }, []);

  const handleDecrypt = async () => {
    if (!file || !password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await decryptSargimg(file, password);
      downloadBlob(result.blob, result.filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decryption failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <FileIcon className="size-4" />
        <span>Decrypt</span>
      </div>

      <DropZone
        icon={<Upload className="size-8 text-muted-foreground" />}
        text="Drop or choose a .sargimg file."
        accept=".sargimg"
        onFile={handleFile}
        selectedName={file?.name ?? null}
        disabled={busy}
      />

      <PasswordField
        id="decrypt-password"
        placeholder="Decryption password"
        value={password}
        onChange={setPassword}
        disabled={busy}
      />

      <div className="flex justify-end">
        <Button onClick={handleDecrypt} disabled={!file || !password || busy}>
          <FileIcon />
          Decrypt
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </section>
  );
}
