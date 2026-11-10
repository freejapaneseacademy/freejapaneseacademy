import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c03-l01-v1.json';
import { gradeFamilyPhotoContext } from '../../src/components/interactive/FamilyPhotoContextPractice';

describe('N5 family photo context',()=>{
  it('has unique IDs, keyed choices and individual rationales',()=>{
    expect(bank.lessonId).toBe('n5-m01-c03-l01');
    expect(bank.items).toHaveLength(10);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
    for (const q of bank.items) {
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
      expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(20);
    }
  });
  it('grades correct, absent and wrong selections',()=>{
    expect(gradeFamilyPhotoContext(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);
    expect(gradeFamilyPhotoContext({})).toBe(0);
    expect(gradeFamilyPhotoContext(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});
