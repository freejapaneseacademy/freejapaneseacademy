import { test, expect } from '@playwright/test';
const path='/learn/n5/module-07/chapter-03/lesson-06/';
test('comparison listening lesson is keyboard reachable',async ({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Choosing a Café and Picnic Snacks/i,level:1})).toBeVisible();
 await expect(page.getByText(/Track A — Choose a study café/).first()).toBeVisible();
 await page.keyboard.press('Tab');
 await expect(page.locator(':focus')).toBeVisible();
});
test('320px dark-mode page does not overflow',async ({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
