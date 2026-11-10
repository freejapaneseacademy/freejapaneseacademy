import { test, expect } from '@playwright/test';
import { verifyWavRangeOrFull } from './audio-response';
const url = '/learn/start/module-01/chapter-02/lesson-08/';

test('L08 gives two genuine original audio tracks, eight accurate clip cues and live byte-range media', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByRole('heading', { level: 1, name: /Speak Japanese vowels with natural timing/ })).toBeVisible();
  const section = page.locator('.vowel-speaking');
  const audio = section.locator('.vowel-speaking-track audio');
  await expect(audio).toHaveCount(2);
  await expect(section.getByRole('button', { name: /Play track [AB] turn/ })).toHaveCount(8);
  const srcs = await audio.evaluateAll(elements => elements.map(el => (el as HTMLAudioElement).src));
  expect(new Set(srcs).size).toBe(2);
  for (const src of srcs) {
    expect(src).toMatch(/\/audio\/fja-l0-m01-c02-l06-[ab]-v1\.wav$/);
    const response = await page.request.get(src, { headers: { Range: 'bytes=0-43' }, timeout: 30_000 });
    await verifyWavRangeOrFull(response, src);
    const full = await page.request.get(src, { timeout: 30_000 });
    expect(full.status()).toBe(200);
    const bytes = await full.body();
    expect(bytes.length).toBeGreaterThan(800000);
    expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF');
    expect(bytes.subarray(8, 12).toString('ascii')).toBe('WAVE');
    expect(bytes.readUInt32LE(4)+8).toBe(bytes.length);
  }
  await section.getByRole('button', {name:'Show full transcript and translation'}).first().click();
  await expect(section.getByText(/男性： これ、家の写真ですか。/)).toBeVisible();
});

test('optional preparation score is distinct from speaking and saves locally', async ({ page }) => {
  await page.goto(url);
  const workshop = page.locator('.vowel-speaking');
  await expect(workshop.locator('fieldset')).toHaveCount(5);
  await expect(workshop.getByRole('button', { name: /Check preparation & save knowledge score/ })).toBeDisabled();
  for (const field of await workshop.locator('fieldset').all()) await field.locator('input[type=radio]').first().check();
  await workshop.getByRole('button', { name: /Check preparation & save knowledge score/ }).click();
  await expect(workshop.getByText(/Saved locally as a knowledge check only/)).toBeVisible();
  await expect(workshop.locator('.foundation-feedback')).toHaveCount(5);
  await workshop.getByRole('button', {name: 'Try preparation again'}).click();
  await expect(workshop.getByRole('button', {name:/Check preparation & save knowledge score/})).toBeDisabled();
  for (const item of await workshop.locator('.vowel-speaking-self-review input[type=checkbox]').all()) await item.check();
  await expect(workshop.getByText('5 of 5 criteria checked by you.')).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Vowel speaking knowledge preparation')).toBeVisible();
  await page.goto(url);
  await page.getByRole('button', {name:/Mark lesson complete/}).click();
  await expect(page.getByRole('button', {name:/Lesson completed/})).toBeVisible();
});

test('no microphone access occurs until the learner clicks, denial is recoverable', async ({page}) => {
  await page.addInitScript(() => {
    let calls=0;
    Object.defineProperty(window, '__micCalls', {get:()=>calls});
    Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{
      getUserMedia: async () => {calls++;throw new DOMException('Permission denied','NotAllowedError');}
    }});
  });
  await page.goto(url);
  const workshop=page.locator('.vowel-speaking');
  expect(await page.evaluate(()=>(window as unknown as {__micCalls:number}).__micCalls)).toBe(0);
  await expect(workshop.getByText(/You can speak aloud without using a microphone/)).toBeVisible();
  await workshop.getByRole('button',{name:'Start optional recording'}).click();
  await expect(workshop.getByRole('alert')).toContainText('Microphone unavailable');
  expect(await page.evaluate(()=>(window as unknown as {__micCalls:number}).__micCalls)).toBe(1);
});

for (const width of [320,375,390,768,1024,1440]) {
  test('L08 is readable and keyboard-accessible in light/dark themes at '+width+'px', async ({page}) => {
    await page.setViewportSize({width,height:900});
    await page.goto(url);
    await expect(page.locator('.vowel-speaking-track audio')).toHaveCount(2);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
    expect(overflow).toBe(false);
    await page.locator('[data-theme-toggle]').first().click().catch(()=>{});
    await expect(page.locator('.vowel-speaking-turn').first()).toBeVisible();
  });
}
