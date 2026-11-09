import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/l0-m05-c01-l06.json';
describe('greeting listening',()=>{
 it('has six unique versioned and answer-keyed listening items',()=>{expect(bank.items).toHaveLength(6);expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);for(const q of bank.items){expect(q.id).toMatch(/^ex-/);expect(q.version).toBe(1);expect(q.status).toBe('drafted');expect(q.skills).toContain('listening');expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);expect(q.explanation.length).toBeGreaterThan(15);expect(q.evidence.length).toBeGreaterThan(2);}});
 it('covers both conversations with three questions each',()=>{for(const suffix of ['a','b'])expect(bank.items.filter(q=>q.trackId==='audio-l0-m05-c01-l06-'+suffix)).toHaveLength(3);});
});
