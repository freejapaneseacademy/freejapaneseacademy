import { test, expect } from '@playwright/test';
const route='/learn/n5/module-01/chapter-02/lesson-06/';
test('canonical page, keyboard and audio gate',async({page})=>{
 await page.goto(route);
 await expect(page.getByRole('heading',{name:/Questions about people — listen/i})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Listen and answer'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Check listening answers'})).toBeDisabled();
 await page.getByRole('button',{name:/Reveal transcript/}).first().focus();
 await page.keyboard.press('Enter');
 await expect(page.getByRole('button',{name:/Hide transcript/}).first()).toHaveAttribute('aria-expanded','true');
 await expect(page.getByText(/たなかさんも、きょうしつです/).first()).toBeVisible();
 await expect(page.getByRole('button',{name:'Check listening answers'})).toBeDisabled();
});
test('320px dark mode stays within viewport',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(route);
 await expect(page.getByRole('heading',{name:'Listen and answer'})).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});
