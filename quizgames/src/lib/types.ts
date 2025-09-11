export type Choice = { text: string; is_correct: boolean; explanation?: string };

export type Question = {
  question_number: number;
  question_type: "mcq" | "true_false";
  question: string;              // prompt
  choices: Choice[];
};

export type TemplateRow = {
  id: string;
  name: string;
  code: string;                  // full HTML string (includes <html> … <script> … </html>)
  game_controls: unknown;        // JSONB from DB (usually array of control descriptors)
  game_instructions: string | null;
  created_at?: string;
  updated_at?: string;
  supported_question_type: "mcq" | "true_false" | null;
};

export type GameInstance = {
  question: Question;
  template: Pick<
    TemplateRow,
    "id" | "name" | "code" | "game_controls" | "game_instructions" | "supported_question_type"
  >;
  codeWithQuestion: string;      // template.code after injection + shim
};

export type GameSession = {
  createdAt: number;
  instances: GameInstance[];
  index: number;                 // current game index
};
