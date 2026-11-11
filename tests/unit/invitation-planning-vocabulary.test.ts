import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c04-l02-v1.json';
import { scoreInvitationWords } from '../../src/components/interactive/InvitationWordsPractice';
describe('n5-m04-c04-l02 invitation vocabulary',()=>{
 it('contains twelve unique, keyed and explained questions',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.status).toBe('internally-checked');
   expect(q.choices).toHaveLength(4);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
  }
 });
 it('scores exact answer IDs, not visible text',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreInvitationWords(correct)).toBe(12);
  expect(scoreInvitationWords({})).toBe(0);
  const first=bank.items[0];
  expect(scoreInvitationWords({...correct,[first.id]:first.choices.find(c=>c.id!==first.answerKey.choiceId)!.id})).toBe(11);
 });
});
