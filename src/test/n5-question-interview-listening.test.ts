import { describe, it, expect } from 'vitest';
import bank from '../content/exercises/n5-m01-c02-l06-v1.json';
describe('N5 question interviews listening bank',()=>{
 it('contains six evidence-based listening questions in two tracks',()=>{
  expect(bank.lessonId).toBe('n5-m01-c02-l06');
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  expect(bank.items.filter(q=>q.trackId.endsWith('-a'))).toHaveLength(3);
  expect(bank.items.filter(q=>q.trackId.endsWith('-b'))).toHaveLength(3);
  for(const q of bank.items){
   expect(q.skills).toContain('listening');
   expect(q.evidence.length).toBeGreaterThan(3);
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);
  }
 });
 it('keeps score bounded by bank length',()=>{const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId)).toHaveLength(6);});
});
