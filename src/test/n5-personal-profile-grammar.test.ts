import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m01-c04-l03-v1.json';
import {gradePersonalProfile} from '../components/interactive/N5PersonalProfileGrammarPractice';
describe('n5-m01-c04-l03 personal profile grammar',()=>{
 it('has twelve unique versioned questions and distinct options',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(10);expect(q.evidence.length).toBeGreaterThan(0)}});
 it('scores correct, incorrect and unanswered independently',()=>{expect(gradePersonalProfile({})).toBe(0);expect(gradePersonalProfile(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);expect(gradePersonalProfile({[bank.items[0].id]:'b'})).toBe(0)});
});