import { test, expect } from '@playwright/test';
const path='/learn/start/module-05/chapter-04/lesson-06/';
test('mobile listening controls and six accessible questions',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Listen and plan/i})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.locator('fieldset[data-question-id]')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});
test('keyboard transcript reveal changes to assisted mode and retry remains available',async({page})=>{
 await page.goto(path);
 const button=page.locator('.listening-track').first().getByRole('button',{name:/transcript/i});
 // An interactive control signals that its React island has finished hydrating.
 await expect(button).toBeEnabled();
 await button.focus();
 await button.press('Enter');
 await expect(button).toHaveAttribute('aria-expanded','true');
 await expect(page.getByText(/Assisted practice: you revealed written support/)).toBeVisible();
 await expect(page.getByRole('button',{name:/Start a new listening attempt/i})).toBeVisible();
});
