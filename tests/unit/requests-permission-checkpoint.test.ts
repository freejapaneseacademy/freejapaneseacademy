import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c03-chk-v1.json';
import { scoreRequestsCheckpoint } from '../../src/components/interactive/RequestsChapterCheckpoint';

describe('n5-m06-c03-chk written checkpoint', () => {
  it('has sixteen uniquely keyed, distinct-choice questions', () => {
    expect(bank.items).toHaveLength(16);
    expect(new Set(bank.items.map(q => q.id)).size).toBe(16);
    for (const q of bank.items) {
      expect(q.status).toBe('drafted');
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c => c.text.normalize('NFC'))).size).toBe(3);
      expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
      expect(q.choices.every(c => c.rationale.length > 10)).toBe(true);
    }
  });
  it('scores correct, partial and empty answers', () => {
    const correct = Object.fromEntries(bank.items.map(q => [q.id,q.answerKey.choiceId]));
    expect(scoreRequestsCheckpoint(correct)).toBe(16);
    expect(scoreRequestsCheckpoint({})).toBe(0);
    expect(scoreRequestsCheckpoint(Object.fromEntries(bank.items.slice(0,5).map(q => [q.id,q.answerKey.choiceId])))).toBe(5);
  });
  it('has six evidence-supported notice and dialogue questions', () => {
    const qs = bank.items.filter(q => q.knowledgeItemIds.some(x => /notice|dialogue/.test(x)));
    expect(qs).toHaveLength(6);
    expect(qs.every(q => q.explanation.length > 15)).toBe(true);
  });
});