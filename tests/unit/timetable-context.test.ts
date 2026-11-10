import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c01-l01-v1.json';
import { questions, QUIZ_ID, scoreTimetable } from '../../src/components/interactive/TimetableContextPractice';
describe('n5-m03-c01-l01 timetable context',()=>{
  it('has ten distinct valid keyed questions and explanatory feedback',()=>{
    expect(QUIZ_ID).toBe('n5-m03-c01-l01-context-v1');
    expect(bank.items).toHaveLength(10);
    expect(new Set(questions.map(q=>q.id)).size).toBe(10);
    for(const q of questions){
      expect(q.id).toMatch(/^ex-n5-m03-c01-l01-q\d\d-v1$/);
      expect(q.status).toBe('internally-checked');
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(8);
    }
  });
  it('scores only keyed choices',()=>{
    expect(scoreTimetable({})).toBe(0);
    const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreTimetable(correct)).toBe(10);
    expect(scoreTimetable({...correct,[questions[0].id]:'not-a-choice'})).toBe(9);
  });
});