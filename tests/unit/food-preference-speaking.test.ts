import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c01-l08-v1.json';
import { gradeCafeSpeaking } from '../../src/components/interactive/CafeSpeakingRehearsal';
describe('optional café speaking written check',()=>{
 it('has eight unique, valid, feedback-rich questions',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){
   expect(q.choices.length).toBeGreaterThanOrEqual(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(q.choices.length);
   expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
   expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
  }
 });
 it('scores written meaning separately from optional self-check',()=>{
  const right=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeCafeSpeaking(right)).toBe(8);
  expect(gradeCafeSpeaking({})).toBe(0);
  const wrong={...right,[bank.items[0].id]:bank.items[0].choices[1].id};
  expect(gradeCafeSpeaking(wrong)).toBe(7);
 });
});
