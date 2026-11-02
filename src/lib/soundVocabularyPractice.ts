import bank from '../content/exercises/l0-m01-c02-l02.json';

export type SoundVocabularyChoice = { id: string; text: string; rationale: string };
type BaseQuestion = {
  id: string; version: number; objectiveIds: string[]; knowledgeItemIds: string[];
  prompt: string; example?: string; explanation: string; status: 'published';
  level: 'l0'; skills: string[];
};
export type SoundVocabularyQuestion = BaseQuestion & (
  | { type: 'single-choice'; choices: SoundVocabularyChoice[]; answerKey: { choiceId: string } }
  | { type: 'short-input'; answerKey: { accepted: string[]; normalization: 'trim-and-unicode-nfc' } }
);
export const soundVocabularyLessonId = 'l0-m01-c02-l02';
export const soundVocabularyQuizId = soundVocabularyLessonId + '-check-v1';
export const soundVocabularyQuestions = (bank as unknown as { items: SoundVocabularyQuestion[] }).items;
export const normalizeSoundVocabularyInput = (value: string) => value.trim().normalize('NFC');
export function isSoundVocabularyCorrect(q: SoundVocabularyQuestion, response: string) {
  if (q.type === 'single-choice') return response === q.answerKey.choiceId;
  return q.answerKey.accepted.some(accepted => normalizeSoundVocabularyInput(response) === normalizeSoundVocabularyInput(accepted));
}
export function scoreSoundVocabulary(answers: Record<string,string>, questions: SoundVocabularyQuestion[] = soundVocabularyQuestions) {
  return questions.reduce((sum,q) => sum + Number(isSoundVocabularyCorrect(q,answers[q.id] ?? '')),0);
}
export function validateSoundVocabulary(questions: SoundVocabularyQuestion[] = soundVocabularyQuestions) {
  if (questions.length !== 14) throw new Error('Unexpected sound vocabulary question count');
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id) || !q.id.startsWith('ex-l0-m01-c02-l02-') || q.version !== 1 ||
        !q.prompt || !q.explanation || !q.objectiveIds.length || !q.knowledgeItemIds.length) {
      throw new Error('Invalid sound vocabulary question: ' + q.id);
    }
    ids.add(q.id);
    if (q.type === 'single-choice') {
      const choiceIds = q.choices.map(c=>c.id);
      if (choiceIds.length < 2 || new Set(choiceIds).size !== choiceIds.length ||
          !choiceIds.includes(q.answerKey.choiceId) || q.choices.some(c=>!c.text.trim()||!c.rationale.trim())) {
        throw new Error('Invalid choice bank: ' + q.id);
      }
    } else if (q.type === 'short-input') {
      if (q.answerKey.normalization !== 'trim-and-unicode-nfc' || !q.answerKey.accepted.length ||
          q.answerKey.accepted.some(s=>!s.trim())) throw new Error('Invalid input bank: ' + q.id);
    } else throw new Error('Unsupported question type');
  }
  return true;
}
export const soundVocabularyCards = [
  { term:'あ', reading:'a', meaning:'Japanese vowel /a/', use:'The first vowel card; not English “ay”.' },
  { term:'い', reading:'i', meaning:'Japanese vowel /i/', use:'First unit in いえ (house).' },
  { term:'う', reading:'u', meaning:'Japanese vowel /u/', use:'Less lip rounding than English “oo” is typical.' },
  { term:'え', reading:'e', meaning:'Japanese vowel /e/', use:'Second unit in いえ (house).' },
  { term:'お', reading:'o', meaning:'Japanese vowel /o/', use:'Second unit in かお (face).' },
  { term:'か', reading:'ka', meaning:'One consonant-vowel mora', use:'First unit in かさ (umbrella).' },
  { term:'し', reading:'shi', meaning:'One consonant-vowel mora', use:'Second unit in すし (sushi).' },
  { term:'いえ', reading:'ie · い・え', meaning:'house', use:'これは いえ です。 (This is a house.)' },
  { term:'いす', reading:'isu · い・す', meaning:'chair', use:'これは いす です。 (This is a chair.)' },
  { term:'かお', reading:'kao · か・お', meaning:'face', use:'A picture card showing a face.' },
  { term:'かさ', reading:'kasa · か・さ', meaning:'umbrella', use:'あおい かさ (a blue umbrella).' },
  { term:'すし', reading:'sushi · す・し', meaning:'sushi', use:'A food word; not a kana name.' },
  { term:'あお', reading:'ao · あ・お', meaning:'blue (color noun)', use:'Name the color on a palette.' },
  { term:'あおい', reading:'aoi · あ・お・い', meaning:'blue (adjective)', use:'あおい かさ (blue umbrella).' },
  { term:'いいえ', reading:'iie · い・い・え', meaning:'no (response)', use:'A reply to a question; not the word house.' }
] as const;
