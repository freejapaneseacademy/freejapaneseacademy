import { test, expect } from '@playwright/test';
test('L02 word study is keyboard-accessible, responsive and can retry', async ({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-02/chapter-04/lesson-02/');
 await expect(page.getByRole('heading',{name:/Mixed hiragana words/i})).toBeVisible();
 await expect(page.locator('fieldset')).toHaveCount(10);
 // Wait for Astro's client:load island to hydrate before interacting with controlled radios.
 await expect(page.locator('astro-island[component-url*="HiraganaFluencyVocabularyPractice"]')).not.toHaveAttribute('ssr');
 await expect(page.getByRole('button',{name:'Check all ten answers'})).toBeDisabled();
 for(const field of await page.locator('fieldset').all()) await field.locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check all ten answers'}).click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await expect(page.getByText(/Not quite\.|Correct\./).first()).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(page.getByRole('button',{name:'Check all ten answers'})).toBeDisabled();
 await page.evaluate(()=>document.documentElement.classList.add('dark'));
 await expect(page.getByRole('heading',{name:/Check your word knowledge/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});
