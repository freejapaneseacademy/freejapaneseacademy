import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c03-l04-v1.json';
describe('M/Y/R/W script bank',()=>{
 it('has 22 stable unique IDs and Japanese keys',()=>{
 expect(bank.items).toHaveLength(22);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(22);
 for(const q of bank.items){expect(q.answerKey.accepted).toEqual([q.answer]);expect(q.answer).toMatch(/^[ぁ-ゖ]+$/u);expect(q.explanation.length).toBeGreaterThan(15)}
 });
 it('covers 16 distinct kana and 6 picture labels',()=>{
 expect(new Set(bank.items.slice(0,16).map(q=>q.answer)).size).toBe(16);
 expect(bank.items.slice(16).map(q=>q.answer)).toEqual(['やま','ゆめ','もも','わに','ほん','みかん']);
 });
});