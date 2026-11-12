import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c04-chk-v1.json';
import { scoreOngoingCheckpoint } from '../../src/components/interactive/OngoingChapterCheckpoint';
describe('n5-m06-c04-chk written checkpoint', () => {
  it('has sixteen unique, distinct, keyed questions with feedback', () => {
    expect(bank.items).toHaveLength(16);
    expect(new Set(bank.items.map(q => q.id)).size).toBe(16);
    for (const q of bank.items) {
      expect(q.status).toBe('drafted');
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c => c.text.normalize('NFC'))).size).toBe(3);
      expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
      expect(q.choices.every(c => c.rationale.length > 15)).toBe(true);
    }
  });
  it('scores complete, partial and empty attempts', () => {
    const answers = Object.fromEntries(bank.items.map(q => [q.id,q.answerKey.choiceId]));
    expect(scoreOngoingCheckpoint(answers)).toBe(16);
    expect(scoreOngoingCheckpoint({})).toBe(0);
    expect(scoreOngoingCheckpoint(Object.fromEntries(bank.items.slice(0,6).map(q => [q.id,q.answerKey.choiceId])))).toBe(6);
  });
  it('grounds six reading items in original captions or dialogue', () => {
    const reading = bank.items.filter(q => q.knowledgeItemIds.some(x => /caption|dialogue/.test(x)));
    expect(reading).toHaveLength(6);
    expect(reading.every(q => q.explanation.length > 25)).toBe(true);
  });
});
