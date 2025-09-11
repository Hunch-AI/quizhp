'use client';

import { useEffect, useRef } from 'react';

type ChoiceEvent = {
  choiceIndex?: number;
  isCorrect: boolean;
  explanation?: string;
};

type Props = {
  srcDoc: string;
  onChoice: (payload: ChoiceEvent) => void;
};

export default function GameRuntimeIframe({ srcDoc, onChoice }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (ev: MessageEvent) => {
      const data = ev.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'quiz-choice' || data.type === 'quiz-end') {
        onChoice({
          choiceIndex:
            typeof data.choiceIndex === 'number' ? data.choiceIndex : undefined,
          isCorrect: !!data.isCorrect,
          explanation:
            typeof data.explanation === 'string' ? data.explanation : '',
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onChoice]);

  return (
    <iframe
      key={hashKey(srcDoc)}            // ensure clean remount when code changes
      ref={frameRef}
      width={720}
      height={540}
      className="border rounded"
      sandbox="allow-scripts allow-pointer-lock"
      srcDoc={srcDoc}
    />
  );
}

function hashKey(s: string): string {
  let h = 0,
    i = s.length;
  while (i) h = (h * 31) ^ s.charCodeAt(--i);
  return String(h >>> 0);
}
