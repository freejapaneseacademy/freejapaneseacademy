import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m05-c03-l08-v1.json';
import { directionsRoleplayQuestions, scoreDirectionsRoleplay, DIRECTIONS_ROLEPLAY_QUIZ_ID } from '../components/interactive/DirectionsRoleplayPractice';
describe('directions role play lesson',()=>{
 it('has a stable quiz id and ten distinct keyed questions',()=>{expect(DIRECTIONS_ROLEPLAY_QUIZ_ID).toBe('n5-m05-c03-l08-v1');expect(bank.lessonId).toBe('n5-m05-c03-l08');expect(directionsRoleplayQuestions).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);}});
 it('scores correct, incorrect and unanswered items',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreDirectionsRoleplay(correct)).toBe(10);expect(scoreDirectionsRoleplay({})).toBe(0);const first=bank.items[0];expect(scoreDirectionsRoleplay({...correct,[first.id]:first.choices[1].id})).toBe(9);});
});