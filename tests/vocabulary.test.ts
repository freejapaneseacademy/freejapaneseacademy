import { describe, expect, it } from 'vitest';
import { isVocabularyAnswerCorrect, normalizeVocabularyInput, scoreVocabularyQuestions, validateVocabularyQuestions, vocabularyQuestions, vocabularyQuizId, vocabularyFlashcards } from '../src/lib/vocabularyPractice';
describe('Level 0 vocabulary word study',()=>{
  it('has stable unique question IDs and valid answer keys',()=>{
    expect(validateVocabularyQuestions(vocabularyQuestions)).toBe(true);
    expect(vocabularyQuestions).toHaveLength(12);
    expect(vocabularyFlashcards).toHaveLength(13);
    expect(vocabularyQuizId).toBe('l0-m01-c01-l02-check-v1');
  });
  it('scores all correct answers and rejects wrong choices',()=>{
    const answers=Object.fromEntries(vocabularyQuestions.map(q=>[q.id,q.type==='single-choice'?q.answerKey.choiceId:q.answerKey.accepted[0]]));
    expect(scoreVocabularyQuestions(vocabularyQuestions,answers)).toBe(vocabularyQuestions.length);
    expect(scoreVocabularyQuestions(vocabularyQuestions,{})).toBe(0);
    expect(isVocabularyAnswerCorrect(vocabularyQuestions[0],'not-an-answer')).toBe(false);
  });
  it('accepts kana or explicitly listed lowercase romaji, not arbitrary spellings',()=>{
    const q=vocabularyQuestions.find(q=>q.id.endsWith('011'))!;
    expect(isVocabularyAnswerCorrect(q,' ひらがな ')).toBe(true);
    expect(isVocabularyAnswerCorrect(q,'hiragana')).toBe(true);
    expect(isVocabularyAnswerCorrect(q,'Hiragana')).toBe(false);
    expect(normalizeVocabularyInput(' いみ ')).toBe('いみ');
  });
});
