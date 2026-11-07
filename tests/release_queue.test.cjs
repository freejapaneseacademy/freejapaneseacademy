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
});
test('exact-head CI success is not inferred from another SHA or failed run',()=>{
  const r={head_sha:'candidate',event:'workflow_dispatch',conclusion:'success',
    head_repository:{full_name:'freejapaneseacademy/freejapaneseacademy'}};
  assert.equal(exactSuccess([r],'candidate','freejapaneseacademy/freejapaneseacademy'),true);
  assert.equal(exactSuccess([r],'other','freejapaneseacademy/freejapaneseacademy'),false);
  assert.equal(exactSuccess([{...r,conclusion:'failure'}],'candidate','freejapaneseacademy/freejapaneseacademy'),false);
});
