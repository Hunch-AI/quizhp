"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { pdfToQuestions } from "@/lib/pdfQuiz";
import { createSessionFromQuestions } from "@/lib/sessionStore";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  function isPdf(f: File) {
    const byType = f.type === "application/pdf";
    const byExt = /\.pdf$/i.test(f.name);
    return byType || byExt;
  }

  function formatBytes(n: number) {
    if (n < 1024) return `${n} B`;
    const kb = n / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  function normalizeErr(err: unknown): string {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message || String(err);
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const f = e.target.files?.[0] || null;
    if (!f) {
      setFile(null);
      return;
    }
    if (!isPdf(f)) {
      setError("Please select a .pdf file.");
      setFile(null);
      return;
    }
    setFile(f);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError("");
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!isPdf(f)) {
      setError("Please drop a .pdf file.");
      setFile(null);
      return;
    }
    setFile(f);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!dragActive) setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  async function onGenerate() {
    if (!file) return;
    setError("");
    setLoading(true);
    try {
      const questions = await pdfToQuestions(file);
      if (!questions?.length) throw new Error("No questions were generated from this PDF.");
      await createSessionFromQuestions(questions);
      router.push("/play");
    } catch (err: any) {
      setError(normalizeErr(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="upload-landing"
      style={{
        height: "100dvh",
        background: "var(--bg)",
        color: "var(--ink)",
        display: "grid",
        gridTemplateColumns: "0.8fr 1.2fr",
        gap: 16,
        alignItems: "center",
        padding: "48px 24px",
        overflow: "hidden",
      }}
    >
      {/* Left — looping video placeholder (replace the src with your own) */}
      <section
        aria-label="Product preview video"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "min(520px, 90%)",
            aspectRatio: "9/16",
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
            border: "1px solid var(--border)",
            background: "black",
          }}
        >
          <video
            src="/videos/placeholder-loop.mp4" // ← replace with your file
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Right — headline, subtext, upload area */}
      <section style={{ maxWidth: 680, width: "100%", marginInline: "auto" }}>
        <h1
          style={{
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.05,
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Learn anything by playing games
        </h1>
        <p
          style={{
            marginTop: 16,
            fontSize: "clamp(16px, 2.2vw, 20px)",
            opacity: 0.9,
          }}
        >
          Turn any PDF into short video games
        </p>

        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          style={{
            marginTop: 24,
            padding: "36px 24px",
            borderRadius: 16,
            border: `2px dashed ${dragActive ? "#8ab4f8" : "var(--border)"}`,
            background: "var(--panel)",
            cursor: "pointer",
            transition: "border-color 120ms ease",
            outline: "none",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                border: "1px solid var(--border)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
                fontSize: 22,
                userSelect: "none",
              }}
              aria-hidden
            >
              📄
            </div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              Drag-and-drop a PDF or click here
            </div>
            <div style={{ fontSize: 14, opacity: 0.7, marginTop: 6 }}>
              We only accept <code>.pdf</code> files.
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            disabled={loading}
            style={{ display: "none" }}
          />
        </div>

        {/* Selected file */}
        {!!file && (
          <div
            style={{
              marginTop: 12,
              fontSize: 14,
              opacity: 0.9,
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span>Selected:</span>
            <code style={{ fontSize: 13 }}>{file.name}</code>
            <span style={{ opacity: 0.7 }}>({formatBytes(file.size)})</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              style={{
                marginLeft: 8,
                fontSize: 12,
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "4px 8px",
                color: "inherit",
                cursor: "pointer",
              }}
              aria-label="Clear selected file"
            >
              Clear
            </button>
          </div>
        )}

        {/* Generate button appears only after a file is chosen */}
        <div
          style={{
            height: !!file ? 52 : 0,
            marginTop: !!file ? 16 : 0,
            overflow: "hidden",
            transition: "all 160ms ease",
          }}
        >
          {!!file && (
            <button
              className="btn"
              onClick={onGenerate}
              disabled={!file || loading}
              aria-busy={loading}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "#8ab4f8",
                color: "var(--bg)",
                border: "none",
                fontWeight: 700,
                fontSize: 16,
                cursor: loading ? "default" : "pointer",
                boxShadow: "0 8px 24px rgba(138,180,248,0.25)",
              }}
            >
              {loading ? "Generating…" : "Generate games"}
            </button>
          )}
        </div>

        {/* Error */}
        {!!error && (
          <div
            role="alert"
            style={{
              marginTop: 12,
              padding: "10px 12px",
              border: "1px solid #6b2323",
              borderRadius: 8,
              background: "#2a1616",
              color: "#ffdede",
              fontSize: 14,
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </div>
        )}

        <TinyNote />
      </section>

      {/* Simple responsive fallback */}
      <style jsx>{`
        @media (max-width: 980px) {
          main.upload-landing {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 32px 16px;
          }
        }
      `}</style>
    </main>
  );
}

function TinyNote() {
  return null;
}
