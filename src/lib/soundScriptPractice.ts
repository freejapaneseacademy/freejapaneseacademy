import bank from '../content/exercises/l0-m01-c02-l04.json';

export type SoundScriptChoice = { id: string; text: string; rationale: string };
type Base = { id: string; version: number; objectiveIds: string[]; knowledgeItemIds: string[]; prompt: string; example?: string; explanation: string; status: 'published'; level: 'l0'; skills: string[] };
export type SoundScriptQuestion = Base & (
  | { type: 'single-choice'; choices: SoundScriptChoice[]; answerKey: { choiceId: string } }
  | { type: 'short-input'; answerKey: { accepted: string[]; normalization: 'trim-and-unicode-nfc' } }
);
export const soundScriptLessonId = 'l0-m01-c02-l04';
export const soundScriptQuizId = soundScriptLessonId + '-check-v1';
export const soundScriptQuestions = (bank as { items: SoundScriptQuestion[] }).items;
export const soundScriptPalette = ['あ','い','う','え','お','か','き','く','け','こ','さ','す','し'] as const;
export const soundScriptCards = [
  { cue: 'k + a', glyph: 'か', context: 'The first kana in かさ (umbrella) and かお (face).' },
  { cue: 'k + i', glyph: 'き', context: 'Compare its printed form with け (ke).' },
  { cue: 'k + u', glyph: 'く', context: 'A k-row kana that uses the u vowel.' },
  { cue: 'k + e', glyph: 'け', context: 'Do not confuse ke with き (ki).' },
  { cue: 'k + o', glyph: 'こ', context: 'The last kana in the five-vowel k-row.' },
  { cue: 's + a', glyph: 'さ', context: 'The second kana in かさ (umbrella).' },
  { cue: 's + u', glyph: 'す', context: 'The first kana in すし (sushi).' },
  { cue: 'sh + i', glyph: 'し', context: 'The second kana in すし; beginner romaji writes shi.' }
] as const;
export const normalizeSoundScriptInput = (text: string) => text.trim().normalize('NFC');
export function isSoundScriptCorrect(q: SoundScriptQuestion, answer: string) {
  return q.type === 'single-choice'
    ? answer === q.answerKey.choiceId
    : q.answerKey.accepted.some(a => normalizeSoundScriptInput(a) === normalizeSoundScriptInput(answer));
}
export function scoreSoundScript(answers: Record<string,string>, qs: SoundScriptQuestion[] = soundScriptQuestions) {
  return qs.reduce((total,q) => total + Number(isSoundScriptCorrect(q,answers[q.id] ?? '')),0);
}
export function validateSoundScript(qs: SoundScriptQuestion[] = soundScriptQuestions) {
  if (qs.length !== 12 || qs.filter(q => q.type === 'short-input').length !== 4) throw new Error('Expected 8 choice and 4 kana-entry items');
  const ids = new Set<string>();
  for (const q of qs) {
    if (ids.has(q.id) || !/^ex-l0-m01-c02-l04-\d{3}$/.test(q.id) || q.version !== 1 || q.level !== 'l0' || q.status !== 'published' || !q.prompt.trim() || !q.explanation.trim() || !q.objectiveIds.length || !q.knowledgeItemIds.length || !q.skills.length || !q.objectiveIds.every(id => /^l0-m01-c02-l04-o[123]$/.test(id))) throw new Error('Invalid question metadata: ' + q.id);
    ids.add(q.id);
    if (q.type === 'single-choice') {
      const keys = q.choices.map(c => c.id), labels = q.choices.map(c => c.text.normalize('NFC').trim());
      if (keys.length < 2 || new Set(keys).size !== keys.length || new Set(labels).size !== labels.length || !keys.includes(q.answerKey.choiceId) || q.choices.some(c => !c.id || !c.text.trim() || !c.rationale.trim())) throw new Error('Invalid choices: ' + q.id);
    } else if (q.answerKey.normalization !== 'trim-and-unicode-nfc' || q.answerKey.accepted.length !== 1 || !q.answerKey.accepted[0].trim() || ![...q.answerKey.accepted[0]].every(c => soundScriptPalette.includes(c as typeof soundScriptPalette[number]))) throw new Error('Invalid kana input key: ' + q.id);
  }
  return true;
}
