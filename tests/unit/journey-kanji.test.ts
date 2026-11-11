import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c01-l04-v1.json';
import {scoreAnswers} from '../../src/components/interactive/JourneyKanjiPractice';
describe('n5-m05-c01-l04 journey kanji',()=>{
 it('has ten unique keyed questions and explanatory rationales',()=>{
 expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
 for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('scores correct and incorrect selections',()=>{
 const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
 expect(scoreAnswers(correct)).toBe(10);expect(scoreAnswers({})).toBe(0);
 const wrong={...correct,[bank.items[0].id]:bank.items[0].choices.find(c=>c.id!==bank.items[0].answerKey.choiceId)!.id};
 expect(scoreAnswers(wrong)).toBe(9);
 });
});