import { test, expect } from '@playwright/test';
const path='/learn/n5/module-07/chapter-02/lesson-06/';
test('lesson and keyboard-reachable listening practice render',async ({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Weekend plans and a birthday gift/i,level:1})).toBeVisible();
 await expect(page.getByText(/Track A: Saturday and Sunday/).first()).toBeVisible();
 await page.keyboard.press('Tab');
 await expect(page.locator(':focus')).toBeVisible();
});
test('320px dark mode does not overflow horizontally',async ({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
