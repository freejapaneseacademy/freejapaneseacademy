import { describe, expect, it } from 'vitest';
import { soundScriptCards, soundScriptPalette, soundScriptQuestions, soundScriptQuizId, isSoundScriptCorrect, normalizeSoundScriptInput, scoreSoundScript, validateSoundScript } from '../src/lib/soundScriptPractice';

describe('Chapter 02 L04 kana and word-form practice',()=>{
  it('has eight cards, unique versioned questions and valid keys',()=>{
    expect(soundScriptCards).toHaveLength(8);
    expect(soundScriptCards.map(c=>c.glyph)).toEqual(['か','き','く','け','こ','さ','す','し']);
    expect(soundScriptPalette).toContain('あ');
    expect(soundScriptQuestions).toHaveLength(12);
    expect(soundScriptQuestions.filter(q=>q.type==='short-input')).toHaveLength(4);
    expect(validateSoundScript()).toBe(true);
    expect(soundScriptQuizId).toBe('l0-m01-c02-l04-check-v1');
  });
  it('scores correct answers, preserves kana distinctions and rejects romaji',()=>{
    const answers=Object.fromEntries(soundScriptQuestions.map(q=>[q.id,q.type==='single-choice'?q.answerKey.choiceId:q.answerKey.accepted[0]]));
    expect(scoreSoundScript(answers)).toBe(12);
    expect(scoreSoundScript({})).toBe(0);
    const ka=soundScriptQuestions.find(q=>q.id.endsWith('009'))!;
    const umbrella=soundScriptQuestions.find(q=>q.id.endsWith('012'))!;
    expect(isSoundScriptCorrect(ka,' か ')).toBe(true);
    expect(isSoundScriptCorrect(ka,'ka')).toBe(false);
    expect(isSoundScriptCorrect(ka,'カ')).toBe(false);
    expect(isSoundScriptCorrect(umbrella,'かさ')).toBe(true);
    expect(isSoundScriptCorrect(umbrella,'かお')).toBe(false);
    expect(normalizeSoundScriptInput('  かさ  ')).toBe('かさ');
  });
  it('rejects malformed keys and duplicate IDs',()=>{
    const cloned=structuredClone(soundScriptQuestions);
    cloned[1].id=cloned[0].id;
    expect(()=>validateSoundScript(cloned)).toThrow(/Invalid question metadata/);
  });
});
