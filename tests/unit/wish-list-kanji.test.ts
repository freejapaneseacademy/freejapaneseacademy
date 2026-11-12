import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c02-l04-v1.json';
import { gradeWishKanji } from '../../src/components/interactive/WishListKanjiPractice';
describe('wish-list kanji',()=>{
 it('has eight keyed unique questions and specific feedback',()=>{
  expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(25);expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);}
 });
 it('grades full, empty, partial and incorrect attempts',()=>{
 const full=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(gradeWishKanji(full)).toBe(8);expect(gradeWishKanji({})).toBe(0);
 expect(gradeWishKanji({[bank.items[0].id]:bank.items[0].answerKey.choiceId})).toBe(1);
 expect(gradeWishKanji({[bank.items[0].id]:bank.items[0].choices.find(c=>c.id!==bank.items[0].answerKey.choiceId)!.id})).toBe(0);
 });
});