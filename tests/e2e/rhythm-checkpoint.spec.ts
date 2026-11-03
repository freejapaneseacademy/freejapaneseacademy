import { test, expect } from '@playwright/test';
import { verifyWavRangeOrFull } from './audio-response';

const url = '/learn/start/module-01/chapter-03/checkpoint/';

test('canonical checkpoint is public, indexable and linked from Foundations', async ({ page }) => {
  await page.goto('/learn/start/');
  await expect(page.getByRole('link',{name:/Take Chapter 03 checkpoint/})).toHaveAttribute('href',url);
  await page.goto(url);
  await expect(page.getByRole('heading',{level:1,name:/long vowels, small っ and nasal ん/})).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toContain(url);
  await expect(page.locator('section[aria-labelledby="rhythm-checkpoint-written-title"] fieldset')).toHaveCount(12);
  await expect(page.locator('section[aria-labelledby="checkpoint-listening-title"] fieldset')).toHaveCount(4);
  await page.goto('/learn/l0/sound-changes-rhythm-checkpoint/');
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
  // The generic MDX presentation is intentionally noindex; the canonical checkpoint route is linked above.
});

test('written questions provide feedback, retry and separate saved progress',async ({ page }) => {
  await page.goto(url);
  const section=page.locator('section[aria-labelledby="rhythm-checkpoint-written-title"]');
  const submit=section.getByRole('button',{name:'Check all written answers'});
  await expect(submit).toBeDisabled();
  for (const field of await section.locator('fieldset').all()) await field.locator('input[type=radio]').first().check();
  await submit.click();
  await expect(section.getByText(/Written score: \d+\/12/)).toBeVisible();
  await expect(section.getByText('Written attempt saved on this device.')).toBeVisible();
  await section.getByRole('button',{name:'Try the written questions again'}).click();
  await expect(submit).toBeDisabled();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Chapter 03 written rhythm checkpoint')).toBeVisible();
});

test('actual real WAVs are pinned and transcripts require explicit assisted mode', async ({ page }) => {
  await page.goto(url);
  const listening=page.locator('section[aria-labelledby="checkpoint-listening-title"]');
  const players=listening.locator('audio');
  await expect(players).toHaveCount(2);
  for (const item of await players.all()) {
    const src=await item.getAttribute('src');
    expect(src).toMatch(/^\/audio\/fja-l0-m01-c03-l06-[ab]-v1\.wav$/);
    const ranged=await page.request.get(src!,{headers:{Range:'bytes=0-43'},timeout:30000});
    await verifyWavRangeOrFull(ranged,new URL(src!,page.url()).href);
  }
  await expect(listening.getByText('Japanese transcript and English translation')).toHaveCount(0);
  for(const field of await listening.locator('fieldset').all()) await field.locator('input[type=radio]').first().check();
  await expect(listening.getByRole('button',{name:'Check listening answers'})).toBeDisabled();
  await listening.getByRole('button',{name:/Reveal transcripts/}).click();
  await expect(listening.getByText('Japanese transcript and English translation')).toHaveCount(2);
  await expect(listening.getByText(/Assisted mode: transcripts are visible/)).toBeVisible();
});

for(const width of [320,375,768,1440]) {
  test('checkpoint has no horizontal overflow and supports keyboard at '+width+'px',async ({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto(url);
    await expect(page.locator('section[aria-labelledby="rhythm-checkpoint-written-title"] fieldset')).toHaveCount(12);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
    await page.locator('html').evaluate(el=>{el.dataset.theme='dark';});
    const radio=page.locator('section[aria-labelledby="rhythm-checkpoint-written-title"] input[type=radio]').first();
    await expect(radio).toBeEnabled();
    await radio.focus();
    await page.keyboard.press('Space');
    await expect(radio).toBeChecked();
  });
}
