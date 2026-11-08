import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c01-l04-v1.json';
describe('l0-m04-c01-l04 written script bank',()=>{
 it('has eight unique, stable, schema-compliant scored questions',()=>{
  expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(x=>x.id)).size).toBe(8);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-/);expect(q.version).toBeGreaterThanOrEqual(1);expect(q.status).toBe('drafted');expect(q.objectiveIds.length).toBeGreaterThan(0);expect(q.knowledgeItemIds.length).toBeGreaterThan(0);expect(q.skills).toContain('written');expect(q.choices.length).toBe(q.options.length);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(new Set(q.options).size).toBe(q.options.length);expect(q.explanation.length).toBeGreaterThan(15);}
 });
 it('tests all three rows and vowels',()=>{expect(bank.items.map(x=>x.prompt).join(' ')).toMatch(/vowel/);expect(bank.items.map(x=>x.prompt).join(' ')).toMatch(/shi/);expect(bank.items.map(x=>x.prompt).join(' ')).toMatch(/tsu/);});
});
