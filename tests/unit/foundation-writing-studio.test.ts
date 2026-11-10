import {describe,expect,it} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c04-l07-v1.json';
import {scoreFoundationWriting,normalizeFoundationWriting} from '../../src/components/interactive/FoundationWritingStudio';
describe('foundation writing studio',()=>{
 it('has ten unique schema-compliant items',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.type).toBe('short-input');expect(q.answerKey.normalization).toBe('trim-and-unicode-nfc');expect(q.answerKey.accepted).toHaveLength(1);expect(q.explanation.length).toBeGreaterThan(15);}});
 it('scores the exact model answers and rejects missing small kana',()=>{const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.modelAnswer]));expect(scoreFoundationWriting(answers)).toBe(10);answers[bank.items[0].id]='きて';expect(scoreFoundationWriting(answers)).toBe(9);expect(normalizeFoundationWriting('  パン  ')).toBe('パン');});
});
