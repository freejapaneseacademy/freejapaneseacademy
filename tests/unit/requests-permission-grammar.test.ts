import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c03-l03-v1.json';
import { permissionGrammarQuestions,scorePermissionGrammar,PERMISSION_GRAMMAR_QUIZ_ID } from '../../src/components/interactive/PermissionGrammarPractice';
describe('requests and permission grammar bank',()=>{
 it('has twelve unique canonical questions with valid keys and distinct choices',()=>{
  expect(PERMISSION_GRAMMAR_QUIZ_ID).toBe('n5-m06-c03-l03-v1');
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.id).toMatch(/^ex-n5-m06-c03-l03-\d{2}$/);
   expect(q.status).toBe('drafted');
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(12);
  }
 });
 it('scores correct, wrong and missing answers',()=>{
  const right=Object.fromEntries(permissionGrammarQuestions.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scorePermissionGrammar(right)).toBe(12);
  expect(scorePermissionGrammar({})).toBe(0);
  const wrong=Object.fromEntries(permissionGrammarQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(scorePermissionGrammar(wrong)).toBe(0);
 });
});
