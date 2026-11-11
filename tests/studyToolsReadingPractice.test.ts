import {describe,it,expect} from 'vitest';
import {studyToolsReadingQuestions as questions,scoreStudyToolsReading} from '../src/lib/studyToolsReadingPractice';
describe('Chapter 04 reading evidence',()=>{
it('has twelve distinct evidence-based items and unique correct keys',()=>{expect(questions).toHaveLength(12);expect(new Set(questions.map(q=>q.id)).size).toBe(12);for(const q of questions){expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.evidence.length).toBeGreaterThan(8);expect(q.explanation.length).toBeGreaterThan(20);expect(['①','②','③','④','⑤','⑥','⑦']).toContain(q.evidenceStep);}});
it('scores keys and rejects blank or wrong answers',()=>{const a=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreStudyToolsReading(a)).toBe(12);expect(scoreStudyToolsReading({})).toBe(0);expect(scoreStudyToolsReading({...a,[questions[0].id]:'c'})).toBe(11);});
});