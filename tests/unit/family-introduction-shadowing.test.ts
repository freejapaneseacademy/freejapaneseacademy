import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c03-l08-v1.json';
import { gradeFamilyShadowing } from '../../src/components/interactive/FamilyShadowingStudio';
describe('N5 family shadowing written preparation',()=>{
  it('has eight uniquely keyed and explained items',()=>{
    expect(bank.lessonId).toBe('n5-m01-c03-l08');
    expect(bank.items).toHaveLength(8);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
    for(const q of bank.items) {
      expect(q.choices).toHaveLength(3);
      expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
      expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(15);
    }
  });
  it('grades written answers without a speaking score',()=>{
    const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
    expect(gradeFamilyShadowing(correct)).toBe(8);
    expect(gradeFamilyShadowing({})).toBe(0);
    expect(gradeFamilyShadowing({...correct,[bank.items[0].id]:'b'})).toBe(7);
  });
});
