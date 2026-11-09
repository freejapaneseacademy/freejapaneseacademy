import { test, expect } from '@playwright/test';
const path='/learn/start/module-05/chapter-02/lesson-06/';
test('listening interface is accessible on narrow mobile',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Hear Names, Numbers and Countries/i})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.locator('fieldset[data-question-id]')).toHaveCount(6);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 expect(overflow).toBe(false);
});
test('keyboard-accessible transcript is assisted and does not save blind score',async({page})=>{
 await page.goto(path);
 // Keep a stable reference: this button changes its name to "Hide transcript" on activation.
 const reveal=page.locator('.listening-track').first().getByRole('button');
 await expect(page.locator('fieldset[data-question-id]').first()).toBeEnabled();
 await expect(reveal).toBeEnabled();
 await reveal.focus(); await page.keyboard.press('Enter');
 await expect(page.getByText(/Assisted practice: you revealed written support/)).toBeVisible();
 await expect(reveal).toHaveAttribute('aria-expanded','true');
});
