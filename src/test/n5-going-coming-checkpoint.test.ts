import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m05-c01-chk-v1.json';
import {scoreMovementCheckpoint} from '../components/interactive/MovementChapterCheckpoint';
describe('N5-M05-C01-CHK movement checkpoint',()=>{
 it('has twelve unique schema-compliant written questions',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.id).toMatch(/^ex-n5-m05-c01-chk-\d\d$/);expect(q.type).toBe('single-choice');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(15);}});
 it('scores correct and wrong attempts',()=>{const good=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreMovementCheckpoint(good)).toBe(12);expect(scoreMovementCheckpoint({})).toBe(0);const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));expect(scoreMovementCheckpoint(wrong)).toBe(0);});
 it('never scores unverified audio as listening',()=>{expect(bank.scoring.maxWrittenScore).toBe(12);expect(bank.items.every(q=>!q.skills.includes('listening'))).toBe(true);});
});
