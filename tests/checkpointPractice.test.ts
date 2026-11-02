import { describe, expect, it } from 'vitest';
import { checkpointLessonId, checkpointQuizId, checkpointQuestions, scoreCheckpointQuestions, validateCheckpointQuestions } from '../src/lib/checkpointPractice';

describe('Chapter 01 canonical checkpoint',()=>{
  it('has a stable ID, 16 original and correctly referenced questions',()=>{
    expect(checkpointLessonId).toBe('l0-m01-c01-chk');
    expect(checkpointQuizId).toBe('l0-m01-c01-chk-v1');
    expect(validateCheckpointQuestions()).toBe(true);
    expect(new Set(checkpointQuestions.map(q=>q.id)).size).toBe(16);
    expect(checkpointQuestions.filter(q=>q.source==='reading')).toHaveLength(4);
    expect(checkpointQuestions.filter(q=>q.source==='listening')).toHaveLength(4);
  });
  it('scores every correct answer and rejects every wrong choice',()=>{
    expect(scoreCheckpointQuestions({})).toBe(0);
    const allCorrect=Object.fromEntries(checkpointQuestions.map(q=>[q.id,q.answerKey.choiceId]));
    const allWrong=Object.fromEntries(checkpointQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
    expect(scoreCheckpointQuestions(allCorrect)).toBe(16);
    expect(scoreCheckpointQuestions(allWrong)).toBe(0);
  });
  it('has 4 independently answerable listening items tied to the real transcripts',()=>{
    for(const q of checkpointQuestions.filter(q=>q.source==='listening')) {
      expect(q.trackId).toMatch(/^audio-l0-m01-c01-l06-[ab]$/);
      expect(q.evidence.length).toBeGreaterThan(5);
    }
  });
});
