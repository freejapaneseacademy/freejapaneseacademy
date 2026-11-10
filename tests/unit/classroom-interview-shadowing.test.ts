import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c02-l08-v1.json';
describe('n5-m01-c02-l08 speaking support',()=>{
 it('has unique versioned items with valid keys and rationales',()=>{
  expect(bank.lessonId).toBe('n5-m01-c02-l08');expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.version).toBe(1);expect(q.status).toBe('internally-checked');expect(q.choices.find(c=>c.id===q.answerKey.choiceId)).toBeTruthy();expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('has distinct answer choices',()=>{for(const q of bank.items)expect(new Set(q.choices.map(c=>c.text)).size).toBe(q.choices.length)});
});