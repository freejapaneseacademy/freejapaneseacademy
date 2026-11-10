import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m02-c04-l06-v1.json';
import {gradeRoomTourListening} from '../components/interactive/RoomTourListeningPractice';
describe('n5-m02-c04-l06 listening integrity',()=>{
it('has six distinct questions with complete feedback and two tracks',()=>{expect(bank.items).toHaveLength(6);expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);for(const t of ['a','b'])expect(bank.items.filter(q=>q.trackId===t)).toHaveLength(3);for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(new Set(q.choices.map(c=>c.id)).size).toBe(4);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.evidence.length).toBeGreaterThan(5);expect(q.explanation.length).toBeGreaterThan(12);}});
it('grades perfect, empty and incorrect answers',()=>{expect(gradeRoomTourListening(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(6);expect(gradeRoomTourListening({})).toBe(0);expect(gradeRoomTourListening(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);});
});