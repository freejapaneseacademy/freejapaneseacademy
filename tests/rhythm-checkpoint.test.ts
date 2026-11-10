import { describe, expect, it } from 'vitest';
import written from '../src/content/exercises/l0-m01-c03-chk-written-v1.json';
import listening from '../src/content/exercises/l0-m01-c03-chk-listening-v1.json';
import audio from '../src/content/audio/l0-m01-c03-l06-v1.json';

describe('Chapter 03 rhythm checkpoint integrity', () => {
  it('has twelve unique, fully keyed written questions with meaningful feedback', () => {
    expect(written.items).toHaveLength(12);
    expect(new Set(written.items.map(q => q.id)).size).toBe(12);
    for (const q of written.items) {
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);
      expect(q.feedback.length).toBeGreaterThan(25);
      expect(q.evidence.phrase.length).toBeGreaterThan(0);
    }
  });
  it('keys each spoken-meaning question to an existing rights-cleared source and transcript turn', () => {
    expect(listening.items).toHaveLength(4);
    expect(new Set(listening.items.map(q => q.id)).size).toBe(4);
    expect(listening.lessonId).toBe('l0-m01-c03-chk');
    expect(new Set(listening.items.map(q => q.stimulusId)).size).toBe(2);
    for (const q of listening.items) {
      const source = audio.assets.find(a => a.id === q.stimulusId);
      expect(source).toBeDefined();
      expect(source?.rights.redistributionCleared).toBe(true);
      expect(source?.qa.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(source?.transcript.length).toBeGreaterThan(30);
      expect(q.choices.some(c => c.id === q.answerKey.choiceId)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(25);
      expect(q.evidence.turn).toMatch(/s$/);
      expect(q.transcriptPolicy).toContain('assisted');
    }
  });
});
