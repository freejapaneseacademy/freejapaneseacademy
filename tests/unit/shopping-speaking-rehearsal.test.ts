import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c02-l08-v1.json';
import {scoreShoppingSpeaking} from '../../src/components/interactive/ShoppingSpeakingRehearsal';
describe('n5-m04-c02-l08 optional speaking preparation',()=>{
 it('has eight stable keyed items with useful rationales',()=>{
  expect(bank.lessonId).toBe('n5-m04-c02-l08');expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>30)).toBe(true);expect(q.explanation.length).toBeGreaterThan(25);}
 });
 it('scores full, empty and one-wrong sets without grading speech',()=>{
  const a=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreShoppingSpeaking(a)).toBe(8);expect(scoreShoppingSpeaking({})).toBe(0);
  a[bank.items[0].id]='invalid';expect(scoreShoppingSpeaking(a)).toBe(7);
 });
});
