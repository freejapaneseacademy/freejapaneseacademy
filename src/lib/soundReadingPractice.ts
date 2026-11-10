import bank from '../content/exercises/l0-m01-c02-l05.json';

export type SoundReadingRow = { id: string; printed: string; category: string; note: string; evidence: string };
export type SoundReadingChoice = { id: string; text: string; rationale: string };
export type SoundReadingQuestion = {
  id: string; version: number; status: 'published'; type: 'single-choice'; level: 'l0';
  objectiveIds: string[]; knowledgeItemIds: string[]; skills: string[];
  prompt: string; choices: SoundReadingChoice[]; answerKey: { choiceId: string };
  explanation: string; evidence: string;
};
export const soundReadingLessonId = 'l0-m01-c02-l05';
export const soundReadingQuizId = soundReadingLessonId + '-check-v1';
export const soundReadingMapId = soundReadingLessonId + '-map-v1';
export const soundReadingRows: SoundReadingRow[] = [
  {
    "id": "A",
    "printed": "あ / ア",
    "category": "Vowel a · hiragana / katakana",
    "note": "Open, steady a vowel. Each character represents one mora.",
    "evidence": "あ / ア"
  },
  {
    "id": "B",
    "printed": "い / イ",
    "category": "Vowel i · hiragana / katakana",
    "note": "High front i vowel; each character represents one mora.",
    "evidence": "い / イ"
  },
  {
    "id": "C",
    "printed": "う / ウ",
    "category": "Vowel u · hiragana / katakana",
    "note": "High vowel usually without strong English 'oo' lip rounding; one mora.",
    "evidence": "う / ウ"
  },
  {
    "id": "D",
    "printed": "え / エ",
    "category": "Vowel e · hiragana / katakana",
    "note": "Mid front e vowel, distinct from i; one mora.",
    "evidence": "え / エ"
  },
  {
    "id": "E",
    "printed": "お / オ",
    "category": "Vowel o · hiragana / katakana",
    "note": "Mid back o vowel; do not add an English-style glide; one mora.",
    "evidence": "お / オ"
  },
  {
    "id": "F",
    "printed": "か・き・く・け・こ",
    "category": "Hiragana k-row",
    "note": "ka, ki, ku, ke, ko: five ordinary CV kana, one mora each (five in sequence).",
    "evidence": "か・き・く・け・こ"
  },
  {
    "id": "G",
    "printed": "かさ",
    "category": "Hiragana picture label",
    "note": "か・さ: two morae. Kasa means umbrella in Emi's picture cards.",
    "evidence": "か・さ"
  },
  {
    "id": "H",
    "printed": "いえ",
    "category": "Hiragana picture label",
    "note": "い・え: two morae. Ie means house in Emi's picture cards.",
    "evidence": "い・え"
  },
  {
    "id": "I",
    "printed": "いいえ",
    "category": "Hiragana reply",
    "note": "い・い・え: three morae. Iie means no in Emi's reply.",
    "evidence": "い・い・え"
  },
  {
    "id": "J",
    "printed": "おばさん / おばあさん",
    "category": "Hiragana family labels",
    "note": "Aunt: お・ば・さ・ん (four); grandmother: お・ば・あ・さ・ん (five). ん counts as one mora.",
    "evidence": "お・ば・あ・さ・ん"
  },
  {
    "id": "K",
    "printed": "コーヒー",
    "category": "Katakana loanword",
    "note": "コ・ー・ヒ・ー: four morae. Each ー extends the preceding vowel; kōhī means coffee.",
    "evidence": "コ・ー・ヒ・ー"
  }
];
export const soundReadingQuestions = (bank as { items: SoundReadingQuestion[] }).items;
export const isSoundReadingCorrect = (q: SoundReadingQuestion, answer: string) => q.answerKey.choiceId === answer;
export function scoreSoundReading(answers: Record<string,string>) {
  return soundReadingQuestions.reduce((n,q)=>n+Number(isSoundReadingCorrect(q,answers[q.id]??'')),0);
}
export function validateSoundReading(questions: SoundReadingQuestion[] = soundReadingQuestions, rows: SoundReadingRow[] = soundReadingRows) {
  if (rows.length !== 11 || new Set(rows.map(r=>r.id)).size !== 11) throw new Error('Map must have eleven unique rows.');
  if (questions.length !== 12 || new Set(questions.map(q=>q.id)).size !== 12) throw new Error('Map must have twelve unique questions.');
  for (const row of rows) {
    if (!row.printed || !row.note || !row.evidence) throw new Error('Incomplete map row '+row.id);
  }
  for (const q of questions) {
    if (!q.id.startsWith('ex-l0-m01-c02-l05-') || q.version !== 1 || q.status !== 'published' ||
        q.type !== 'single-choice' || q.level !== 'l0' || !q.prompt || !q.explanation ||
        !q.objectiveIds.length || !q.knowledgeItemIds.length || !q.skills.length ||
        !q.evidence || !/Row [A-K]/.test(q.evidence)) throw new Error('Invalid question '+q.id);
    const ids = q.choices.map(c=>c.id);
    if (ids.length !== 3 || new Set(ids).size !== 3 || !ids.includes(q.answerKey.choiceId) ||
        q.choices.some(c=>!c.text || !c.rationale)) throw new Error('Invalid choices '+q.id);
    const cited = q.evidence.match(/Row ([A-K])/);
    const row = rows.find(r=>r.id===cited?.[1]);
    if (!row || !(q.evidence.includes(row.evidence) || q.evidence.includes(row.printed))) throw new Error('Evidence does not match map '+q.id);
    const correct = q.choices.find(c=>c.id===q.answerKey.choiceId);
    if (correct?.text !== 'Row '+row.id) throw new Error('Key and evidence disagree '+q.id);
  }
  return true;
}
