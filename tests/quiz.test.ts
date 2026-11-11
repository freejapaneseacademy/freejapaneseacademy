import { describe, expect, it } from 'vitest';
import { demoQuestions, scoreQuiz } from '../src/lib/quiz';

describe('demo quiz', () => {
  it('scores correct answers', () => {
    expect(scoreQuiz(demoQuestions, { 'demo-vowel-a': 'a', 'demo-vowel-i': 'i', 'demo-vowel-o': 'o' })).toBe(3);
  });
  it('does not count missing or incorrect answers', () => {
    expect(scoreQuiz(demoQuestions, { 'demo-vowel-a': 'i' })).toBe(0);
  });
});
