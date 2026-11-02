import { describe, expect, it } from 'vitest';
import { isSentenceAnswerCorrect, scoreSentenceQuestions, sentenceQuestions, validateSentenceQuestions } from '../src/lib/sentenceFunction';

describe('L03 sentence-function assessment',()=>{
  it('validates all question IDs, choices and keys',()=>{
    expect(sentenceQuestions).toHaveLength(12);
    expect(validateSentenceQuestions(sentenceQuestions)).toBe(true);
  });
  it('scores every keyed response and never counts an empty response',()=>{
    const answers=Object.fromEntries(sentenceQuestions.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreSentenceQuestions(sentenceQuestions,answers)).toBe(12);
    expect(scoreSentenceQuestions(sentenceQuestions,{})).toBe(0);
    expect(isSentenceAnswerCorrect(sentenceQuestions[0],'')).toBe(false);
  });
  it('rejects duplicate question identifiers',()=>{
    expect(()=>validateSentenceQuestions([sentenceQuestions[0],sentenceQuestions[0]])).toThrow(/Duplicate/);
  });
  it('covers all four published objectives',()=>{
    expect(new Set(sentenceQuestions.flatMap(q=>q.objectiveIds)).size).toBe(4);
  });
});
