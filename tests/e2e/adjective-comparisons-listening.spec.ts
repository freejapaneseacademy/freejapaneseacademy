import {test,expect} from '@playwright/test';
test('adjective listening supports keyboard, transcript access, 320px and dark mode',async({page})=>{
await page.setViewportSize({width:320,height:740});
await page.goto('/learn/n5/module-04/chapter-03/lesson-06/');
await expect(page.getByRole('heading',{name:/Listen and Compare/})).toBeVisible();
await expect(page.locator('audio')).toHaveCount(2);
await page.getByRole('button',{name:/Reveal transcript/}).first().focus();
await page.keyboard.press('Enter');
await expect(page.getByText(/Assisted practice:/)).toBeVisible();
const first=page.locator('fieldset[data-question-id]').first();
await first.locator('input[type=radio]').first().focus();await page.keyboard.press('Space');
await expect(first.locator('input[type=radio]').first()).toBeChecked();
expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
await page.emulateMedia({colorScheme:'dark'});await expect(page.locator('body')).toBeVisible();
});
