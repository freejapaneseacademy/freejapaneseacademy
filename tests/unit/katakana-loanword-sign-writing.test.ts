import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c04-l07-v1.json';
import { gradeWord } from '../../src/components/interactive/LoanwordSignWriting';
describe('station café writing bank',()=>{
 it('contains eight unique versioned schema-compliant short-input items',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c04-l07-/);expect(q.status).toBe('drafted');expect(q.version).toBe(1);expect(q.answerKey.normalization).toBe('trim-and-unicode-nfc');expect(q.answerKey.accepted.length).toBeGreaterThan(0);expect(q.explanation.length).toBeGreaterThan(12);expect(q.objectiveIds.length).toBeGreaterThan(0);expect(q.knowledgeItemIds.length).toBeGreaterThan(0);}
 });
 it('normalizes whitespace and NFC but rejects missing vowel marks',()=>{
  expect(gradeWord('  コーヒー  ',['コーヒー'])).toBe(true);
  expect(gradeWord('コヒー',['コーヒー'])).toBe(false);
  expect(gradeWord('テイー',['ティー'])).toBe(false);
 });
});