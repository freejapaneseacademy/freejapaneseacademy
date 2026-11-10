import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m04-c03-l04-v1.json';
import {questions,scoreAdjectiveKanji,QUIZ_ID} from '../components/interactive/AdjectiveKanjiPractice';
describe('n5-m04-c03-l04 adjective kanji',()=>{
 it('has twelve structurally valid original items',()=>{
  expect(bank.lessonId).toBe('n5-m04-c03-l04');
  expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of questions){expect(q.id).toMatch(/^ex-n5-m04-c03-l04-q\d\d-v1$/);expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('scores only keyed answers',()=>{expect(QUIZ_ID).toBe('n5-m04-c03-l04-kanji-v1');expect(scoreAdjectiveKanji(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);expect(scoreAdjectiveKanji({})).toBe(0);});
});