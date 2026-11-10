import bank from '../content/exercises/l0-m01-c01-l04.json';

export type ScriptChoice = { id: string; text: string; rationale: string };
type BaseQuestion = {
  id: string; version: number; objectiveIds: string[]; knowledgeItemIds: string[];
  prompt: string; example?: string; explanation: string; status: 'published'; level: 'l0'; skills: string[];
};
export type ScriptQuestion = BaseQuestion & (
  | { type: 'single-choice'; choices: ScriptChoice[]; answerKey: { choiceId: string } }
  | { type: 'short-input'; inputScript: 'hiragana' | 'katakana'; answerKey: { accepted: string[]; normalization: 'trim-and-unicode-nfc' } }
);
export const scriptLessonId = 'l0-m01-c01-l04';
export const scriptQuizId = scriptLessonId + '-check-v1';
export const scriptQuestions = (bank as unknown as { items: ScriptQuestion[] }).items;
export const kanaPairs = [
  { hira: 'あ', kata: 'ア', romaji: 'a', cue: 'Open vowel as in the first sound of father (approximation).' },
  { hira: 'い', kata: 'イ', romaji: 'i', cue: 'High front vowel, like ee in see (approximation).' },
  { hira: 'う', kata: 'ウ', romaji: 'u', cue: 'Japanese u is not identical to English oo; avoid strong lip rounding.' },
  { hira: 'え', kata: 'エ', romaji: 'e', cue: 'Vowel similar to e in bed, but without an English glide.' },
  { hira: 'お', kata: 'オ', romaji: 'o', cue: 'A steady o vowel; do not add a final English w glide.' }
] as const;
export const kanaPalette = { hiragana: ['あ','い','う','え','お'], katakana: ['ア','イ','ウ','エ','オ'] } as const;
export const normalizeScriptInput = (value: string) => value.trim().normalize('NFC');
export function isScriptAnswerCorrect(q: ScriptQuestion, response: string) {
  return q.type === 'single-choice'
    ? response === q.answerKey.choiceId
    : q.answerKey.accepted.some(a => normalizeScriptInput(a) === normalizeScriptInput(response));
}
export function scoreScriptQuestions(questions: ScriptQuestion[], answers: Record<string,string>) {
  return questions.reduce((sum,q) => sum + Number(isScriptAnswerCorrect(q,answers[q.id] ?? '')),0);
}
export function validateScriptQuestions(questions: ScriptQuestion[]) {
  const seen = new Set<string>();
  for (const q of questions) {
    if (seen.has(q.id)) throw new Error('Duplicate question ID: '+q.id);
    seen.add(q.id);
    if (!q.id.startsWith('ex-l0-m01-c01-l04-') || q.version !== 1 ||
        !q.prompt.trim() || !q.explanation.trim() || !q.objectiveIds.length ||
        !q.knowledgeItemIds.length || !q.skills.length) throw new Error('Incomplete question metadata: '+q.id);
    if (q.type === 'single-choice') {
      const ids = q.choices.map(c=>c.id);
      if (ids.length<2 || new Set(ids).size!==ids.length ||
          new Set(q.choices.map(c=>c.text)).size!==ids.length ||
          !ids.includes(q.answerKey.choiceId) || q.choices.some(c=>!c.text.trim()||!c.rationale.trim())) {
        throw new Error('Invalid choices: '+q.id);
      }
    } else if (q.type === 'short-input') {
      if (!['hiragana','katakana'].includes(q.inputScript) || q.answerKey.normalization !== 'trim-and-unicode-nfc' ||
          q.answerKey.accepted.length !== 1 || !kanaPalette[q.inputScript].some(c=>c===q.answerKey.accepted[0])) {
        throw new Error('Invalid kana input key: '+q.id);
      }
    } else throw new Error('Unsupported question type');
  }
  return true;
}
