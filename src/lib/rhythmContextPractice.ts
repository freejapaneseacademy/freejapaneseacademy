import bank from '../content/exercises/l0-m01-c03-l01.json';
export const rhythmContextQuestions = bank.items;
export const rhythmContextQuizId = 'l0-m01-c03-l01-written-context-v1';
export function scoreRhythmContext(answers: Record<string,string>): number {
  return rhythmContextQuestions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);
}
