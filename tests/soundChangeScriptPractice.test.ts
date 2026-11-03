import { describe, expect, it } from 'vitest';
import { gradeScriptAnswers, normalizeScriptAnswer, scriptQuestions, scriptPracticeQuizId } from '../src/lib/soundChangeScriptPractice';

describe('chapter 03 L04 script assessment',()=>{
  it('uses stable unique identifiers and correct Japanese answer keys',()=>{
    expect(scriptPracticeQuizId).toBe('l0-m01-c03-l04-script-v1');
    expect(scriptQuestions).toHaveLength(12);
    expect(new Set(scriptQuestions.map(q=>q.id)).size).toBe(scriptQuestions.length);
    expect(scriptQuestions.every(q=>q.answer.length>0&&q.explanation.length>20)).toBe(true);
  });
  it('scores only exact Japanese kana, never romaji or a missing mora',()=>{
    const correct=Object.fromEntries(scriptQuestions.map(q=>[q.id,q.answer]));
    expect(gradeScriptAnswers(correct)).toBe(12);
    expect(gradeScriptAnswers({...correct,'l04-q01':'おばさん','l04-q03':'さか','l04-q09':'koohii'})).toBe(9);
    expect(gradeScriptAnswers({})).toBe(0);
  });
  it('trims surrounding spaces but does not silently convert a wrong character',()=>{
    expect(normalizeScriptAnswer(' さっか ')).toBe('さっか');
    expect(normalizeScriptAnswer('さつか')).not.toBe('さっか');
  });
});
