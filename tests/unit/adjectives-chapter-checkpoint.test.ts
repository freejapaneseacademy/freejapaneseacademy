import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c03-chk-v1.json';
import {adjectiveCheckpointItems,scoreAdjectiveCheckpoint} from '../../src/components/interactive/AdjectiveChapterCheckpoint';
describe('adjectives chapter checkpoint',()=>{
 it('has twelve uniquely keyed versioned questions with distinct feedback',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.version).toBe(1);expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);}});
 it('scores empty, fully correct and one incorrect',()=>{expect(scoreAdjectiveCheckpoint({})).toBe(0);const all=Object.fromEntries(adjectiveCheckpointItems.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreAdjectiveCheckpoint(all)).toBe(12);const first=adjectiveCheckpointItems[0];all[first.id]=first.choices.find(c=>c.id!==first.answerKey.choiceId)!.id;expect(scoreAdjectiveCheckpoint(all)).toBe(11);});
});
