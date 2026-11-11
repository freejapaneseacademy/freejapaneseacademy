import {describe,it,expect} from 'vitest';
import {studyToolsGrammarQuestions as questions,scoreStudyToolsGrammar,studyToolsGrammarQuizId} from './studyToolsGrammarPractice';
describe('Chapter 04 L03 grammar practice',()=>{
 it('uses stable unique question and choice identifiers with valid answer keys',()=>{
  expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of questions){expect(q.id).toMatch(/^c04l03-q\d{2}$/);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}
 });
 it('scores full, empty and wrong attempts correctly',()=>{
  const perfect=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
  const wrong=Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(scoreStudyToolsGrammar(perfect)).toBe(12);expect(scoreStudyToolsGrammar({})).toBe(0);expect(scoreStudyToolsGrammar(wrong)).toBe(0);
  expect(studyToolsGrammarQuizId).toBe('l0-m01-c04-l03-grammar-v1');
 });
});