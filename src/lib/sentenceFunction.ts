import bank from '../content/exercises/l0-m01-c01-l03.json';

export type SentenceChoice = { id: string; text: string; rationale: string };
export type SentenceQuestion = {
  id: string;
  version: number;
  objectiveIds: string[];
  knowledgeItemIds: string[];
  prompt: string;
  example?: string;
  explanation: string;
  type: 'single-choice';
  choices: SentenceChoice[];
  answerKey: { choiceId: string };
  status: 'published';
  level: 'l0';
  skills: string[];
};

export const sentenceLessonId = 'l0-m01-c01-l03';
export const sentenceQuizId = sentenceLessonId + '-check-v1';
export const sentenceQuestions = (bank as unknown as { items: SentenceQuestion[] }).items;

export function isSentenceAnswerCorrect(q: SentenceQuestion, response: string) {
  return q.answerKey.choiceId === response;
}
export function scoreSentenceQuestions(questions: SentenceQuestion[], answers: Record<string,string>) {
  return questions.reduce((sum,q)=>sum + Number(isSentenceAnswerCorrect(q,answers[q.id]??'')),0);
}
export function validateSentenceQuestions(questions: SentenceQuestion[]) {
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id)) throw new Error('Duplicate question: '+q.id);
    ids.add(q.id);
    if (!q.id.startsWith('ex-l0-m01-c01-l03-') || q.version < 1 || !q.prompt.trim() ||
      !q.explanation.trim() || !q.objectiveIds.length || !q.knowledgeItemIds.length ||
      !q.skills.length || q.type !== 'single-choice') throw new Error('Invalid metadata: '+q.id);
    const choices=q.choices.map(c=>c.id);
    if (choices.length<2 || new Set(choices).size!==choices.length || !choices.includes(q.answerKey.choiceId) ||
      q.choices.some(c=>!c.text.trim()||!c.rationale.trim())) throw new Error('Invalid choices: '+q.id);
  }
  return true;
}
