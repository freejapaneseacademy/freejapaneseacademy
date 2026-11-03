import { describe, expect, it } from 'vitest';
import written from '../../src/content/exercises/l0-m01-c02-chk-written-v1.json';
import listening from '../../src/content/exercises/l0-m01-c02-chk-listening-v1.json';
import audio from '../../src/content/audio/l0-m01-c02-l06-v1.json';

describe('Chapter 02 checkpoint evidence integrity', () => {
  it('has 12 original written items and 4 distinct listening items', () => {
    expect(written.items).toHaveLength(12);
    expect(listening.items).toHaveLength(4);
    const ids = [...written.items, ...listening.items].map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('anchors every listening answer to an existing real dialogue and turn', () => {
    expect(audio.assets).toHaveLength(2);
    for (const asset of audio.assets) {
      expect(asset.mediaPath).toMatch(/^\/audio\/fja-l0-m01-c02-l06-[ab]-v1\.wav$/);
      expect(asset.qa.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(asset.rights.redistributionCleared).toBe(true);
      expect(asset.transcript).toBeTruthy();
      expect(asset.turns.length).toBeGreaterThan(1);
    }
    for (const item of listening.items) {
      const asset = audio.assets.find((candidate) => candidate.id === item.stimulusId);
      expect(asset, item.id).toBeDefined();
      expect(item.evidence.source).toBe('src/content/audio/l0-m01-c02-l06-v1.json');
      expect(item.choices.filter((choice) => choice.id === item.answerKey.choiceId)).toHaveLength(1);
      expect(item.explanation).toBeTruthy();
      expect(item.transcriptPolicy).toContain('hidden until submitted');
    }
  });

  it('never describes this checkpoint as independently pronunciation-reviewed', () => {
    for (const asset of audio.assets) {
      expect(asset.qa.nativePronunciationReviewed).toBe(false);
    }
    expect(listening.scoring.blindAndAssistedSeparate).toBe(true);
    expect(listening.scoring.officialJLPTScore).toBe(false);
  });
});


describe('canonical mixed checkpoint release contract', () => {
  it('written selections match the published stable answerKey, rather than a legacy index mismatch', () => {
    for (const q of written.items) {
      expect(q.options).toHaveLength(q.choices.length);
      expect(q.options[q.correctIndex]).toBe(q.choices.find(c => c.id === q.answerKey.choiceId)?.text);
      expect(q.status).toBe('published');
      expect(q.explanation?.trim().length).toBeGreaterThan(12);
    }
  });
  it('listening questions are meaningful spoken evidence, not visual spelling', () => {
    for (const q of listening.items) {
      const asset = audio.assets.find(asset => asset.id === q.stimulusId);
      expect(asset).toBeDefined();
      expect(q.evidence.turn).toBeTruthy();
      expect(q.choices.length).toBe(3);
      expect(q.status).toBe('published');
      expect(q.prompt).not.toMatch(/which kana|which spelling|written character/i);
    }
  });
});
