import {describe,it,expect} from 'vitest';
import {studyToolsScriptQuestions as questions,scoreStudyToolsScript} from '../src/lib/studyToolsScriptPractice';
describe('Chapter 04 script practice',()=>{
it('has twelve unique, scored and explained items',()=>{expect(questions).toHaveLength(12);expect(new Set(questions.map(q=>q.id)).size).toBe(12);for(const q of questions){expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.explanation.length).toBeGreaterThan(20);}});
it('scores exact keys without credit for missing answers',()=>{const all=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreStudyToolsScript(all)).toBe(12);expect(scoreStudyToolsScript({})).toBe(0);expect(scoreStudyToolsScript({...all,[questions[0].id]:'b'})).toBe(11);});
});