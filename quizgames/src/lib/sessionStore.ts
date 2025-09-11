import type { GameInstance, GameSession, Question } from "./types";
import { fetchTemplatesByTypes, mapQuestionsToTemplates } from "./templates";
import { injectQuestionIntoCode } from "./injectQuestion";

const KEY = "quiz:current";

export function loadSession(): GameSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as GameSession) : null;
}

export function saveSession(s: GameSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export async function createSessionFromQuestions(
  questions: Question[]
): Promise<GameSession> {
  const types = Array.from(new Set(questions.map((q) => q.question_type)));
  const templates = await fetchTemplatesByTypes(types as any);
  const instances: GameInstance[] = mapQuestionsToTemplates(
    questions,
    templates
  ).map((gi) => ({
    ...gi,
    codeWithQuestion: injectQuestionIntoCode(gi.template.code, gi.question),
  }));

  const session: GameSession = {
    createdAt: Date.now(),
    instances,
    index: 0,
  };
  saveSession(session);
  return session;
}

export function updateIndex(nextIndex: number) {
  const s = loadSession();
  if (!s) return;
  s.index = Math.max(0, Math.min(s.instances.length - 1, nextIndex));
  saveSession(s);
}
