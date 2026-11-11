import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m04-c04-l06-v1.json';
import job from '../../scripts/tts/jobs/n5-m04-c04-l06.json';
describe('N5-M04-C04-L06 listening integrity',()=>{
it('has two original scenes with approved distinct speakers',()=>{expect(job.schemaVersion).toBe(3);expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);expect(job.tracks.every(t=>t.turns.length>=4)).toBe(true);});
it('has seven unique evidence-backed questions and valid distractors',()=>{expect(bank.items).toHaveLength(7);expect(new Set(bank.items.map(q=>q.id)).size).toBe(7);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(job.tracks.find(t=>q.trackId.endsWith('-'+t.id))?.turns.some(t=>t.text.includes(q.evidence))).toBe(true);}});
});
