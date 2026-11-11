import { describe,it,expect } from 'vitest';
import bank from '../src/content/exercises/l0-m03-c01-l07-v1.json';
describe('L07 marked-kana written assessment',()=>{
 it('has ten distinct stable ids and evidence-backed answer keys',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.answerKey.accepted).toContain(q.answer);expect(q.evidence.phrase).toBe(q.answer);expect(q.explanation.length).toBeGreaterThan(20);}
 });
 it('tests dakuten and handakuten without confusing everyday bread orthography',()=>{
  expect(bank.items.find(q=>q.answer==='ぱん')?.explanation).toContain('パン');
  expect(bank.items.find(q=>q.answer==='みず')?.explanation).toContain('ず');
 });
});