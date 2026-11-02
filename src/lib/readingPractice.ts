import bank from '../content/exercises/l0-m01-c01-l05.json';

export type ReadingRow = { id: string; printed: string; script: string; note: string; evidence: string; furigana?: string };
export type ReadingChoice = { id: string; text: string; rationale: string };
export type ReadingQuestion = {
  id: string; version: number; objectiveIds: string[]; knowledgeItemIds: string[];
  prompt: string; choices: ReadingChoice[]; answerKey: { choiceId: string };
  explanation: string; evidence: string; type: 'single-choice'; status: 'published';
  level: 'l0'; skills: string[];
};
export const readingLessonId = 'l0-m01-c01-l05';
export const readingQuizId = readingLessonId + '-check-v1';
export const readingChartId = 'l0-m01-c01-l05-chart-v1';
export const readingRows: ReadingRow[] = [
  {
    "id": "A",
    "printed": "あ / ア",
    "script": "Hiragana + katakana",
    "note": "Both represent the vowel a; あ is hiragana and ア is katakana.",
    "evidence": "あ / ア"
  },
  {
    "id": "B",
    "printed": "さくら",
    "script": "Hiragana",
    "note": "Sakura means cherry blossom. All three written characters are hiragana.",
    "evidence": "さくら"
  },
  {
    "id": "C",
    "printed": "コーヒー",
    "script": "Katakana",
    "note": "Kōhī means coffee. The mark ー extends the preceding vowel.",
    "evidence": "コーヒー"
  },
  {
    "id": "D",
    "printed": "山",
    "furigana": "やま",
    "script": "Kanji + furigana",
    "note": "Yama means mountain. 山 is kanji; small やま gives its reading.",
    "evidence": "山（やま）"
  },
  {
    "id": "E",
    "printed": "ひらがな",
    "script": "Hiragana",
    "note": "This is the name of the hiragana script, written in hiragana.",
    "evidence": "ひらがな"
  },
  {
    "id": "F",
    "printed": "カタカナ",
    "script": "Katakana",
    "note": "This is the name of the katakana script, written in katakana.",
    "evidence": "カタカナ"
  },
  {
    "id": "G",
    "printed": "sakura",
    "script": "Romaji (Latin letters)",
    "note": "A Japanese reading in Latin letters, not the English meaning cherry blossom.",
    "evidence": "sakura"
  },
  {
    "id": "H",
    "printed": "先生",
    "furigana": "せんせい",
    "script": "Kanji + furigana",
    "note": "Sensei means teacher. Small せんせい shows how to read the kanji.",
    "evidence": "先生（せんせい）"
  },
  {
    "id": "I",
    "printed": "もういちど おねがいします",
    "script": "Hiragana",
    "note": "Mō ichido onegai shimasu politely requests: One more time, please.",
    "evidence": "もういちど おねがいします"
  }
];
export const readingQuestions = (bank as unknown as {items:ReadingQuestion[]}).items;
export function isReadingAnswerCorrect(q:ReadingQuestion, answer:string) {
  return q.answerKey.choiceId === answer;
}
export function scoreReadingQuestions(questions:ReadingQuestion[], answers:Record<string,string>) {
  return questions.reduce((score,q)=>score+Number(isReadingAnswerCorrect(q,answers[q.id]??'')),0);
}
export function validateReadingQuestions(questions:ReadingQuestion[], chart:ReadingRow[]) {
  const ids=new Set<string>();
  const rowIds=new Set(chart.map(r=>r.id));
  if(chart.length!==9 || rowIds.size!==chart.length) throw new Error('Chart row identifiers must be unique.');
  if(questions.length!==12) throw new Error('Expected 12 original reading questions.');
  for(const q of questions) {
    if(ids.has(q.id)) throw new Error('Duplicate question '+q.id);
    ids.add(q.id);
    if(!q.id.startsWith('ex-l0-m01-c01-l05-') || q.version!==1 ||
      q.type!=='single-choice' || !q.prompt.trim() || !q.explanation.trim() ||
      !q.evidence.trim() || !q.objectiveIds.length || !q.knowledgeItemIds.length ||
      !q.skills.length) throw new Error('Invalid question metadata '+q.id);
    const choices=q.choices.map(c=>c.id);
    if(choices.length!==3 || new Set(choices).size!==choices.length ||
      !choices.includes(q.answerKey.choiceId) ||
      q.choices.some(c=>!c.text.trim() || !c.rationale.trim())) throw new Error('Invalid answer options '+q.id);
    const citations=[...q.evidence.matchAll(/Row ([A-I])/g),...q.evidence.matchAll(/Rows ([A-I]) and ([A-I])/g)];
    if(!citations.length) throw new Error('Missing row evidence '+q.id);
  }
  return true;
}
