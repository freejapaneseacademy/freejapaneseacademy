import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import bank from '../../src/content/exercises/l0-m02-c04-l07-v1.json';

describe('L07 original hiragana writing models and answer keys', () => {
 it('has ten unique scored typing prompts with real lesson evidence', () => {
  const lesson = readFileSync('src/content/lessons/l0/hiragana-fluency-writing.mdx', 'utf8');
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items) {
   expect(q.answerKey.accepted).toEqual([q.answer]);
   expect(q.acceptedAnswers).toEqual([q.answer]);
   expect(q.evidence.phrase).toBe(q.answer);
   expect(lesson).toContain(q.answer);
   expect(q.explanation.length).toBeGreaterThan(20);
   expect(q.answer).toMatch(/^[\u3040-\u309f。]+$/u);
  }
 });
 it('distinguishes the noun connector と from object particle を', () => {
  expect(bank.items[6].answer).toBe('ねこといぬ');
  expect(bank.items[8].answer).toBe('ねこをみてください。');
  expect(bank.items[9].answer).toBe('ほんをみてください。');
 });
});
