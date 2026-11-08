import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c02-l01-v1.json';
describe('N/H/M/Y context bank', () => {
  it('has eight stable, unique, fully keyed questions', () => {
    expect(bank.items).toHaveLength(8);
    expect(new Set(bank.items.map(q => q.id)).size).toBe(8);
    for (const q of bank.items) {
      expect(q.id).toMatch(/^ex-l0-m04-c02-l01-/);
      expect(q.options[q.correctIndex]).toBe(q.choices.find(c => c.id === q.answerKey.choiceId)?.text);
      expect(q.choices.every(c => c.rationale.length > 12)).toBe(true);
      expect(q.objectiveIds.length).toBeGreaterThan(0);
    }
  });
});
