import { test, expect } from '@playwright/test';
const url = '/learn/start/module-01/chapter-01/lesson-08/';

test('L08 reuses full WAV model audio with working remote byte ranges', async ({ page }) => {
  await page.goto(url);
  const audio = page.locator('.speaking-practice .listening-track audio');
  await expect(audio).toHaveCount(2);
  const sources = await audio.evaluateAll(elements => elements.map(element => (element as HTMLAudioElement).src));
  expect(new Set(sources).size).toBe(2);
  for (const src of sources) {
    expect(src).toMatch(/fja-lesson-audio/);
    const response = await page.request.get(src, { headers: { Range: 'bytes=0-43' }, timeout: 30000 });
    expect(response.status()).toBe(206);
    expect(response.headers()['content-type']).toMatch(/^audio\/wav/);
    expect(response.headers()['content-range']).toMatch(/^bytes 0-43\/\d+$/);
    const header = await response.body();
    expect(header.length).toBe(44);
    expect(header.subarray(0, 4).toString('ascii')).toBe('RIFF');
    expect(header.subarray(8, 12).toString('ascii')).toBe('WAVE');
    const full = await page.request.get(src, { timeout: 30000 });
    expect(full.status()).toBe(200);
    const wav = await full.body();
    expect(wav.length).toBeGreaterThan(500000);
    expect(wav.subarray(0, 4).toString('ascii')).toBe('RIFF');
    expect(wav.subarray(8, 12).toString('ascii')).toBe('WAVE');
    expect(wav.readUInt32LE(4) + 8).toBe(wav.length);
    expect(wav.readUInt32LE(24)).toBe(44100);
    let nonzero = 0;
    for (let i = 44; i < wav.length; i += 4096) if (wav[i] !== 0 || wav[i + 1] !== 0) nonzero++;
    expect(nonzero).toBeGreaterThan(20);
  }
});

test('L08 choice feedback, retry, self-review, progress and completion', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByRole('heading', { level: 1, name: /Say how Japanese writing works/ })).toBeVisible();
  const workshop = page.locator('.speaking-practice');
  await expect(workshop.locator('fieldset')).toHaveCount(5);
  await expect(workshop.getByRole('button', { name: 'Check phrases & save choice score' })).toBeDisabled();
  for (const fieldset of await workshop.locator('fieldset').all()) await fieldset.locator('input[type=radio]').first().check();
  await workshop.getByRole('button', { name: 'Check phrases & save choice score' }).click();
  await expect(workshop.getByText(/Saved locally as a preparation check/)).toBeVisible();
  await expect(workshop.locator('.foundation-feedback')).toHaveCount(5);
  await workshop.getByRole('button', { name: 'Try the phrase choices again' }).click();
  await expect(workshop.getByRole('button', { name: 'Check phrases & save choice score' })).toBeDisabled();
  for (const box of await workshop.locator('.writing-rubric-item input[type=checkbox]').all()) await box.check();
  await expect(workshop.getByText('5 of 5 criteria checked by you.')).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Speaking phrase preparation')).toBeVisible();
  await page.goto(url);
  await page.getByRole('button', { name: /Mark lesson complete/ }).click();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
});

test('L08 microphone is never requested before an explicit click, and denial is recoverable', async ({ page }) => {
  await page.addInitScript(() => {
    let calls = 0;
    Object.defineProperty(window, '__micCalls', { get: () => calls });
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: {
      getUserMedia: async () => { calls++; throw new DOMException('Permission denied', 'NotAllowedError'); }
    } });
  });
  await page.goto(url);
  const workshop = page.locator('.speaking-practice');
  expect(await page.evaluate(() => (window as unknown as { __micCalls: number }).__micCalls)).toBe(0);
  await workshop.getByRole('button', { name: 'Start optional recording' }).click();
  await expect(workshop.getByRole('alert')).toContainText('Microphone unavailable');
  expect(await page.evaluate(() => (window as unknown as { __micCalls: number }).__micCalls)).toBe(1);
  await expect(workshop.getByText(/You can speak aloud without using a microphone/)).toBeVisible();
});

for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test('L08 responsive, keyboard-accessible and dark theme at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 820 });
    await page.goto(url);
    await expect(page.locator('.speaking-practice')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 2);
    await page.locator('html').evaluate(element => { element.dataset.theme = 'dark'; });
    await expect(page.locator('.speaking-cues li').first()).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.locator('body')).toBeVisible();
  });
}
