"use client";

import { useCallback, useRef } from "react";
import { Image as ImageIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ImageDropZoneProps {
  file: File | null;
  previewUrl: string | null;
  onFile: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function ImageDropZone({
  file,
  previewUrl,
  onFile,
  onRemove,
  disabled,
}: ImageDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [disabled, onFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (disabled) return;
      const files = e.clipboardData.files;
      if (files.length > 0) {
        onFile(files[0]);
        return;
      }
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
          const pasted = items[i].getAsFile();
          if (pasted) {
            onFile(pasted);
            break;
          }
        }
      }
    },
    [disabled, onFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const picked = e.target.files?.[0];
      if (picked) onFile(picked);
      e.target.value = "";
    },
    [onFile]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) onRemove();
    },
    [disabled, onRemove]
  );

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label={file ? "Replace image" : "Choose an image"}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPicker();
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onPaste={handlePaste}
        className={cn(
          "overflow-hidden rounded-xl border border-dashed border-border transition-colors",
          "hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {file && previewUrl ? (
          <div className="relative h-[370px] bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={file.name}
              className="h-full w-full object-contain"
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-md bg-black/70 text-white transition-colors hover:bg-black/90 focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex h-[370px] flex-col items-center justify-center gap-3 cursor-pointer">
            <ImageIcon className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              Paste, drop, or choose an image.
            </p>
          </div>
        )}
      </div>

      {file && (
        <div className="px-1">
          <p className="truncate text-sm font-light text-foreground">
            {file.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {file.type || "unknown"} · {formatFileSize(file.size)}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
