import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c03-l03-v1.json';
import {scoreDirectionGrammar} from '../../src/components/interactive/DirectionGrammarPractice';
describe('n5-m05-c03-l03 direction grammar',()=>{
 it('contains ten uniquely keyed, reviewed-structure items',()=>{
  expect(bank.lessonId).toBe('n5-m05-c03-l03');expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(4);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.choices.every(c=>c.rationale.length>25)).toBe(true);}
 });
 it('scores exact keys only',()=>{
  const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreDirectionGrammar(answers)).toBe(10);expect(scoreDirectionGrammar({})).toBe(0);
  const q=bank.items[0];expect(scoreDirectionGrammar({...answers,[q.id]:q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id})).toBe(9);
 });
});