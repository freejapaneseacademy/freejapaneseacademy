import { describe,it,expect } from 'vitest';
import { questions,QUIZ_ID,scoreTravelVocabulary } from '../components/interactive/TravelVocabularyPractice';
describe('n5-m05-c04-l02 itinerary vocabulary',()=>{
 it('has twelve unique, keyed questions with distinct options and feedback',()=>{
  expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of questions){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);}
 });
 it('scores correct and wrong responses without partial credit',()=>{
  expect(scoreTravelVocabulary({})).toBe(0);
  expect(scoreTravelVocabulary(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreTravelVocabulary(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
 it('uses a stable progress identifier',()=>expect(QUIZ_ID).toBe('n5-m05-c04-l02-vocab-v1'));
});