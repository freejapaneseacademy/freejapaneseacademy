import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/l0-m02-c03-l07.json';
describe('L0-M02-C03-L07 writing bank',()=>{
 it('has unique stable IDs and exactly fifteen constrained targets',()=>{expect(bank.items).toHaveLength(15);expect(new Set(bank.items.map(q=>q.id)).size).toBe(15);expect(bank.items.every(q=>q.type==='short-input'&&q.answerKey.accepted.length===1&&q.explanation.length>15)).toBe(true)});
 it('preserves distinct を, お and ん and context words',()=>{const a=bank.items.map(q=>q.answerKey.accepted[0]);expect(a).toContain('を');expect(a).toContain('ん');expect(a).toContain('ほん');expect(a).toContain('もも');expect(a).not.toContain('お')});
});