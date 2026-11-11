import { describe, it, expect } from 'vitest';
import { studyToolsContextQuestions, scoreStudyToolsContext, studyToolsContextQuizId } from './studyToolsContextPractice';

describe('Chapter 04 lesson 01 IME context question bank', () => {
  it('uses twelve unique stable question IDs and separate local progress', () => {
    expect(studyToolsContextQuestions).toHaveLength(12);
    expect(new Set(studyToolsContextQuestions.map(q => q.id)).size).toBe(12);
    expect(studyToolsContextQuizId).toBe('l0-m01-c04-l01-written-context-v1');
  });
  it('all answer keys resolve to choices with supported explanations', () => {
    for (const q of studyToolsContextQuestions) {
      expect(q.choices.find(c => c.id === q.answerKey.choiceId)?.rationale).toBe(q.explanation);
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(new Set(q.choices.map(c => c.id)).size).toBe(q.choices.length);
    }
  });
  it('scores correct answers and rejects unanswered or incorrect choices', () => {
    const answers = Object.fromEntries(studyToolsContextQuestions.map(q => [q.id, q.answerKey.choiceId]));
    expect(scoreStudyToolsContext(answers)).toBe(12);
    expect(scoreStudyToolsContext({})).toBe(0);
    const first = studyToolsContextQuestions[0];
    answers[first.id] = first.choices.find(c => c.id !== first.answerKey.choiceId)!.id;
    expect(scoreStudyToolsContext(answers)).toBe(11);
  });
});
