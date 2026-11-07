import { describe,it,expect } from 'vitest';
import bank from '../content/exercises/l0-m04-c02-l04-v1.json';
import { normalizeKana,isCorrect } from '../components/interactive/KatakanaNhmyScriptPractice';
describe('N/H/M/Y script exercise integrity',()=>{
 it('has ten stable IDs, valid keys and teaching explanations',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.id.startsWith('ex-l0-m04-c02-l04-')).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(20);
   if(q.type==='single-choice') expect(q.choices?.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   else expect(q.answerKey.accepted.length).toBeGreaterThan(0);
  }
 });
 it('normalizes whitespace/NFC but distinguishes katakana from hiragana',()=>{
  expect(normalizeKana('  ミ  ')).toBe('ミ');
  const first=bank.items[0];
  expect(isCorrect(first,' ナ ')).toBe(true);
  expect(isCorrect(first,'な')).toBe(false);
  expect(isCorrect(first,'メ')).toBe(false);
 });
});
