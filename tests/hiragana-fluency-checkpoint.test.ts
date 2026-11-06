import { describe, expect, it } from 'vitest';
import bank from '../src/content/exercises/l0-m02-c04-chk.json';
import manifest from '../src/content/audio/l0-m02-c04-l06-v1.json';
import { scoreCheckpoint } from '../src/components/interactive/HiraganaFluencyCheckpoint';
describe('Chapter 04 checkpoint', () => {
  it('has 12 stable uniquely keyed questions with justified correct answers', () => {
    expect(bank.lessonId).toBe('l0-m02-c04-chk');
    expect(bank.items).toHaveLength(12);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
    for(const q of bank.items) {
      expect(q.choices).toHaveLength(3);
      expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
      expect(q.explanation.length).toBeGreaterThan(12);
      expect(q.evidence.length).toBeGreaterThan(0);
      expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
    }
  });
  it('scores exact answer keys and does not score missing answers', () => {
    const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreCheckpoint(bank.items,answers)).toBe(12);
    expect(scoreCheckpoint(bank.items,{})).toBe(0);
  });
  it('reuses the two cleared recorded conversations', () => {
    expect(manifest.assets).toHaveLength(2);
    expect(manifest.assets.every(a=>a.rights.redistributionCleared && /^[a-f0-9]{64}$/.test(a.qa.sha256) && a.turns.length>=4)).toBe(true);
  });
});
