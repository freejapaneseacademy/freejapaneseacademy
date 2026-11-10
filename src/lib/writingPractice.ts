import bank from '../content/exercises/l0-m01-c01-l07.json';

export type WritingQuestion = {
  id: string;
  version: number;
  status: 'published';
  type: 'short-input';
  level: 'l0';
  prompt: string;
  inputScript: 'hiragana' | 'katakana';
  objectiveIds: string[];
  knowledgeItemIds: string[];
  skills: string[];
  explanation: string;
  answerKey: { accepted: string[]; normalization: 'trim-and-unicode-nfc' };
};

export const writingLessonId = 'l0-m01-c01-l07';
export const writingQuizId = writingLessonId + '-check-v1';
export const writingTaskId = writingLessonId + '-write-v1';
export const writingQuestions = (bank as unknown as { items: WritingQuestion[] }).items;

export const writingPalette: Record<WritingQuestion['inputScript'], readonly string[]> = {
  hiragana: ['あ', 'い', 'う', 'え', 'お', 'さ', 'く', 'ら', 'ひ', 'が', 'な'],
  katakana: ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'タ', 'ナ', 'コ', 'ー', 'ヒ']
};

export const writingCards = [
  { id: 'hira-a', glyph: 'あ', correctScript: 'ひらがな', meaning: 'the hiragana a card' },
  { id: 'kata-a', glyph: 'ア', correctScript: 'カタカナ', meaning: 'the katakana a card' }
] as const;
export type WritingScriptName = 'ひらがな' | 'カタカナ' | 'かんじ' | 'ローマじ';
export const writingScriptOptions: WritingScriptName[] = ['ひらがな', 'カタカナ', 'かんじ', 'ローマじ'];

export const normalizeWritingInput = (value: string) => value.trim().normalize('NFC');
export function isWritingAnswerCorrect(q: WritingQuestion, response: string) {
  return q.answerKey.accepted.some(a => normalizeWritingInput(a) === normalizeWritingInput(response));
}
export function scoreWritingQuestions(questions: WritingQuestion[], answers: Record<string, string>) {
  return questions.reduce((total, q) => total + Number(isWritingAnswerCorrect(q, answers[q.id] ?? '')), 0);
}
export function buildWritingLabel(script: WritingScriptName) {
  return 'これは' + script + 'です。';
}
export function checkWritingCard(cardId: string, chosen: WritingScriptName) {
  const card = writingCards.find(c => c.id === cardId);
  return Boolean(card && card.correctScript === chosen);
}
export const writingRubric = [
  { id: 'forms', title: 'Kana form and script', check: 'My Japanese labels use recognizable kana and the correct script; I did not substitute romaji for kana.' },
  { id: 'referents', title: 'Accurate labels', check: 'I used これは…です to identify あ as hiragana and ア as katakana, with a clear card being pointed to.' },
  { id: 'roles', title: 'Four script roles', check: 'I distinguished hiragana, katakana, kanji and romaji with at least one relevant example.' },
  { id: 'meaning', title: 'Reading versus meaning', check: 'I did not call yama or sakura an English translation; I explained their Japanese readings versus English meanings.' }
] as const;

export function validateWritingQuestions(questions: WritingQuestion[]) {
  if (questions.length !== 8) throw new Error('Expected eight L07 constrained production prompts.');
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id) || !/^ex-l0-m01-c01-l07-\d{3}$/.test(q.id)) throw new Error('Invalid or duplicate question ID: ' + q.id);
    ids.add(q.id);
    if (q.version !== 1 || q.status !== 'published' || q.type !== 'short-input' ||
      q.level !== 'l0' || !q.prompt.trim() || !q.explanation.trim() ||
      !q.objectiveIds.length || q.objectiveIds.some(id => !id.startsWith('l0-m01-c01-l07-o')) ||
      !q.knowledgeItemIds.length || !q.skills.length ||
      q.answerKey.normalization !== 'trim-and-unicode-nfc' || q.answerKey.accepted.length !== 1 ||
      !writingPalette[q.inputScript]) throw new Error('Invalid question metadata: ' + q.id);
    const answer = q.answerKey.accepted[0];
    if (!answer || [...answer].some(char => !writingPalette[q.inputScript].includes(char))) {
      throw new Error('Answer cannot be entered using the complete palette: ' + q.id);
    }
  }
  return true;
}
