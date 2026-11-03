import bank from '../content/exercises/l0-m01-c02-l07.json';

export type SoundWritingQuestion = {
  id: string;
  version: number;
  status: 'published';
  type: 'short-input';
  level: 'l0';
  prompt: string;
  inputScript: 'hiragana';
  objectiveIds: string[];
  knowledgeItemIds: string[];
  skills: string[];
  explanation: string;
  answerKey: { accepted: string[]; normalization: 'trim-and-unicode-nfc' };
};

export const soundWritingLessonId = 'l0-m01-c02-l07';
export const soundWritingQuizId = soundWritingLessonId + '-check-v1';
export const soundWritingQuestions = (bank as unknown as { items: SoundWritingQuestion[] }).items;
export const soundWritingPalette = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'す', 'し', 'ば', 'ん'] as const;
export const soundWritingCards = [
  { id: 'house', cue: 'A picture of a house', correct: 'いえ', options: ['いえ', 'いいえ'] },
  { id: 'no', cue: 'A polite reply meaning “No”', correct: 'いいえ', options: ['いえ', 'いいえ'] },
  { id: 'aunt', cue: 'An aunt on a fictional family chart', correct: 'おばさん', options: ['おばさん', 'おばあさん'] },
  { id: 'grandmother', cue: 'A grandmother on the same chart', correct: 'おばあさん', options: ['おばさん', 'おばあさん'] }
] as const;

export const soundWritingRubric = [
  { id: 'purpose', title: 'Task and meaning', check: 'My two Japanese lines identify the umbrella and politely correct the house picture; my English note gives the intended meanings.' },
  { id: 'forms', title: 'Kana and vowel length', check: 'I used Japanese kana rather than Latin letters and kept the extra い in いいえ and あ in おばあさん.' },
  { id: 'morae', title: 'Timing evidence', check: 'I explained いえ (2) versus いいえ (3), and おばさん (4) versus おばあさん (5), counting ん as a mora.' },
  { id: 'revision', title: 'Context and revision', check: 'I checked each expression against its fictional situation and revised anything ambiguous; this is my own self-review.' }
] as const;

export const normalizeSoundWriting = (value: string) => value.trim().normalize('NFC');
export function isSoundWritingCorrect(question: SoundWritingQuestion, answer: string) {
  return question.answerKey.accepted.some(target => normalizeSoundWriting(target) === normalizeSoundWriting(answer));
}
export function scoreSoundWriting(questions: SoundWritingQuestion[], answers: Record<string, string>) {
  return questions.reduce((sum, q) => sum + Number(isSoundWritingCorrect(q, answers[q.id] ?? '')), 0);
}
export function validateSoundWritingQuestions(questions: SoundWritingQuestion[]) {
  if (questions.length !== 10) throw new Error('Expected ten written production items.');
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id) || !/^ex-l0-m01-c02-l07-\d{3}$/.test(q.id)) throw new Error('Duplicate or invalid item ID: ' + q.id);
    ids.add(q.id);
    if (q.version !== 1 || q.type !== 'short-input' || q.status !== 'published' || q.level !== 'l0' ||
      q.inputScript !== 'hiragana' || !q.prompt.trim() || !q.explanation.trim() ||
      !q.objectiveIds.length || q.objectiveIds.some(id => !id.startsWith('l0-m01-c02-l07-o')) ||
      !q.knowledgeItemIds.length || !q.skills.length || q.answerKey.normalization !== 'trim-and-unicode-nfc' ||
      q.answerKey.accepted.length !== 1 || !q.answerKey.accepted[0] ||
      [...q.answerKey.accepted[0]].some(char => !soundWritingPalette.includes(char as typeof soundWritingPalette[number]))) {
      throw new Error('Invalid or untypeable written item: ' + q.id);
    }
  }
  return true;
}
