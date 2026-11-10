import { describe,expect,it } from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c04-l07-v1.json';
import { gradeRoomSpatialWriting } from '../../src/components/interactive/RoomSpatialWritingWorkshop';
describe('n5-m02-c04-l07 writing bank',()=>{
 it('has eight unique keyed questions and useful rationales',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true)}});
 it('scores correct and empty submissions',()=>{const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(gradeRoomSpatialWriting(answers)).toBe(8);expect(gradeRoomSpatialWriting({})).toBe(0)});
});