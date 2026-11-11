import { test, expect } from '@playwright/test';
const url='/learn/n5/module-05/chapter-02/lesson-06/';
test('listening route is accessible by keyboard',async({page})=>{await page.goto(url);await expect(page.getByRole('heading',{name:/Listen to travel plans/})).toBeVisible();await page.keyboard.press('Tab');await expect(page.locator(':focus')).toBeVisible();await expect(page.getByText('Museum trip partners').first()).toBeVisible();});
test('320px mobile in dark mode has no horizontal overflow',async({page})=>{await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);await expect(page.locator('body')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);});
