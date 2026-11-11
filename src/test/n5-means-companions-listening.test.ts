import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m05-c02-l06-v1.json';
import job from '../../scripts/tts/jobs/n5-m05-c02-l06.json';
describe('n5-m05-c02-l06 listening integrity', () => {
 it('has two different original spoken scenarios',()=>{expect(job.tracks).toHaveLength(2);expect(job.tracks[0].turns.map(t=>t.text).join(' ')).not.toBe(job.tracks[1].turns.map(t=>t.text).join(' '));});
 it('has six unambiguous audio-only keys and evidence',()=>{expect(bank.items).toHaveLength(6);expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.evidence.length).toBeGreaterThan(3);const track=job.tracks.find(t=>q.trackId.endsWith('-'+t.id));expect(track?.turns.some(t=>t.text.includes(q.evidence))).toBe(true);}});
 it('keeps media-dependent questions drafted',()=>{expect(bank.items.every(q=>q.status==='drafted')).toBe(true);});
});
