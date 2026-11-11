import { test, expect } from '@playwright/test';
import { verifyWavRangeOrFull } from './audio-response';
const url='/learn/start/module-02/chapter-01/checkpoint/';
test('canonical route, navigation, answers and genuine audio',async({page})=>{
 await page.goto('/learn/start/');await expect(page.getByRole('link',{name:/Take Hiragana Chapter 01 checkpoint/})).toHaveAttribute('href',url);
 await page.goto(url);await expect(page.getByRole('heading',{level:1,name:/first fifteen hiragana/})).toBeVisible();
 await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
 const written=page.locator('section[aria-labelledby="hiragana-checkpoint-written-title"]');
 const listening=page.locator('section[aria-labelledby="checkpoint-listening-title"]');
 await expect(written.locator('fieldset')).toHaveCount(12);await expect(listening.locator('fieldset')).toHaveCount(4);
 for(const player of await listening.locator('audio').all()){const src=await player.getAttribute('src');expect(src).toMatch(/^\/audio\/fja-l0-m02-c01-l06-[ab]-v1\.wav$/);const response=await page.request.get(src!,{headers:{Range:'bytes=0-43'}});await verifyWavRangeOrFull(response,new URL(src!,page.url()).href);}
 await expect(listening.getByText('Japanese transcript and English translation')).toHaveCount(0);
 for(const field of await written.locator('fieldset').all())await field.locator('input[type=radio]').first().check();
 await written.getByRole('button',{name:'Check all written answers'}).click();
 await expect(written.getByText(/Written score: \d+\/12/)).toBeVisible();
 await listening.getByRole('button',{name:/Reveal transcripts/}).click();
 await expect(listening.getByText('Japanese transcript and English translation')).toHaveCount(2);
});
for(const width of [320,375,768,1440])test('mobile, keyboard and dark mode '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(url);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
 await page.locator('html').evaluate(el=>{el.dataset.theme='dark';});
 const radio=page.locator('section[aria-labelledby="hiragana-checkpoint-written-title"] input[type=radio]').first();
 await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();
});