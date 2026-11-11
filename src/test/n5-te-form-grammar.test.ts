import { describe,expect,it } from 'vitest';
import bank from '../content/exercises/n5-m06-c02-l03-v1.json';
import {scoreTeForm} from '../components/interactive/TeFormGrammarPractice';
describe('n5-m06-c02-l03',()=>{
 it('has 12 original keyed questions with three distinct choices and per-choice feedback',()=>{
 expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
 for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);}
 });
 it('scores correct, blank and incorrect answers',()=>{
 expect(scoreTeForm(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
 expect(scoreTeForm({})).toBe(0);
 expect(scoreTeForm(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});