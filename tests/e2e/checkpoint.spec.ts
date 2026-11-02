import { test, expect } from '@playwright/test';
const url='/learn/start/module-01/chapter-01/checkpoint/';

test('Chapter 01 checkpoint shows real sources, scores 16 items, saves progress and completion',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('heading',{level:1,name:/Can you explain Japanese writing/})).toBeVisible();
  const root=page.locator('.checkpoint-practice');
  await expect(root.locator('tbody tr')).toHaveCount(9);
  await expect(root.locator('audio')).toHaveCount(2);
  await expect(root.locator('fieldset')).toHaveCount(16);
  await expect(root.getByRole('button',{name:'Check answers & save checkpoint score'})).toBeDisabled();
  for(const audio of await root.locator('audio').all())await audio.dispatchEvent('play');
  for(const group of await root.locator('fieldset').all())await group.locator('input[type=radio]').first().check();
  await root.getByRole('button',{name:'Check answers & save checkpoint score'}).click();
  await expect(root.getByText(/Your blind checkpoint score was saved locally/)).toBeVisible();
  await expect(root.locator('.foundation-feedback')).toHaveCount(16);
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Chapter 01 mixed checkpoint')).toBeVisible();
  await page.goto(url);
  await page.getByRole('button',{name:/Mark lesson complete/}).click();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
});

test('Chapter checkpoint transcript-assisted attempts are never saved as blind scores',async({page})=>{
  await page.goto(url);
  const root=page.locator('.checkpoint-practice');
  await root.getByRole('button',{name:/Reveal transcript/}).first().click();
  await expect(root.getByText(/Assisted mode: a transcript was revealed/)).toBeVisible();
  for(const audio of await root.locator('audio').all())await audio.dispatchEvent('play');
  for(const group of await root.locator('fieldset').all())await group.locator('input[type=radio]').first().check();
  await root.getByRole('button',{name:'Check assisted answers'}).click();
  await expect(root.getByText(/No blind checkpoint score was saved/)).toBeVisible();
  await root.getByRole('button',{name:'Start a new blind attempt'}).click();
  await expect(root.getByRole('button',{name:'Check answers & save checkpoint score'})).toBeDisabled();
  await root.locator('#checkpoint-writing-draft').fill('Hiragana and katakana use different shapes.');
  await root.getByRole('button',{name:/Compare with a model/}).click();
  await expect(root.getByText(/Model explanation/)).toBeVisible();
});

test('Checkpoint recordings return genuine WAV byte ranges',async({page})=>{
  await page.goto(url);
  const sources=await page.locator('.checkpoint-practice audio').evaluateAll(els=>els.map(el=>(el as HTMLAudioElement).src));
  expect(sources).toHaveLength(2);
  for(const src of sources){
    const res=await page.request.get(src,{headers:{Range:'bytes=0-43'},timeout:30000});
    expect(res.status()).toBe(206);
    expect(res.headers()['content-type']).toMatch(/^audio\/wav/);
    const header=await res.body();
    expect(header.length).toBe(44);
    expect(header.subarray(0,4).toString('ascii')).toBe('RIFF');
    expect(header.subarray(8,12).toString('ascii')).toBe('WAVE');
  }
});

for(const width of [320,375,390,768,1024,1440])test('Chapter checkpoint responsive and dark theme '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:820});
  await page.goto(url);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await expect(page.locator('.reading-chart-scroll')).toBeVisible();
  await page.locator('html').evaluate(el=>{el.dataset.theme='dark';});
  await expect(page.locator('.checkpoint-practice')).toBeVisible();
});
