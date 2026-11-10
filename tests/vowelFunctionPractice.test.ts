import { describe, expect, it } from 'vitest';
import {
  isVowelFunctionCorrect, normalizeVowelFunctionInput, scoreVowelFunction,
  validateVowelFunction, vowelFunctionLessonId, vowelFunctionQuestions, vowelFunctionQuizId
} from '../src/lib/vowelFunctionPractice';

describe('L0-M01-C02-L03 vowel length and sentence function', () => {
  it('has exactly twelve unique stable versioned questions and a separate quiz ID', () => {
    expect(vowelFunctionLessonId).toBe('l0-m01-c02-l03');
    expect(vowelFunctionQuizId).toBe('l0-m01-c02-l03-check-v1');
    expect(validateVowelFunction()).toBe(true);
    expect(vowelFunctionQuestions).toHaveLength(12);
    expect(new Set(vowelFunctionQuestions.map(q => q.id)).size).toBe(12);
    expect(vowelFunctionQuestions.filter(q => q.type === 'short-input')).toHaveLength(2);
  });
  it('scores all keyed answers correctly, and empty or wrong responses as incorrect', () => {
    const keyed = Object.fromEntries(vowelFunctionQuestions.map(q => [
      q.id, q.type === 'single-choice' ? q.answerKey.choiceId : q.answerKey.accepted[0]
    ]));
    expect(scoreVowelFunction(keyed)).toBe(12);
    expect(scoreVowelFunction({})).toBe(0);
    for (const q of vowelFunctionQuestions) {
      expect(isVowelFunctionCorrect(q, keyed[q.id])).toBe(true);
      expect(isVowelFunctionCorrect(q, 'wrong')).toBe(false);
    }
  });
  it('preserves meaningful vowel-length contrasts and normalizes only outer whitespace/NFC', () => {
    const house = vowelFunctionQuestions.find(q => q.id.endsWith('011'))!;
    const grandmother = vowelFunctionQuestions.find(q => q.id.endsWith('012'))!;
    expect(isVowelFunctionCorrect(house, ' いえ ')).toBe(true);
    expect(isVowelFunctionCorrect(house, 'ie')).toBe(true);
    expect(isVowelFunctionCorrect(house, 'いいえ')).toBe(false);
    expect(isVowelFunctionCorrect(house, 'iie')).toBe(false);
    expect(isVowelFunctionCorrect(grandmother, 'おばあさん')).toBe(true);
    expect(isVowelFunctionCorrect(grandmother, 'obaasan')).toBe(true);
    expect(isVowelFunctionCorrect(grandmother, 'おばさん')).toBe(false);
    expect(isVowelFunctionCorrect(grandmother, 'obasan')).toBe(false);
    expect(normalizeVowelFunctionInput(' いいえ ')).toBe('いいえ');
  });
  it('rejects duplicated items and corrupted answer keys', () => {
    expect(() => validateVowelFunction([...vowelFunctionQuestions, vowelFunctionQuestions[0]])).toThrow();
    const broken = structuredClone(vowelFunctionQuestions);
    const first = broken[0];
    if (first.type !== 'single-choice') throw new Error('Expected choice question');
    first.answerKey.choiceId = 'missing-option';
    expect(() => validateVowelFunction(broken)).toThrow();
  });
});
