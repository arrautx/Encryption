import { useState, useRef, useCallback, useEffect } from "react";

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("image.png");
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setFileType(file.type);
      const ext = file.type.split("/")[1] || "png";
      setFileName(file.name || `image.${ext}`);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = fileName;
    link.click();
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          handleImageFile(file);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setIsHovering(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = () => {
    setImage(null);
    setFileType("");
    setFileName("image.png");
  };

  const dropZoneBg = isDragging ? "#252525" : isHovering ? "#222222" : "#1a1a1a";
  const dropZoneBorder = isDragging ? "#888888" : isHovering ? "#666666" : "#3a3a3a";

  return (
    <div
      style={{ backgroundColor: "#111111", minHeight: "100vh" }}
      className="flex flex-col items-center"
    >
      {/* ── Top divider line ── */}
      <div style={{ width: "100%", maxWidth: "540px", paddingTop: "40px" }}>
        <hr style={{ border: "none", borderTop: "1px solid #2a2a2a", marginBottom: "28px" }} />

        {/* ── Header ── */}
        <div style={{ marginBottom: "20px" }}>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "5px",
              letterSpacing: "-0.01em",
            }}
          >
            Paste to Download
          </h1>
          <p style={{ color: "#aaaaaa", fontSize: "14px", lineHeight: "1.5" }}>
            Paste or drop an image, then download it.
          </p>
        </div>

        {/* ── Image state ── */}
        {image ? (
          <div style={{ width: "100%" }}>
            {/* Image card */}
            <div
              style={{
                position: "relative",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #2a2a2a",
                backgroundColor: "#1a1a1a",
              }}
            >
              <img
                src={image}
                alt="Pasted"
                style={{
                  width: "100%",
                  display: "block",
                  maxHeight: "420px",
                  objectFit: "contain",
                  backgroundColor: "#1a1a1a",
                }}
              />

              {/* ✕ Close button */}
              <button
                onClick={handleClear}
                title="Remove image"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #3a3a3a",
                  color: "#cccccc",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s, color 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff4444";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "#ff4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2a2a2a";
                  e.currentTarget.style.color = "#cccccc";
                  e.currentTarget.style.borderColor = "#3a3a3a";
                }}
              >
                ✕
              </button>
            </div>

            {/* Filename + Download row */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "12px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  padding: "9px 14px",
                  color: "#eeeeee",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#666666")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#333333")}
              />
              <button
                onClick={handleDownload}
                style={{
                  backgroundColor: "#eeeeee",
                  color: "#111111",
                  border: "none",
                  borderRadius: "8px",
                  padding: "9px 18px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#cccccc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#eeeeee")
                }
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </button>
            </div>

            {/* File type */}
            {fileType && (
              <p
                style={{
                  color: "#555555",
                  fontSize: "12px",
                  marginTop: "6px",
                  paddingLeft: "2px",
                }}
              >
                {fileType}
              </p>
            )}
          </div>
        ) : (
          /* ── Empty / drop zone ── */
          <div
            ref={dropZoneRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              width: "100%",
              minHeight: "220px",
              borderRadius: "10px",
              backgroundColor: dropZoneBg,
              border: `2px dashed ${dropZoneBorder}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              cursor: "default",
              transition: "background-color 0.2s, border-color 0.2s",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isHovering || isDragging ? "#888888" : "#555555"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: "stroke 0.2s" }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>

            <p
              style={{
                color: isHovering || isDragging ? "#aaaaaa" : "#666666",
                fontSize: "14px",
                margin: 0,
                transition: "color 0.2s",
              }}
            >
              Paste an image (Ctrl+V) or drag and drop
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
