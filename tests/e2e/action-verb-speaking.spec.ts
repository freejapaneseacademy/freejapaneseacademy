import { test, expect } from '@playwright/test';
const path = '/learn/n5/module-06/chapter-01/lesson-08/';
test('keyboard choices, printed model, feedback, retry and optional self-check', async ({page}) => {
  await page.goto(path);
  await expect(page.getByRole('heading',{name:/Say What You Do/})).toBeVisible();
  await page.getByLabel('My six-to-eight-line exchange').fill('土曜日に何をしますか。');
  await page.getByRole('button',{name:'Compare with printed model'}).click();
  await expect(page.getByRole('heading',{name:'Model exchange (printed, not recorded)'})).toBeVisible();
  const groups=page.locator('.foundation-question');
  await expect(groups).toHaveCount(12);
  for(let i=0;i<12;i++){
    const radio=groups.nth(i).getByRole('radio').first();
    await radio.focus(); await page.keyboard.press('Space');
    await expect(radio).toBeChecked();
  }
  await page.getByRole('button',{name:'Check written answers'}).click();
  await expect(page.getByText('Written score: 12 / 12')).toBeVisible();
  await page.getByRole('button',{name:'Retry written questions'}).click();
  await expect(page.getByRole('button',{name:'Check written answers'})).toBeDisabled();
});
test('320px dark mode and Japanese typing do not overflow',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(path);
  await page.getByLabel('My six-to-eight-line exchange').fill('本を読みます。');
  await expect(page.getByLabel('My six-to-eight-line exchange')).toHaveValue('本を読みます。');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
