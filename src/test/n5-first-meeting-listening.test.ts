import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m01-c01-l06-v1.json';
describe('N5 first meeting listening',()=>{
 it('has six uniquely keyed listening questions with evidence',()=>{
 expect(bank.items).toHaveLength(6);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
 for(const q of bank.items){expect(q.version).toBe(1);expect(q.status).toBe('drafted');expect(q.skills).toContain('listening');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.evidence.length).toBeGreaterThan(4);expect(q.explanation.length).toBeGreaterThan(10);}
 });
 it('covers two distinct scenes and avoids script identification',()=>{
 for(const t of ['a','b'])expect(bank.items.filter(q=>q.trackId==='audio-n5-m01-c01-l06-'+t)).toHaveLength(3);
 for(const q of bank.items)expect(q.prompt).not.toMatch(/spell|kana|written|character|kanji|hiragana/i);
 });
});
