"use client";

import { useCallback, useRef } from "react";
import { File as FileIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function extractFileFromClipboard(e: React.ClipboardEvent): File | null {
  const files = e.clipboardData.files;
  if (files.length > 0) return files[0];
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === "file") {
      const file = items[i].getAsFile();
      if (file) return file;
    }
  }
  return null;
}

interface DropZoneProps {
  icon: React.ReactNode;
  text: string;
  accept: string;
  onFile: (file: File) => void;
  /** Filename of the currently selected file, if any. */
  selectedName?: string | null;
  disabled?: boolean;
}

export function DropZone({
  icon,
  text,
  accept,
  onFile,
  selectedName,
  disabled,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [disabled, onFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (disabled) return;
      const file = extractFileFromClipboard(e);
      if (file) onFile(file);
    },
    [disabled, onFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
      e.target.value = "";
    },
    [onFile]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onPaste={handlePaste}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 transition-colors",
        "hover:border-muted-foreground/50 hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {selectedName ? (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <FileIcon className="size-4 text-foreground" />
            <span className="max-w-[320px] truncate text-sm font-medium text-foreground">
              {selectedName}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Drop, paste, or click to replace.
          </p>
        </div>
      ) : (
        <>
          {icon}
          <p className="text-sm text-muted-foreground text-center">{text}</p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
