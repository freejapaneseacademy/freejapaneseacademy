import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c01-l04-v1.json';
import {questions,scoreFoodKanji,QUIZ_ID} from '../../src/components/interactive/FoodKanjiPractice';
describe('n5-m04-c01-l04 food kanji',()=>{
 it('has 12 unique, keyed, explained items',()=>{expect(bank.lessonId).toBe('n5-m04-c01-l04');expect(questions).toHaveLength(12);expect(new Set(questions.map(q=>q.id)).size).toBe(12);for(const q of questions){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}});
 it('scores correct, empty, and incorrect responses',()=>{expect(scoreFoodKanji(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);expect(scoreFoodKanji({})).toBe(0);expect(scoreFoodKanji(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);expect(QUIZ_ID).toBe('n5-m04-c01-l04-food-kanji-v1');});
});
