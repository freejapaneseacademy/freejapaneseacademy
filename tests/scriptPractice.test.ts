import { describe, expect, it } from 'vitest';
import { kanaPairs, kanaPalette, isScriptAnswerCorrect, normalizeScriptInput, scoreScriptQuestions, scriptQuestions, scriptQuizId, validateScriptQuestions } from '../src/lib/scriptPractice';

describe('L0 script and kana practice',()=>{
  it('has five vowel pairs, unique stable questions and valid answer keys',()=>{
    expect(kanaPairs.map(x=>x.romaji)).toEqual(['a','i','u','e','o']);
    expect(kanaPairs.map(x=>x.hira)).toEqual([...kanaPalette.hiragana]);
    expect(kanaPairs.map(x=>x.kata)).toEqual([...kanaPalette.katakana]);
    expect(scriptQuestions).toHaveLength(12);
    expect(scriptQuestions.filter(q=>q.type==='short-input')).toHaveLength(4);
    expect(validateScriptQuestions(scriptQuestions)).toBe(true);
    expect(scriptQuizId).toBe('l0-m01-c01-l04-check-v1');
  });
  it('scores correct choices and kana, rejects romaji and wrong-script answers',()=>{
    const answers=Object.fromEntries(scriptQuestions.map(q=>[q.id,q.type==='single-choice'?q.answerKey.choiceId:q.answerKey.accepted[0]]));
    expect(scoreScriptQuestions(scriptQuestions,answers)).toBe(12);
    expect(scoreScriptQuestions(scriptQuestions,{})).toBe(0);
    const hira=scriptQuestions.find(q=>q.id.endsWith('009'))!;
    expect(isScriptAnswerCorrect(hira,' あ ')).toBe(true);
    expect(isScriptAnswerCorrect(hira,'a')).toBe(false);
    expect(isScriptAnswerCorrect(hira,'ア')).toBe(false);
    expect(normalizeScriptInput('  イ  ')).toBe('イ');
  });
  it('does not leak the answer via a partial option or invalid key',()=>{
    for(const q of scriptQuestions){
      expect(q.objectiveIds.every(id=>id.startsWith('l0-m01-c01-l04-o'))).toBe(true);
      if(q.type==='single-choice')expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
      else expect(kanaPalette[q.inputScript]).toContain(q.answerKey.accepted[0] as never);
    }
  });
});
