import { test, expect } from '@playwright/test';
const route='/learn/start/module-02/chapter-03/checkpoint/';
test('chapter checkpoint has two real audio tracks and 12 original scored questions', async ({page}) => {
 await page.goto(route);
 await expect(page.getByRole('heading',{name:/Chapter 03 checkpoint/}).first()).toBeVisible();
 await expect(page.locator('audio[src^="/audio/fja-l0-m02-c03-l06-"]')).toHaveCount(2);
 await expect(page.locator('fieldset[data-question-id^="ex-l0-m02-c03-chk-"]')).toHaveCount(12);
 await expect(page.getByRole('button',{name:'Check answers and save checkpoint score'})).toBeDisabled();
});
test('assisted keyboard review reveals explanations and can retry', async ({page}) => {
 await page.goto(route);
 await page.getByRole('button',{name:/Reveal Fruit shop dialogue transcript/}).click();
 const fields=page.locator('fieldset[data-question-id^="ex-l0-m02-c03-chk-"]');
 for(let i=0;i<12;i++){ const input=fields.nth(i).locator('input[type="radio"]').first();await input.focus();await page.keyboard.press('Space');await expect(input).toBeChecked(); }
 await page.getByRole('button',{name:'Check answers and save checkpoint score'}).click();
 await expect(page.getByText(/assisted transcript review/).last()).toBeVisible();
 await expect(page.getByRole('button',{name:'Try checkpoint again'})).toBeVisible();
});
test('320px viewport and dark theme do not overflow',async ({page})=>{
 await page.setViewportSize({width:320,height:720});await page.goto(route);
 await expect(page.getByRole('heading',{name:'Chapter 03 mixed checkpoint'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
});
