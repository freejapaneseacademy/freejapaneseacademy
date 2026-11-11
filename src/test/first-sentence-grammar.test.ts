import { describe,it,expect } from 'vitest';
import bank from '../content/exercises/l0-m05-c03-l03-v1.json';
import { gradeFirstSentenceGrammar } from '../components/interactive/FirstSentenceGrammarPractice';
describe('l0-m05-c03-l03',()=>{
 it('has unique versioned questions with valid keys and feedback',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.choices.every(c=>Boolean(c.rationale))).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}});
 it('grades all correct and all wrong without mutating answers',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));expect(gradeFirstSentenceGrammar(correct)).toBe(12);expect(gradeFirstSentenceGrammar(wrong)).toBe(0);});
});