import bank from '../content/exercises/l0-m01-c02-l03.json';

export type VowelFunctionChoice = { id: string; text: string; rationale: string };
type BaseQuestion = {
  id: string; version: number; objectiveIds: string[]; knowledgeItemIds: string[];
  prompt: string; example?: string; explanation: string; status: 'published';
  level: 'l0'; skills: string[];
};
export type VowelFunctionQuestion = BaseQuestion & (
  | { type: 'single-choice'; choices: VowelFunctionChoice[]; answerKey: { choiceId: string } }
  | { type: 'short-input'; answerKey: { accepted: string[]; normalization: 'trim-and-unicode-nfc' } }
);
export const vowelFunctionLessonId = 'l0-m01-c02-l03';
export const vowelFunctionQuizId = vowelFunctionLessonId + '-check-v1';
export const vowelFunctionQuestions = (bank as unknown as { items: VowelFunctionQuestion[] }).items;

export const normalizeVowelFunctionInput = (value: string) => value.trim().normalize('NFC');

export function isVowelFunctionCorrect(q: VowelFunctionQuestion, response: string) {
  if (q.type === 'single-choice') return response === q.answerKey.choiceId;
  return q.answerKey.accepted.some(accepted => normalizeVowelFunctionInput(response) === normalizeVowelFunctionInput(accepted));
}

export function scoreVowelFunction(answers: Record<string, string>, questions: VowelFunctionQuestion[] = vowelFunctionQuestions) {
  return questions.reduce((score, q) => score + Number(isVowelFunctionCorrect(q, answers[q.id] ?? '')), 0);
}

export function validateVowelFunction(questions: VowelFunctionQuestion[] = vowelFunctionQuestions) {
  if (questions.length !== 12) throw new Error('Expected twelve L03 questions');
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id) || !/^ex-l0-m01-c02-l03-\d{3}$/.test(q.id) || q.version !== 1 ||
        q.status !== 'published' || q.level !== 'l0' || !q.prompt.trim() || !q.explanation.trim() ||
        !q.objectiveIds.length || !q.knowledgeItemIds.length || !q.skills.length) {
      throw new Error('Invalid vowel function question: ' + q.id);
    }
    ids.add(q.id);
    if (q.type === 'single-choice') {
      const ids = q.choices.map(c => c.id);
      const texts = q.choices.map(c => c.text.trim().normalize('NFC'));
      if (ids.length < 2 || new Set(ids).size !== ids.length || new Set(texts).size !== texts.length ||
          !ids.includes(q.answerKey.choiceId) || q.choices.some(c => !c.id || !c.text.trim() || !c.rationale.trim())) {
        throw new Error('Invalid choice key: ' + q.id);
      }
    } else if (q.type === 'short-input') {
      if (q.answerKey.normalization !== 'trim-and-unicode-nfc' || !q.answerKey.accepted.length ||
          q.answerKey.accepted.some(s => !s.trim())) throw new Error('Invalid typed key: ' + q.id);
    } else throw new Error('Unsupported question type');
  }
  return true;
}
