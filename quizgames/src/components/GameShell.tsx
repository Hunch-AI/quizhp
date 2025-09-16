'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameRuntimeIframe from './GameRuntimeIframe';
import Controls from './Controls';

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

  const progress = (index / Math.max(1, total - 1)) * 100;


  return (
    <div className="container">
      {/* Top Header */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16, flexShrink: 0 }}>
        {/* Left: Exit button aligned with feedback */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', justifyContent: 'flex-start' }}>
          <button className="btn" onClick={() => router.push('/')}>Exit Game</button>
        </div>

        {/* Center: Empty space for question */}
        <div style={{ width: 720, flexShrink: 0 }}></div>

        {/* Right: Empty space for instructions/controls */}
        <div style={{ width: 240, flexShrink: 0 }}></div>
      </div>

      {/* Main content area - takes remaining space */}
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0, justifyContent: 'center' }}>
        {/* Left: Feedback */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="card" style={{ padding: 16, flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Feedback</div>
            <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>
              {feedback
                ? (feedback.isCorrect ? '✅' : '❌') +
                (feedback.explanation || '')
                : 'Play the game — your feedback will appear here when you make a selection.'}
            </p>
          </div>
        </div>

        {/* Center: Question + Game */}
        <div style={{ width: 720, flexShrink: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Question prompt - directly above game */}
          <div style={{ marginBottom: 16, flexShrink: 0 }}>
            <div className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
            </div>
          </div>

          {/* Game container - centered */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
            <GameRuntimeIframe
              srcDoc={srcDoc}
              onChoice={(p) => setFeedback({ isCorrect: p.isCorrect, explanation: p.explanation })}
            />
          </div>
        </div>

        {/* Right: Instructions & Controls */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 16, flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Instructions</div>
            <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>
              {instructions || '—'}
            </p>
          </div>

          <Controls controls={controls} />
        </div>
      </div>

      {/* Bottom: Progress + Prev/Next */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 720 }}>
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
    </div>
  );
}
