import { describe, expect, it } from 'vitest';
import exercise from '../../src/content/exercises/l0-m02-c01-l06.json';
import manifest from '../../src/content/audio/l0-m02-c01-l06-v1.json';

describe('Hiragana listening L06 evidence and audio integrity metadata', () => {
  it('has two distinct recordings with speaker turns, rights and checksum metadata', () => {
    expect(manifest.assets).toHaveLength(2);
    expect(new Set(manifest.assets.map(a => a.mediaPath)).size).toBe(2);
    for (const asset of manifest.assets) {
      expect(asset.rights.redistributionCleared).toBe(true);
      expect(asset.qa.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(asset.turns).toHaveLength(4);
      expect(asset.turns.every(t => asset.transcript.includes(t.japanese))).toBe(true);
      expect(asset.qa.nativePronunciationReviewed).toBe(false);
    }
  });
  it('has six unique scored questions with an unambiguous answer and spoken evidence', () => {
    expect(exercise.items).toHaveLength(6);
    expect(new Set(exercise.items.map(q => q.id)).size).toBe(6);
    for (const q of exercise.items) {
      expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
      expect(q.explanation.length).toBeGreaterThan(15);
      const asset = manifest.assets.find(a => a.id === q.trackId);
      expect(asset).toBeDefined();
      expect(asset!.transcript).toContain(q.evidence);
    }
  });
});
