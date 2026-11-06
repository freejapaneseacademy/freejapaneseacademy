import { describe, expect, it } from 'vitest';
import { buildFoundationsCatalog, type FoundationInventoryItem, type FoundationLessonMetadata } from '../src/lib/foundationsCatalog';

const records: FoundationInventoryItem[] = [
  {id:'l0-m02-c01-chk',level:'l0',status:'published',noindex:false,url:'/learn/start/module-02/chapter-01/checkpoint/'},
  {id:'l0-m01-c01-l02',level:'l0',status:'published',noindex:false,url:'/learn/start/module-01/chapter-01/lesson-02/'},
  {id:'l0-m01-c01-chk',level:'l0',status:'published',noindex:false,url:'/learn/start/module-01/chapter-01/checkpoint/'},
  {id:'l0-m02-c01-l01',level:'l0',status:'published',noindex:false,url:'/learn/start/module-02/chapter-01/lesson-01/'},
  {id:'l0-m01-c01-l01',level:'l0',status:'published',noindex:false,url:'/learn/start/module-01/chapter-01/lesson-01/'},
  {id:'l0-m02-c01-l02',level:'l0',status:'draft',url:'/learn/start/module-02/chapter-01/lesson-02/'},
  {id:'n5-demo',level:'n5',status:'demonstration-only'}
];
const metadata: FoundationLessonMetadata[] = records.filter(x=>x.level==='l0'&&x.status==='published').map(x=>({
  lessonId:x.id,title:'Lesson title '+x.id,description:'A meaningful study step for '+x.id,
  minutes:25,module:x.id.includes('m01')?'Getting Oriented':'Hiragana I',
  chapter:'Chapter curriculum',publicationStatus:'published'
}));

describe('Foundations inventory-driven index',()=>{
  it('sorts modules, lessons and checkpoints despite source insertion order',()=>{
    const groups=buildFoundationsCatalog(records,metadata);
    expect(groups.map(x=>x.id)).toEqual(['module-01','module-02']);
    expect(groups[0].chapters[0].lessons.map(x=>x.id))
      .toEqual(['l0-m01-c01-l01','l0-m01-c01-l02','l0-m01-c01-chk']);
    expect(groups[1].chapters[0].lessons.map(x=>x.id))
      .toEqual(['l0-m02-c01-l01','l0-m02-c01-chk']);
    expect(groups[0].total).toBe(3);
  });
  it('never displays draft or demonstration-only content',()=>{
    const ids=buildFoundationsCatalog(records,metadata).flatMap(m=>m.chapters.flatMap(c=>c.lessons.map(x=>x.id)));
    expect(ids).not.toContain('l0-m02-c01-l02');
    expect(ids).not.toContain('n5-demo');
  });
  it('rejects duplicates, broken routes and draft metadata for published lessons',()=>{
    expect(()=>buildFoundationsCatalog([...records, records[0]],metadata)).toThrow(/Duplicate/);
    const broken=records.map(x=>x.id==='l0-m01-c01-l01'?{...x,url:'/wrong/'}:x);
    expect(()=>buildFoundationsCatalog(broken,metadata)).toThrow(/route/);
    const invalid=metadata.map(x=>x.lessonId==='l0-m01-c01-l01'?{...x,publicationStatus:'draft'}:x);
    expect(()=>buildFoundationsCatalog(records,invalid)).toThrow(/metadata/);
  });
});
