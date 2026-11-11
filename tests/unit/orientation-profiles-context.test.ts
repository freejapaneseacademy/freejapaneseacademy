import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c04-l01-v1.json';
import { gradeOrientationProfiles } from '../../src/components/interactive/OrientationProfilesPractice';

describe('N5 orientation profile context',()=>{
  it('has unique IDs, keyed choices and rationales',()=>{
    expect(bank.lessonId).toBe('n5-m01-c04-l01');
    expect(bank.items).toHaveLength(8);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
    for (const q of bank.items) {
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
      expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(20);
    }
  });
  it('grades complete and incorrect responses',()=>{
    expect(gradeOrientationProfiles(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(8);
    expect(gradeOrientationProfiles({})).toBe(0);
    expect(gradeOrientationProfiles(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});
