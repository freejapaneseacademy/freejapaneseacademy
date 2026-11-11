import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m05-c04-chk-v1.json';
import {scoreTravelCheckpoint} from '../components/interactive/TravelPlanChapterCheckpoint';
describe('N5-M05-C04-CHK',()=>{
 it('has sixteen unique keyed written questions and feedback',()=>{expect(bank.items).toHaveLength(16);expect(new Set(bank.items.map(q=>q.id)).size).toBe(16);for(const q of bank.items){expect(q.id).toMatch(/^ex-n5-m05-c04-chk-\d\d$/);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.evidence.length).toBeGreaterThan(3);}});
 it('scores good and wrong answers',()=>{const good=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreTravelCheckpoint(good)).toBe(16);expect(scoreTravelCheckpoint({})).toBe(0);const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));expect(scoreTravelCheckpoint(wrong)).toBe(0);});
 it('does not score listening without audio',()=>{expect(bank.scoring.maxWrittenScore).toBe(16);expect(bank.items.every(q=>!q.skills.includes('listening'))).toBe(true);});
});