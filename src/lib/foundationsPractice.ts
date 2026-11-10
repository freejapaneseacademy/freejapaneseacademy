import bank from '../content/exercises/l0-m01-c01-l01.json';

export type ScriptChoice = { id: string; text: string; rationale: string };
export type ScriptQuestion = {
  id: string;
  version: number;
  objectiveIds: string[];
  knowledgeItemIds: string[];
  prompt: string;
  example?: string;
  choices: ScriptChoice[];
  answerKey: { choiceId: string };
  type: 'single-choice';
  status: 'drafted';
  level: 'l0';
  skills: string[];
  explanation: string;
};

export const firstLessonId = 'l0-m01-c01-l01';
export const firstLessonQuizId = `${firstLessonId}-check-v1`;
export const scriptQuestions: ScriptQuestion[] = bank.items.map((question) => ({
  ...question,
  type: 'single-choice',
  status: 'drafted',
  level: 'l0',
}));

export function scoreScriptQuestions(questions: ScriptQuestion[], answers: Record<string,string>) {
  return questions.reduce((n, q) => n + Number(answers[q.id] === q.answerKey.choiceId), 0);
}

export function validateScriptQuestions(questions: ScriptQuestion[]) {
  const ids = new Set<string>();
  for (const question of questions) {
    if (ids.has(question.id)) throw new Error(`Duplicate question ID: ${question.id}`);
    ids.add(question.id);
    if (question.version < 1 || question.type !== 'single-choice' ||
      !question.prompt || !question.objectiveIds.length || !question.knowledgeItemIds.length)
      throw new Error(`Missing question metadata: ${question.id}`);
    const choiceIds = new Set(question.choices.map(choice => choice.id));
    if (question.choices.length < 2 || choiceIds.size !== question.choices.length ||
      !choiceIds.has(question.answerKey.choiceId) || !question.explanation)
      throw new Error(`Invalid answer key: ${question.id}`);
    if (question.choices.some(choice => !choice.text || !choice.rationale))
      throw new Error(`All choices need rationales: ${question.id}`);
  }
  return true;
}
