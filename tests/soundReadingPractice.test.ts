import { describe,it,expect } from 'vitest';
import { soundReadingRows, soundReadingQuestions, soundReadingQuizId, validateSoundReading, scoreSoundReading, isSoundReadingCorrect } from '../src/lib/soundReadingPractice';

describe('L0-M01-C02-L05 original pronunciation-map reading',()=>{
  it('contains eleven rows and twelve unique versioned, evidence-backed questions',()=>{
    expect(soundReadingQuizId).toBe('l0-m01-c02-l05-check-v1');
    expect(soundReadingRows).toHaveLength(11);
    expect(soundReadingQuestions).toHaveLength(12);
    expect(validateSoundReading()).toBe(true);
    expect(new Set(soundReadingQuestions.flatMap(q=>q.objectiveIds)).size).toBe(3);
  });
  it('scores only correct choice IDs and does not treat missing answers as correct',()=>{
    const answers=Object.fromEntries(soundReadingQuestions.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreSoundReading(answers)).toBe(12);
    expect(scoreSoundReading({})).toBe(0);
    expect(isSoundReadingCorrect(soundReadingQuestions[0],'')).toBe(false);
  });
  it('rejects duplicate questions and incorrect map evidence',()=>{
    expect(()=>validateSoundReading([...soundReadingQuestions,soundReadingQuestions[0]])).toThrow(/twelve unique/);
    expect(()=>validateSoundReading(soundReadingQuestions.map((q,i)=>i===0?{...q,evidence:'Row K — ー'}:q))).toThrow(/Evidence does not match|Key and evidence/);
  });
});
