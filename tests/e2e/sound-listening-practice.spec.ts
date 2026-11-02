import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const url = '/learn/start/module-01/chapter-02/lesson-06/';
const manifest = JSON.parse(readFileSync(new URL('../../src/content/audio/l0-m01-c02-l06-v1.json', import.meta.url), 'utf8')) as {
  assets: { mediaPath: string; durationSeconds: number; qa: { bytes: number; sha256: string } }[];
};

test('Chapter 02 L06 serves two complete playable, pinned real WAVs', async ({ page }) => {
  await page.goto(url);
  const root = page.locator('.listening-practice');
  await expect(root.locator('audio')).toHaveCount(2);
  await expect(root.locator('fieldset')).toHaveCount(7);
  await expect(root.locator('.listening-transcript')).toHaveCount(0);
  for (const [i, asset] of manifest.assets.entries()) {
    const media = root.locator('audio').nth(i);
    await expect(media).toHaveAttribute('src', asset.mediaPath);
    const full = await page.request.get(asset.mediaPath, { timeout: 30000 });
    expect(full.status()).toBe(200);
    expect(full.headers()['content-type']).toMatch(/^audio\/(?:wav|wave|x-wav)/);
    const body = await full.body();
    expect(body.length).toBe(asset.qa.bytes);
    expect(body.toString('ascii', 0, 4)).toBe('RIFF');
    expect(body.toString('ascii', 8, 12)).toBe('WAVE');
    expect(body.readUInt32LE(4) + 8).toBe(body.length);
    expect(body.readUInt32LE(24)).toBe(44100);
    expect(createHash('sha256').update(body).digest('hex')).toBe(asset.qa.sha256);
    const range = await page.request.get(asset.mediaPath, { headers: { Range: 'bytes=0-43' }, timeout: 30000 });
    expect([200, 206]).toContain(range.status()); // Astro dev may ignore Range; production must support it.
    const prefix = await range.body();
    if (range.status() === 206) {
      expect(prefix.length).toBe(44);
      expect(range.headers()['content-range']).toBe('bytes 0-43/' + asset.qa.bytes);
    } else {
      expect(prefix.length).toBe(asset.qa.bytes);
      expect(createHash('sha256').update(prefix).digest('hex')).toBe(asset.qa.sha256);
    }
    // Real Chromium decoder playback, not a synthetic React play event.
    const seconds = await media.evaluate(async element => {
      const audio = element as HTMLAudioElement;
      audio.muted = true;
      await audio.play();
      await new Promise(resolve => setTimeout(resolve, 450));
      const current = audio.currentTime;
      audio.pause();
      return current;
    });
    expect(seconds).toBeGreaterThan(0);
  }
});

test('Chapter 02 L06 records blind answers and keeps assisted review unscored', async ({ page }) => {
  await page.goto(url);
  const root = page.locator('.listening-practice');
  await expect(root.locator('fieldset input[type=radio]').first()).toBeEnabled();
  await expect(root.getByRole('button', { name: 'Check answers & save blind score' })).toBeDisabled();
  for (const audio of await root.locator('audio').all()) await audio.dispatchEvent('play');
  await expect(root.getByText('Playback started')).toHaveCount(2);
  for (const group of await root.locator('fieldset').all()) await group.locator('input[type=radio]').first().check();
  await root.getByRole('button', { name: 'Check answers & save blind score' }).click();
  await expect(root.getByText(/Your unaided listening score was saved locally/)).toBeVisible();
  await expect(root.getByText('Listening evidence:', { exact: false })).toHaveCount(7);
  await page.getByRole('button', { name: /Mark lesson complete/ }).click();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
  await expect(root.locator('.listening-transcript')).toHaveCount(0);
  await root.getByRole('button', { name: /Reveal transcript/ }).first().click();
  await expect(root.getByText(/Assisted practice: you revealed written support/)).toBeVisible();
  for (const group of await root.locator('fieldset').all()) await group.locator('input[type=radio]').first().check();
  await root.getByRole('button', { name: 'Check assisted answers' }).click();
  await expect(root.getByText(/No unaided listening score was recorded/)).toBeVisible();
});

for (const width of [320, 375, 390, 768, 1024]) {
  test('Chapter 02 L06 fits ' + width + 'px with accessible audio and controls', async ({ page }) => {
    await page.setViewportSize({ width, height: 820 });
    await page.goto(url);
    await expect(page.locator('.listening-track').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 2);
    await page.locator('html').evaluate(el => { el.dataset.theme = 'dark'; });
    await expect(page.locator('.listening-practice')).toBeVisible();
  });
}
