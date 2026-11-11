import { test, expect } from '@playwright/test';
const path='/learn/n5/module-04/chapter-04/lesson-02/';
test('keyboard practice, feedback and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Make a plan: invitations and places'})).toBeVisible();
 const groups=page.locator('section[aria-label="Invitation and meeting vocabulary practice"] fieldset');
 await expect(groups).toHaveCount(12);
 for(let i=0;i<12;i++){const first=groups.nth(i).locator('input[type="radio"]').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText(/Written practice: \d+ of 12 correct/)).toBeVisible();
 await expect(groups.first().getByRole('status')).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(groups.first().locator('input:checked')).toHaveCount(0);
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('section[aria-label="Invitation and meeting vocabulary practice"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
