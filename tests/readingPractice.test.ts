import { describe,it,expect } from 'vitest';
import { readingRows, readingQuestions, readingQuizId, validateReadingQuestions, scoreReadingQuestions, isReadingAnswerCorrect } from '../src/lib/readingPractice';

describe('L05 chart reading and evidence check',()=>{
  it('has nine unique chart rows and twelve versioned questions with evidence',()=>{
    expect(readingQuizId).toBe('l0-m01-c01-l05-check-v1');
    expect(readingRows).toHaveLength(9);
    expect(readingQuestions).toHaveLength(12);
    expect(validateReadingQuestions(readingQuestions,readingRows)).toBe(true);
    expect(new Set(readingQuestions.flatMap(q=>q.objectiveIds)).size).toBe(4);
  });
  it('scores only exact option IDs, with no leaked correct answers',()=>{
    const correct=Object.fromEntries(readingQuestions.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreReadingQuestions(readingQuestions,correct)).toBe(12);
    expect(scoreReadingQuestions(readingQuestions,{})).toBe(0);
    expect(isReadingAnswerCorrect(readingQuestions[0],'')).toBe(false);
  });
  it('rejects duplicate questions and missing evidence',()=>{
    expect(()=>validateReadingQuestions([...readingQuestions,readingQuestions[0]],readingRows)).toThrow(/Expected 12|Duplicate/);
    expect(()=>validateReadingQuestions(readingQuestions.map((q,i)=>i===0?{...q,evidence:''}:q),readingRows)).toThrow(/metadata/);
  });
});
