'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameRuntimeIframe from './GameRuntimeIframe';

type Control = { type?: string; keys?: string[]; description?: string };

type Props = {
  title: string;
  instructions?: string | null;
  controls?: Control[] | any; // JSONB may arrive as array or stringified JSON
  total: number;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  srcDoc: string;
};

export default function GameShell({
  title,
  instructions,
  controls,
  total,
  index,
  onPrev,
  onNext,
  srcDoc,
}: Props) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{
    isCorrect?: boolean;
    explanation?: string;
  } | null>(null);

  // Reset feedback whenever we swap games
  useEffect(() => {
    setFeedback(null);
  }, [srcDoc]);

  const progress = ((index + 1) / Math.max(1, total)) * 100;

  const parsedControls: Control[] = useMemo(() => {
    if (Array.isArray(controls)) return controls as Control[];
    if (typeof controls === 'string') {
      try {
        const v = JSON.parse(controls);
        return Array.isArray(v) ? (v as Control[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [controls]);

  return (
    <div className="container">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <button className="btn" onClick={() => router.push('/')}>Exit Game</button>
        {/* Keep it simple; sound toggle can be added later */}
      </div>

      {/* Question prompt */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div className="card" style={{ width: '100%', maxWidth: 640, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
        </div>
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
        {/* Left: Feedback */}
        <div style={{ width: 256, flexShrink: 0 }} className="card">
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Feedback</div>
            <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>
              {feedback
                ? (feedback.isCorrect ? '✅ Correct. ' : '❌ Incorrect. ') +
                  (feedback.explanation || '')
                : 'Play the game — your feedback will appear here when you make a selection.'}
            </p>
          </div>
        </div>

        {/* Center: Game */}
        <div style={{ flex: 1 }} className="card">
          <div style={{ padding: 16, display: 'flex', justifyContent: 'center' }}>
            <GameRuntimeIframe
              srcDoc={srcDoc}
              onChoice={(p) => setFeedback({ isCorrect: p.isCorrect, explanation: p.explanation })}
            />
          </div>
        </div>

        {/* Right: Instructions & Controls */}
        <div style={{ width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Instructions</div>
            <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>
              {instructions || '—'}
            </p>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Controls</div>
            <div style={{ fontSize: 14, opacity: 0.85, display: 'grid', gap: 8 }}>
              {parsedControls.length
                ? parsedControls.map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span>{c.type || (c.keys ? c.keys.join(', ') : '—')}</span>
                      <span>{c.description || '—'}</span>
                    </div>
                  ))
                : <span>—</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Progress + Prev/Next */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn" onClick={onPrev} disabled={index === 0}>Previous</button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, opacity: 0.85, marginBottom: 6 }}>
            <span>Question {index + 1} of {total}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="border rounded" style={{ height: 8, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--ink)' }} />
          </div>
        </div>

        <button className="btn" onClick={onNext} disabled={index + 1 >= total}>Next</button>
      </div>
    </div>
  );
}
