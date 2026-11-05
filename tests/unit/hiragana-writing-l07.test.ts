import { describe, expect, it } from 'vitest';
import { isKanaAnswer, kanaItems } from '../../src/components/interactive/HiraganaWritingStudio';

describe('L0-M02-C01-L07 kana production', () => {
  it('has 20 unique stable questions covering all 15 kana and five words', () => {
    expect(kanaItems).toHaveLength(20);
    expect(new Set(kanaItems.map(x => x.id)).size).toBe(20);
    expect(kanaItems.slice(0, 15).map(x => x.answer)).toEqual(Array.from('あいうえおかきくけこさしすせそ'));
    expect(kanaItems.slice(15).map(x => x.answer)).toEqual(['かさ', 'すし', 'いす', 'ここ', 'せかい']);
  });
  it('rejects romaji and a wrong kana while allowing surrounding whitespace', () => {
    expect(isKanaAnswer(' し ', 'し')).toBe(true);
    expect(isKanaAnswer('shi', 'し')).toBe(false);
    expect(isKanaAnswer('す', 'し')).toBe(false);
  });
});
