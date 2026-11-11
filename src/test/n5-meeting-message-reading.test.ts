import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m04-c04-l05-v1.json';
import {meetingMessageQuestions,scoreMeetingMessage} from '../components/interactive/MeetingMessageReadingPractice';
describe('N5-M04-C04-L05 meeting message reading',()=>{
 it('has 12 unique evidence questions with distinct choices and feedback',()=>{
  expect(bank.lessonId).toBe('n5-m04-c04-l05');
  expect(meetingMessageQuestions).toHaveLength(12);
  expect(new Set(meetingMessageQuestions.map(q=>q.id)).size).toBe(12);
  for(const q of meetingMessageQuestions){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
  }
 });
 it('scores exact IDs and distributes keys',()=>{
  const correct=Object.fromEntries(meetingMessageQuestions.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreMeetingMessage(correct)).toBe(12);
  expect(scoreMeetingMessage({})).toBe(0);
  expect(scoreMeetingMessage({[meetingMessageQuestions[0].id]:'wrong'})).toBe(0);
  expect(new Set(meetingMessageQuestions.map(q=>q.answerKey.choiceId.slice(-2))).size).toBe(3);
 });
});
