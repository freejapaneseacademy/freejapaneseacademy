import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m05-c04-l07-v1.json';
import { scoreTravelWriting } from '../components/interactive/TravelOutingWritingWorkshop';

describe('n5-m05-c04-l07 written outing practice', () => {
  it('uses eight unique, keyed, unambiguous single-choice questions', () => {
    expect(bank.items).toHaveLength(8);
    expect(new Set(bank.items.map(q => q.id)).size).toBe(8);
    for (const q of bank.items) {
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
      expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
    }
  });
  it('scores the complete key and does not grade creative prose', () => {
    const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreTravelWriting(correct)).toBe(8);
    expect(scoreTravelWriting({})).toBe(0);
    const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
    expect(scoreTravelWriting(wrong)).toBe(0);
  });
});