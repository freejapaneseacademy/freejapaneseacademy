import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c02-l01-v1.json';
import { questions, QUIZ_ID, scoreCampusDirections } from '../../src/components/interactive/CampusDirectionsPractice';
describe('N5-M02-C02-L01 campus directions context',()=>{
  it('has unique stable IDs, valid keys and feedback',()=>{
    expect(QUIZ_ID).toBe('n5-m02-c02-l01-context-v1');
    expect(bank.items).toHaveLength(10);
    expect(new Set(questions.map(q=>q.id)).size).toBe(10);
    for(const q of questions){
      expect(q.id).toMatch(/^ex-n5-m02-c02-l01-q\d\d-v1$/);
      expect(q.status).toBe('internally-checked');
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(10);
    }
  });
  it('scores only exact answers and ignores unanswered items',()=>{
    expect(scoreCampusDirections({})).toBe(0);
    const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreCampusDirections(correct)).toBe(10);
    expect(scoreCampusDirections({...correct,[questions[0].id]:'invalid'})).toBe(9);
  });
});
