import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c03-l06.json';
import { scoreListening } from '../../src/components/interactive/RequestListeningPractice';
describe('n5-m06-c03-l06 listening assessment',()=>{
 it('contains two tracks and six uniquely keyed audible questions',()=>{
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  for(const track of ['a','b']) expect(bank.items.filter(q=>q.trackId==='audio-n5-m06-c03-l06-'+track)).toHaveLength(3);
  for(const q of bank.items){expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(new Set(q.choices.map(c=>c.text)).size).toBe(q.choices.length);expect(q.evidence.length).toBeGreaterThan(4);}
 });
 it('scores only keyed selections',()=>{
  const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreListening(answers)).toBe(6);
  expect(scoreListening({})).toBe(0);
 });
});