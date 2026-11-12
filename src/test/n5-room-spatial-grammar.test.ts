import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m02-c04-l03-v1.json';
import { scoreRoomGrammar } from '../components/interactive/RoomGrammarPractice';
describe('n5-m02-c04-l03 spatial grammar', () => {
  it('contains twelve uniquely keyed and explained questions', () => {
    expect(bank.items).toHaveLength(12);
    expect(new Set(bank.items.map(q => q.id)).size).toBe(12);
    for (const q of bank.items) {
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices.map(c => c.text)).size).toBe(4);
      expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(q.choices.every(c => c.rationale.length > 20)).toBe(true);
    }
  });
  it('scores empty, complete and one incorrect answer', () => {
    expect(scoreRoomGrammar({})).toBe(0);
    const answers = Object.fromEntries(bank.items.map(q => [q.id, q.answerKey.choiceId]));
    expect(scoreRoomGrammar(answers)).toBe(12);
    answers[bank.items[0].id] = 'incorrect';
    expect(scoreRoomGrammar(answers)).toBe(11);
  });
});