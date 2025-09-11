import type { Question } from "./types";

/**
 * Calls the Supabase Edge Function to generate questions from a PDF.
 * Requires:
 * - NEXT_PUBLIC_PDF_QUIZ_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY (passed as Bearer)
 */
export async function pdfToQuestions(pdfFile: File): Promise<Question[]> {
  const url = process.env.NEXT_PUBLIC_PDF_QUIZ_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const formData = new FormData();
  formData.append("pdf", pdfFile);

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${anon}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PDF quiz failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  if (!json || !Array.isArray(json.questions)) {
    throw new Error("Invalid response format from PDF quiz endpoint");
  }
  return json.questions as Question[];
}
