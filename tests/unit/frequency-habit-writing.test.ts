import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c04-l07-v1.json';
import { gradeFrequencyHabitWriting } from '../../src/components/interactive/FrequencyHabitWritingWorkshop';
describe('n5-m03-c04-l07 writing check',()=>{
  it('has eight unique schema-compatible single-choice items',()=>{
    expect(bank.items).toHaveLength(8);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
    for(const q of bank.items){
      expect(q.options).toHaveLength(q.choices.length);
      expect(new Set(q.options).size).toBe(q.options.length);
      expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
      expect(q.choices.map(c=>c.text)).toEqual(q.options);
      expect(q.explanation.length).toBeGreaterThan(15);
    }
  });
  it('grades all correct and all incorrect without scoring free prose',()=>{
    const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
    const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices[(q.correctIndex+1)%q.choices.length].id]));
    expect(gradeFrequencyHabitWriting(correct)).toBe(8);
    expect(gradeFrequencyHabitWriting(wrong)).toBe(0);
  });
});