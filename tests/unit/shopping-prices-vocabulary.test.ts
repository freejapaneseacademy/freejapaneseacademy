import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c02-l02-v1.json';
import {questions,scoreShoppingWords,QUIZ_ID} from '../../src/components/interactive/ShoppingWordsPractice';
describe('n5-m04-c02-l02 vocabulary bank',()=>{
 it('uses stable, unique question IDs and unambiguous keys',()=>{
 expect(QUIZ_ID).toBe('n5-m04-c02-l02-shopping-words-v1');
 expect(questions).toHaveLength(12);
 expect(new Set(questions.map(q=>q.id)).size).toBe(12);
 for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);}
 });
 it('scores only the keyed choices',()=>{
 const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
 expect(scoreShoppingWords(correct)).toBe(12);
 expect(scoreShoppingWords({})).toBe(0);
 const wrong=Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
 expect(scoreShoppingWords(wrong)).toBe(0);
 });
});