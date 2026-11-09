import {describe,expect,it} from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c03-l07-v1.json';
describe('katakana voiced writing bank',()=>{
 it('has eight stable schema-conforming short-input questions',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c03-l07-/);expect(q.status).toBe('drafted');expect(q.type).toBe('short-input');expect(q.answerKey.normalization).toBe('trim-and-unicode-nfc');expect(q.answerKey.accepted.length).toBeGreaterThan(0);expect(q.explanation.length).toBeGreaterThan(20);}});
 it('keys real katakana with correct voiced marks and ン/ソ',()=>{expect(bank.items.map(q=>q.answerKey.accepted[0])).toEqual(['パン','ペン','カバン','ソース','リンゴ','ラジオ','ピアノ','パンダ']);});
});
