import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c02-l03-v1.json';
import {questions,scoreShoppingGrammar,QUIZ_ID} from '../../src/components/interactive/ShoppingGrammarPractice';
describe('n5-m04-c02-l03 grammar bank',()=>{
 it('has stable IDs, one correct key, distinct options and rationales',()=>{
 expect(QUIZ_ID).toBe('n5-m04-c02-l03-shopping-grammar-v1');
 expect(questions).toHaveLength(10);
 expect(new Set(questions.map(q=>q.id)).size).toBe(10);
 for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);}
 });
 it('scores correct, blank and wrong submissions',()=>{
 const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
 expect(scoreShoppingGrammar(correct)).toBe(10);
 expect(scoreShoppingGrammar({})).toBe(0);
 const wrong=Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
 expect(scoreShoppingGrammar(wrong)).toBe(0);
 });
});