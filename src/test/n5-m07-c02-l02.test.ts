import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m07-c02-l02-v1.json';
import {QUIZ_ID,questions,scoreWishesVocabulary} from '../components/interactive/WishesVocabularyPractice';
describe('n5-m07-c02-l02 plans and wishes vocabulary',()=>{
 it('has stable IDs, keyed choices and feedback',()=>{expect(QUIZ_ID).toBe('n5-m07-c02-l02-vocabulary-v1');expect(questions).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.id).toMatch(/^ex-n5-m07-c02-l02-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);expect(q.evidence.length).toBeGreaterThan(5)}});
 it('scores exact IDs',()=>{expect(scoreWishesVocabulary({})).toBe(0);expect(scoreWishesVocabulary(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);expect(scoreWishesVocabulary(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0)})
});