import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c02-l01-v1.json';
import { gradeDailyRoutineContext } from '../../src/components/interactive/DailyRoutineContextPractice';
describe('n5-m03-c02-l01 assessment integrity',()=>{
  it('has ten unique keyed questions and valid choices',()=>{
    expect(bank.items).toHaveLength(10);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
    for(const q of bank.items){
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
      expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
    }
  });
  it('grades exact keyed selections and no unanswered selections',()=>{
    const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
    expect(gradeDailyRoutineContext(answers)).toBe(10);
    expect(gradeDailyRoutineContext({})).toBe(0);
  });
});