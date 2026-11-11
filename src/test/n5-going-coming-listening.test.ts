import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m05-c01-l06-v1.json';
import job from '../../scripts/tts/jobs/n5-m05-c01-l06.json';
describe('n5-m05-c01-l06 listening content', () => {
  it('uses two original, audible, licensed-candidate scenes', () => {
    expect(job.schemaVersion).toBe(3);
    expect(job.candidateOnly).toBe(true);
    expect(job.tracks.map(t => t.id)).toEqual(['a','b']);
    expect(job.tracks.every(t => t.turns.length >= 4)).toBe(true);
  });
  it('provides six unique, evidence-grounded questions', () => {
    expect(bank.items).toHaveLength(6);
    expect(new Set(bank.items.map(q => q.id)).size).toBe(6);
    for (const q of bank.items) {
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c => c.text)).size).toBe(3);
      expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
      const track = job.tracks.find(t => q.trackId.endsWith('-' + t.id));
      expect(track?.turns.some(t => t.text.includes(q.evidence))).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(12);
    }
  });
});
