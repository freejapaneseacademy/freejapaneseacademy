import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c04-l02-v1.json';
import {questions,QUIZ_ID,scoreRoomVocabulary} from '../../src/components/interactive/RoomVocabularyPractice';
describe('n5-m02-c04-l02 room vocabulary',()=>{
 it('has thirteen unique well-keyed items with distractor feedback',()=>{
  expect(QUIZ_ID).toBe('n5-m02-c04-l02-vocabulary-v1');expect(bank.items).toHaveLength(13);
  expect(new Set(questions.map(q=>q.id)).size).toBe(13);
  for(const q of questions){expect(q.id).toMatch(/^ex-n5-m02-c04-l02-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);expect(q.explanation.length).toBeGreaterThan(15);}
 });
 it('scores only exact choice IDs',()=>{expect(scoreRoomVocabulary({})).toBe(0);const all=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreRoomVocabulary(all)).toBe(13);expect(scoreRoomVocabulary({...all,[questions[0].id]:'wrong'})).toBe(12);});
});