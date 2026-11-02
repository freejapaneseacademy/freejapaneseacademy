import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReusableListeningPractice from '../src/components/interactive/ReusableListeningPractice';
import bank from '../src/content/exercises/l0-m01-c01-l06.json';
import media from '../src/content/audio/l0-m01-c01-l06.json';

describe('Reusable listening practice for future L06 lessons', () => {
  const tracks = media.assets.map((track, index) => ({
    id: index === 0 ? 'a' as const : 'b' as const,
    assetId: track.id,
    label: track.scriptPurpose,
    url: track.mediaPath,
    durationSeconds: track.durationSeconds,
    transcript: track.transcript,
    english: track.english
  }));
  const props = {
    lessonId: 'l0-m01-c01-l06',
    level: 'l0',
    version: 2,
    tracks,
    questions: bank.items
  };

  it('renders two real audio controls and eight questions without leaking transcripts', () => {
    const output = renderToStaticMarkup(createElement(ReusableListeningPractice, props));
    expect((output.match(/<audio/g) ?? []).length).toBe(2);
    expect((output.match(/<fieldset/g) ?? []).length).toBe(8);
    expect(output).toContain('Reveal transcript (assisted practice)');
    expect(output).toContain('/audio/fja-l06-real-dialogue-a-v2.wav');
    expect(output).not.toContain('男性： こんにちは。お茶をお願いします。');
    expect(output).toContain('Check answers &amp; save blind score');
  });

  it('supports another lesson ID, level, and score version without hardcoded bank imports', () => {
    const output = renderToStaticMarkup(createElement(ReusableListeningPractice, {
      ...props, lessonId: 'n5-m01-c02-l06', level: 'n5', version: 4
    }));
    expect(output).toContain('listening-n5-m01-c02-l06');
    expect(output).toContain('Two real audio tracks'.toUpperCase());
  });
});
