'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {nextId, entryFor, allowed, exactSuccess} = require('../scripts/release_queue.cjs');

test('sequential publication across lesson, checkpoint, chapter and module', () => {
  const cases=[
    ['l0-m03-c04-l05','l0-m03-c04-l06'],
    ['l0-m03-c04-l06','l0-m03-c04-l07'],
    ['l0-m03-c04-l08','l0-m03-c04-chk'],
    ['l0-m03-c04-chk','l0-m04-c01-l01'],
    ['l0-m04-c01-chk','l0-m04-c02-l01']
  ];
  for(const [id,expected] of cases) assert.equal(nextId([{id}]),expected);
});
test('level boundaries follow the approved six-level master blueprint', () => {
  const cases=[
    ['l0-m05-c04-chk','n5-m01-c01-l01'],
    ['n5-m01-c01-l01','n5-m01-c01-l02'],
    ['n5-m10-c04-chk','n4-m01-c01-l01'],
    ['n4-m10-c04-chk','n3-m01-c01-l01'],
    ['n3-m12-c04-chk','n2-m01-c01-l01'],
    ['n2-m12-c04-chk','n1-m01-c01-l01'],
    ['n1-m13-c04-chk',null]
  ];
  for(const [id,expected] of cases)assert.equal(nextId([{id}]),expected);
});
test('N5 chapter candidate uses /learn/n5 canonical route with one isolated entry',()=>{
  const prior=[{id:'l0-m05-c04-chk',level:'l0',status:'published'}];
  const id='n5-m01-c01-l01';
  const entry={id,level:'n5',status:'draft',noindex:true,
    url:'/learn/n5/module-01/chapter-01/lesson-01/',
    content:'src/content/lessons/n5/introductions.mdx'};
  assert.equal(entryFor(prior,[...prior,entry],id).id,id);
  assert.throws(()=>entryFor(prior,[...prior,{...entry,url:'/learn/start/module-01/chapter-01/lesson-01/'}],id),/Wrong/);
  assert.throws(()=>entryFor(prior,[...prior,{...entry,level:'l0'}],id),/Wrong/);
});
test('draft/ready candidates can be staged ahead without duplicate publication',()=>{
  const current=[{id:'l0-m03-c04-l05',status:'published',level:'l0'}];
  const id='l0-m03-c04-l06';
  const item={id,level:'l0',status:'draft',noindex:true,
    url:'/learn/start/module-03/chapter-04/lesson-06/',
    content:'src/content/lessons/l0/listening-dialogue.mdx'};
  assert.equal(entryFor(current,[...current,item],id).id,id);
  assert.throws(()=>entryFor(current,[...current,item,{...item,id:'l0-m03-c04-l07'}],id),/Exactly/);
  assert.throws(()=>entryFor(current,[...current,{...item,url:'/wrong/'}],id),/Wrong/);
});
test('only new lesson files are eligible for privileged automatic release',()=>{
  const id='l0-m03-c04-l06';
  const entry={content:'src/content/lessons/l0/audio-dialogue.mdx',
    url:'/learn/start/module-03/chapter-04/lesson-06/'};
  assert.equal(allowed('.github/workflows/lesson-quality.yml',id,entry),false);
  assert.equal(allowed('scripts/validate_foundations_catalog.py',id,entry),false);
  assert.equal(allowed('src/pages/learn/start/index.astro',id,entry),false);
  assert.equal(allowed('public/audio/fja-l0-m03-c04-l05-a-v1.wav',id,entry),false);
  assert.equal(allowed('public/audio/fja-l0-m03-c04-l06-a-v1.wav',id,entry),true);
  assert.equal(allowed('src/pages/learn/start/module-03/chapter-04/lesson-06.astro',id,entry),true);
  assert.equal(allowed('docs/qa/'+id+'.md',id,entry),true);
  assert.equal(allowed('docs/qa/l0-m03-c04-l08.md',id,entry),false);
  assert.equal(allowed('tests/unit/l06-unit.test.ts',id,entry),true);
  assert.equal(allowed('src/test/l06-unit.test.ts',id,entry),true);
  assert.equal(allowed('tests/e2e/l06-playback.spec.ts',id,entry),true);
  assert.equal(allowed('.github/workflows/autonomous-lesson-release.yml',id,entry),false);
});
test('exact-head CI success is not inferred from another SHA or failed run',()=>{
  const r={head_sha:'candidate',event:'workflow_dispatch',conclusion:'success',
    head_repository:{full_name:'freejapaneseacademy/freejapaneseacademy'}};
  assert.equal(exactSuccess([r],'candidate','freejapaneseacademy/freejapaneseacademy'),true);
  assert.equal(exactSuccess([r],'other','freejapaneseacademy/freejapaneseacademy'),false);
  assert.equal(exactSuccess([{...r,conclusion:'failure'}],'candidate','freejapaneseacademy/freejapaneseacademy'),false);
});
