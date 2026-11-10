import { describe, expect, it } from 'vitest';
import bank from '../src/content/exercises/l0-m01-c04-l06.json';
import job from '../scripts/tts/jobs/l0-m01-c04-l06.json';

describe('Chapter 04 L06 listening assessment', () => {
  it('has six unique, stable scored questions split across two genuine scenes', () => {
    expect(bank.lessonId).toBe('l0-m01-c04-l06');
    expect(bank.items).toHaveLength(6);
    expect(new Set(bank.items.map(item => item.id)).size).toBe(6);
    expect(bank.items.filter(item => item.trackId.endsWith('-a'))).toHaveLength(3);
    expect(bank.items.filter(item => item.trackId.endsWith('-b'))).toHaveLength(3);
  });

  it('has unambiguous answer keys, rationales and verbatim spoken evidence', () => {
    for (const item of bank.items) {
      const track = job.tracks.find(t => item.trackId.endsWith('-' + t.id));
      expect(track).toBeDefined();
      expect(track!.turns.some(turn => turn.text.includes(item.evidence))).toBe(true);
      expect(item.choices).toHaveLength(3);
      expect(new Set(item.choices.map(choice => choice.id)).size).toBe(3);
      expect(item.choices.filter(choice => choice.id === item.answerKey.choiceId)).toHaveLength(1);
      expect(item.choices.every(choice => choice.rationale.length > 12)).toBe(true);
      expect(item.explanation.length).toBeGreaterThan(20);
    }
  });

  it('uses pinned voices and never treats the scripts as recorded audio', () => {
    expect(job.candidateOnly).toBe(true);
    expect(job.auditoryOnly).toBe(true);
    expect(job.tracks).toHaveLength(2);
    expect(job.voices.male.sha256).toHaveLength(64);
    expect(job.voices.female.sha256).toHaveLength(64);
  });
});
