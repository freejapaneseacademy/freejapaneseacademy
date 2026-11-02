import { test, expect } from '@playwright/test';
test('L06 actual hosted WAVs return complete byte-range content', async ({page})=>{
  await page.goto('/learn/start/module-01/chapter-01/lesson-06/');
  const media = page.locator('.listening-practice audio');
  await expect(media).toHaveCount(2);
  const sources = await media.evaluateAll(elements => elements.map(element => (element as HTMLAudioElement).src));
  expect(new Set(sources).size).toBe(2);
  for(const src of sources){
    const res=await page.request.get(src,{headers:{Range:'bytes=0-43'},timeout:30000});
    expect(res.status(),src+' must return 206 Partial Content').toBe(206);
    expect(res.headers()['content-type']).toMatch(/^audio\/wav/);
    expect(res.headers()['content-range']).toMatch(/^bytes 0-43\/\d+$/);
    const bytes=await res.body();
    expect(bytes.length).toBe(44);
    expect(bytes.subarray(0,4).toString('ascii')).toBe('RIFF');
    expect(bytes.subarray(8,12).toString('ascii')).toBe('WAVE');
  }
});
test('L06 blind listening saves progress, transcript reveal switches to assisted',async({page})=>{
  await page.goto('/learn/start/module-01/chapter-01/lesson-06/');
  await expect(page.getByRole('heading',{level:1,name:/Hear Japanese writing/})).toBeVisible();
  const root=page.locator('.listening-practice');
  await expect(root.locator('audio')).toHaveCount(2);
  await expect(root.locator('fieldset')).toHaveCount(8);
  await expect(root.getByRole('button',{name:'Check answers & save blind score'})).toBeDisabled();
  // Playback is checked by the independent real HTTP byte-range test.
  // Simulate the HTMLMediaElement play event here to exercise just the React state transition.
  for(const audio of await root.locator('audio').all())await audio.dispatchEvent('play');
  for(const group of await root.locator('fieldset').all())await group.locator('input[type=radio]').first().check();
  await root.getByRole('button',{name:'Check answers & save blind score'}).click();
  await expect(root.getByText(/Your blind listening practice score was saved locally/)).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Japanese listening overview')).toBeVisible();
  await page.goto('/learn/start/module-01/chapter-01/lesson-06/');
  await page.getByRole('button',{name:/Mark lesson complete/}).click();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
  await page.goto('/learn/start/module-01/chapter-01/lesson-06/');
  await root.getByRole('button',{name:/Reveal transcript/}).first().click();
  await expect(root.getByText(/Assisted mode: you revealed a transcript/)).toBeVisible();
  for(const audio of await root.locator('audio').all())await audio.dispatchEvent('play');
  for(const group of await root.locator('fieldset').all())await group.locator('input[type=radio]').first().check();
  await root.getByRole('button',{name:'Check assisted answers'}).click();
  await expect(root.getByText(/No blind listening score was saved/)).toBeVisible();
});
for(const width of [320,375,390,768,1024,1440])test('L06 no horizontal overflow at '+width,async({page})=>{
  await page.setViewportSize({width,height:800});
  await page.goto('/learn/start/module-01/chapter-01/lesson-06/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await expect(page.locator('.listening-track').first()).toBeVisible();
});
