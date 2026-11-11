import bank from '../content/exercises/l0-m01-c01-l02.json';

export type VocabularyChoice = { id: string; text: string; rationale: string };
type BaseQuestion = {
  id: string; version: number; objectiveIds: string[]; knowledgeItemIds: string[];
  prompt: string; example?: string; explanation: string; status: 'published';
  level: 'l0'; skills: string[];
};
export type VocabularyQuestion = BaseQuestion & (
  | { type: 'single-choice'; choices: VocabularyChoice[]; answerKey: { choiceId: string } }
  | { type: 'short-input'; answerKey: { accepted: string[]; normalization: 'trim-and-unicode-nfc' } }
);
export const vocabularyLessonId = 'l0-m01-c01-l02';
export const vocabularyQuizId = vocabularyLessonId + '-check-v1';
export const vocabularyQuestions = (bank as unknown as { items: VocabularyQuestion[] }).items;
export const normalizeVocabularyInput = (value: string) => value.trim().normalize('NFC');
export function isVocabularyAnswerCorrect(q: VocabularyQuestion, response: string) {
  if (q.type === 'single-choice') return response === q.answerKey.choiceId;
  return q.answerKey.accepted.some(accepted => normalizeVocabularyInput(response) === normalizeVocabularyInput(accepted));
}
export function scoreVocabularyQuestions(questions: VocabularyQuestion[], answers: Record<string,string>) {
  return questions.reduce((sum,q) => sum + Number(isVocabularyAnswerCorrect(q,answers[q.id] ?? '')),0);
}
export function validateVocabularyQuestions(questions: VocabularyQuestion[]) {
  const seen = new Set<string>();
  for (const q of questions) {
    if (seen.has(q.id)) throw new Error('Duplicate question ID: ' + q.id);
    seen.add(q.id);
    if (!q.id.startsWith('ex-l0-m01-c01-l02-') || q.version < 1 || !q.prompt || !q.explanation ||
        !q.objectiveIds.length || !q.knowledgeItemIds.length) throw new Error('Invalid question metadata: ' + q.id);
    if (q.type === 'single-choice') {
      const ids = q.choices.map(c=>c.id);
      if (ids.length < 2 || new Set(ids).size !== ids.length || !ids.includes(q.answerKey.choiceId) ||
          q.choices.some(c=>!c.text.trim()||!c.rationale.trim())) throw new Error('Invalid choices: ' + q.id);
    } else if (q.type === 'short-input') {
      if (!q.answerKey.accepted.length || q.answerKey.accepted.some(x=>!x.trim())) throw new Error('Invalid accepted answers: ' + q.id);
    } else throw new Error('Unsupported question type');
  }
  return true;
}
export const vocabularyFlashcards = [
  { term: 'ひらがな', reading: 'hiragana', meaning: 'rounded-looking kana; many words and grammar parts', use: 'Compare with カタカナ.' },
  { term: 'カタカナ', reading: 'katakana', meaning: 'kana often used for loanwords and emphasis', use: 'コーヒー is written in katakana.' },
  { term: '漢字', reading: 'かんじ · kanji', meaning: 'characters used in many Japanese words', use: '山 is one kanji character.' },
  { term: 'ローマ字', reading: 'ローマじ · rōmaji', meaning: 'Japanese written with Latin letters', use: 'sakura is romaji, not an English translation.' },
  { term: '文字', reading: 'もじ · moji', meaning: 'a written character or characters', use: '山 is one written character.' },
  { term: 'ことば', reading: 'kotoba', meaning: 'a word or expression', use: 'さくら is a word.' },
  { term: 'ふりがな', reading: 'furigana', meaning: 'small kana that show a reading', use: 'やま above 山 is furigana.' },
  { term: '読み方', reading: 'よみかた · yomikata', meaning: 'the way something is read', use: 'Ask for this when you cannot pronounce a word.' },
  { term: '意味', reading: 'いみ · imi', meaning: 'meaning', use: 'Ask for this when you do not understand a word.' },
  { term: '先生', reading: 'せんせい · sensei', meaning: 'teacher; respectful address for an instructor', use: 'せんせい、もういちどおねがいします。' },
  { term: '見てください', reading: 'みてください · mite kudasai', meaning: 'Please look.', use: 'The teacher points at the board.' },
  { term: '読んでください', reading: 'よんでください · yonde kudasai', meaning: 'Please read.', use: 'The teacher points to a sentence.' },
  { term: 'もういちどおねがいします', reading: 'mō ichido onegai shimasu', meaning: 'One more time, please.', use: 'A polite request for repetition.' }
] as const;
