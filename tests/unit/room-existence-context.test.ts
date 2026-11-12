import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c03-l01-v1.json';
import { questions, QUIZ_ID, scoreRoomContext } from '../../src/components/interactive/RoomContextPractice';
describe('N5-M02-C03-L01 room existence context',()=>{
  it('has valid stable IDs, choices and evidence feedback',()=>{
    expect(QUIZ_ID).toBe('n5-m02-c03-l01-context-v1');
    expect(bank.items).toHaveLength(10);
    expect(new Set(questions.map(q=>q.id)).size).toBe(10);
    for(const q of questions){
      expect(q.id).toMatch(/^ex-n5-m02-c03-l01-q\d\d-v1$/);
      expect(q.status).toBe('internally-checked');
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(10);
    }
  });
  it('scores only keyed choices',()=>{
    expect(scoreRoomContext({})).toBe(0);
    const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreRoomContext(correct)).toBe(10);
    expect(scoreRoomContext({...correct,[questions[0].id]:'invalid'})).toBe(9);
  });
});