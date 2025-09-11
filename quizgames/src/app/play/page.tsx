'use client';

import { useEffect, useState } from 'react';
import GameShell from '@/components/GameShell';
import { loadSession, saveSession } from '@/lib/sessionStore';
import type { GameSession } from '@/lib/types';

export default function PlayPage() {
  const [session, setSession] = useState<GameSession | null>(null);

  useEffect(() => {
    setSession(loadSession());
  }, []);

  if (!session) {
    return (
      <main className="container">
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Play</h1>
        <div className="card" style={{ padding: 16 }}>
          <p style={{ margin: 0 }}>
            No active session. Go back to the home page to upload a PDF and generate games.
          </p>
        </div>
      </main>
    );
  }

  const { instances, index } = session;
  const total = instances.length;
  const current = instances[index];

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    const updated: GameSession = { ...session, index: clamped };
    saveSession(updated);
    setSession(updated);
  };

  return (
    <GameShell
      title={current.question.question}
      instructions={current.template.game_instructions}
      controls={current.template.game_controls as any}
      total={total}
      index={index}
      onPrev={() => go(index - 1)}
      onNext={() => go(index + 1)}
      srcDoc={current.codeWithQuestion}
    />
  );
}
