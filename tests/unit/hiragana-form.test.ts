import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c01-l04-v1.json';
describe('L0 M02 C01 L04 kana assessment',()=>{
 it('contains fifteen unique typed kana and five unique visual choices',()=>{
  expect(bank.items).toHaveLength(20);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(20);
  expect(bank.items.filter(q=>q.type==='short-input')).toHaveLength(15);
  expect(bank.items.filter(q=>q.type==='single-choice')).toHaveLength(5);
 });
 it('all answer keys and explanations are complete',()=>{
  for(const q of bank.items){
   expect(q.explanation.length).toBeGreaterThan(15);
   if(q.type==='short-input')expect(q.answer).toMatch(/^[あ-ん]$/u);
   else {const index=q.correctIndex ?? -1; expect((q.options ?? [])[index]).toBeTruthy();expect(q.answerKey.choiceId).toBe((q.choices ?? [])[index]?.id);}
  }
 });
});
