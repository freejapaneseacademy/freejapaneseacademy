import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m03-c03-l06-v1.json';
import {gradeScheduleListening,tracks} from '../components/interactive/ScheduleListeningPractice';
describe('n5-m03-c03-l06 listening evidence and grading',()=>{
it('has six unique evidenced items, three per track',()=>{expect(bank.items).toHaveLength(6);expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);for(const t of tracks){expect(bank.items.filter(q=>q.trackId===t.id)).toHaveLength(3);}for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(tracks.find(t=>t.id===q.trackId)!.turns.map(t=>t[1]).join(' ')).toContain(q.evidence);}});
it('grades perfect, blank and incorrect attempts',()=>{expect(gradeScheduleListening(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(6);expect(gradeScheduleListening({})).toBe(0);expect(gradeScheduleListening(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);});
});