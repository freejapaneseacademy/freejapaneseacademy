import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m01-c04-l06-v1.json';
import {gradeProfileListening} from '../components/interactive/N5ProfileListeningPractice';
describe('n5-m01-c04-l06 original listening bank',()=>{
it('has six stable unique questions with valid answer keys and track evidence',()=>{expect(bank.items).toHaveLength(6);expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);for(const q of bank.items){expect(['a','b']).toContain(q.trackId);expect(q.choices).toHaveLength(3);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.evidence.length).toBeGreaterThan(3);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true)}});
it('grades correct, wrong and unanswered selections',()=>{const right=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(gradeProfileListening(right)).toBe(6);expect(gradeProfileListening({})).toBe(0);right[bank.items[0].id]='c';expect(gradeProfileListening(right)).toBe(5)});
});
