import { test, expect } from '@playwright/test';
import { verifyWavRangeOrFull } from './audio-response';
const url = '/learn/start/module-01/chapter-04/checkpoint/';
test('canonical Chapter 04 checkpoint is linked and indexable', async ({page}) => {
 await page.goto('/learn/start/');
 await expect(page.getByRole('link',{name:/Take Chapter 04 checkpoint/})).toHaveAttribute('href',url);
 await page.goto(url);
 await expect(page.getByRole('heading',{level:1,name:/enter Japanese and use reading aids/})).toBeVisible();
 await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
 await expect(page.locator('section[aria-labelledby="study-tools-checkpoint-written-title"] fieldset')).toHaveCount(12);
 await expect(page.locator('section[aria-labelledby="checkpoint-listening-title"] fieldset')).toHaveCount(4);
});
test('written answers give feedback and can retry',async({page})=>{
 await page.goto(url);
 const section=page.locator('section[aria-labelledby="study-tools-checkpoint-written-title"]');
 const submit=section.getByRole('button',{name:'Check all written answers'});
 await expect(submit).toBeDisabled();
 for(const field of await section.locator('fieldset').all()) await field.locator('input[type=radio]').first().check();
 await submit.click();
 await expect(section.getByText(/Written score: \d+\/12/)).toBeVisible();
 await section.getByRole('button',{name:/Try the written questions again/}).click();
 await expect(submit).toBeDisabled();
});
test('real WAV files load and transcripts are hidden before assisted mode',async({page})=>{
 await page.goto(url);
 const section=page.locator('section[aria-labelledby="checkpoint-listening-title"]');
 await expect(section.locator('audio')).toHaveCount(2);
 for(const player of await section.locator('audio').all()){
  const src=await player.getAttribute('src');
  expect(src).toMatch(/^\/audio\/fja-l0-m01-c04-l06-[ab]-v1\.wav$/);
  const res=await page.request.get(src!,{headers:{Range:'bytes=0-43'},timeout:30000});
  await verifyWavRangeOrFull(res,new URL(src!,page.url()).href);
 }
 await expect(section.getByText('Japanese transcript and English translation')).toHaveCount(0);
 await section.getByRole('button',{name:/Reveal transcripts/}).click();
 await expect(section.getByText('Japanese transcript and English translation')).toHaveCount(2);
 await expect(section.getByText(/Assisted mode: transcripts are visible/)).toBeVisible();
});
for(const width of [320,375,768,1440]){
 test('keyboard and dark theme without overflow at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto(url);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await page.locator('html').evaluate(el=>{el.dataset.theme='dark';});
  const radio=page.locator('section[aria-labelledby="study-tools-checkpoint-written-title"] input[type=radio]').first();
  await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();
 });
}
