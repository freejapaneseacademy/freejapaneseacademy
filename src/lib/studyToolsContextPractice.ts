import bank from '../content/exercises/l0-m01-c04-l01.json';
export const studyToolsContextQuestions = bank.items;
export const studyToolsContextQuizId = 'l0-m01-c04-l01-written-context-v1';
export function scoreStudyToolsContext(answers: Record<string,string>): number {
  return studyToolsContextQuestions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);
}
