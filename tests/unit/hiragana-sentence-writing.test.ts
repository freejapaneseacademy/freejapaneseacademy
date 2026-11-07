import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m03-c04-l07-v1.json';
describe('l0-m03-c04-l07 writing bank',()=>{
 it('has eight unique stable prompts with answer evidence',()=>{expect(bank.lessonId).toBe('l0-m03-c04-l07');expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(x=>x.id)).size).toBe(8);for(const q of bank.items){expect(q.id).toMatch(/^c04l07-q0[1-8]$/);expect(q.answer.length).toBeGreaterThan(1);expect(q.explanation.length).toBeGreaterThan(20);expect(q.answer).not.toMatch(/[A-Za-z]/);}});
 it('distinguishes particles and keeps sentence punctuation',()=>{expect(bank.items[4].answer).toBe('ねこのほん');expect(bank.items[5].answer).toBe('ほんをみます。');expect(bank.items[6].answer).toBe('ほんはありますか。');expect(bank.items[7].answer).toBe('ねこのほんはあそこです。');});
});