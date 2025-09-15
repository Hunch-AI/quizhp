"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pdfToQuestions } from '@/lib/pdfQuiz';
import { createSessionFromQuestions } from '@/lib/sessionStore';

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    const f = e.target.files?.[0] || null;
    if (!f) {
      setFile(null);
      return;
    }
    if (!isPdf(f)) {
      setError('Please select a .pdf file.');
      setFile(null);
      return;
    }
    setFile(f);
  }

  async function onGenerate() {
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      // 1) PDF → questions (Supabase Edge Function)
      const questions = await pdfToQuestions(file);

      if (!questions?.length) {
        throw new Error('No questions were generated from this PDF.');
      }

      // 2) Build a session (fetch templates, inject question, store to localStorage)
      await createSessionFromQuestions(questions);

      // 3) Go to /play
      router.push('/play');
    } catch (err: any) {
      const msg = normalizeErr(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Upload PDF → Generate Games</h1>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>
        Select a <code>.pdf</code>, then click <b>Generate games</b>.
      </p>

      <div className="card" style={{ padding: 16, marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            disabled={loading}
          />
          <button
            className="btn"
            onClick={onGenerate}
            disabled={!file || loading}
            aria-busy={loading}
          >
            {loading ? 'Generating…' : 'Generate games'}
          </button>
        </div>

        {!!file && (
          <div style={{ marginTop: 10, fontSize: 14, opacity: 0.9 }}>
            Selected: <code>{file.name}</code> ({formatBytes(file.size)})
          </div>
        )}

        {!!error && (
          <div
            role="alert"
            style={{
              marginTop: 12,
              padding: '10px 12px',
              border: '1px solid #6b2323',
              borderRadius: 8,
              background: '#2a1616',
              color: '#ffdede',
              fontSize: 14,
              whiteSpace: 'pre-wrap',
            }}
          >
            {error}
          </div>
        )}

        <TinyNote />
      </div>
    </main>
  );
}

/* ---------------- helpers ---------------- */

function isPdf(file: File) {
  // Accept either MIME type or .pdf extension.
  const byType = file.type === 'application/pdf';
  const byExt = /\.pdf$/i.test(file.name);
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
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message || String(err);
  try { return JSON.stringify(err); } catch { return String(err); }
}

function TinyNote() {
  return (
    <div style={{ marginTop: 16, fontSize: 12, opacity: 0.75 }}>
      <p style={{ margin: 0 }}>
        • Requires <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{' '}
        <code>NEXT_PUBLIC_PDF_QUIZ_URL</code> in <code>.env.local</code>.
      </p>
      <p style={{ margin: 0 }}>
        • After success, you&apos;ll be sent to <code>/play</code>.
      </p>
    </div>
  );
}

/* ---------------- local test stub (optional) ----------------
   If you want to test the UI without calling the Edge Function,
   temporarily comment out the real import and use this stub:

// import { pdfToQuestions } from '@/lib/pdfQuiz';
// REPLACE with:
async function pdfToQuestions(_file: File): Promise<Question[]> {
  return [
    {
      question_number: 1,
      question_type: 'true_false',
      question: 'The dev stub works.',
      choices: [
        { text: 'True', is_correct: true, explanation: 'Great! Now hook up the real endpoint.' },
        { text: 'False', is_correct: false, explanation: 'Try again.' },
      ],
    },
    {
      question_number: 2,
      question_type: 'mcq',
      question: 'Pick the correct option.',
      choices: [
        { text: 'A', is_correct: false, explanation: 'Nope.' },
        { text: 'B', is_correct: true, explanation: 'Correct!' },
        { text: 'C', is_correct: false, explanation: 'Not this one.' },
        { text: 'D', is_correct: false, explanation: 'Close, but no.' },
      ],
    },
  ];
}
---------------------------------------------------------------- */
