import { supabase } from "./supabaseClient";
import type { GameInstance, Question, TemplateRow } from "./types";

export async function fetchTemplatesByTypes(
  types: Array<"mcq" | "true_false">
): Promise<TemplateRow[]> {
  if (!types.length) return [];
  const { data, error } = await supabase
    .from("game_templates")
    .select(
      "id,name,code,game_controls,game_instructions,supported_question_type"
    )
    .in("supported_question_type", types);

  if (error) throw error;
  return (data ?? []) as TemplateRow[];
}

export function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function mapQuestionsToTemplates(
  questions: Question[],
  templates: TemplateRow[]
): GameInstance[] {
  return questions.map((q) => {
    const pool = templates.filter(
      (t) => t.supported_question_type === q.question_type
    );
    if (!pool.length) {
      throw new Error(`No template available for type: ${q.question_type}`);
    }
    const template = randomPick(pool);
    return { question: q, template, codeWithQuestion: "" };
  });
}
