import { test, expect } from '@playwright/test';
test('l0-m05-c02-l02 works by keyboard on 320px mobile',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/learn/start/module-05/chapter-02/lesson-02/');
 await expect(page.getByRole('heading',{name:/Numbers and personal details/i}).first()).toBeVisible();
 const quiz=page.getByRole('region',{name:'Numbers and personal details practice'});
 const button=quiz.getByRole('button',{name:'Check twelve answers'});
 await expect(button).toBeDisabled();
 await expect(page.locator('astro-island').filter({has:button})).not.toHaveAttribute('ssr','');
 const fields=quiz.locator('fieldset');
 await expect(fields).toHaveCount(12);
 for(const field of await fields.all()){await field.locator('input[type=radio]').first().focus();await page.keyboard.press('Space');}
 await expect(button).toBeEnabled();
 await button.click();
 await expect(quiz.getByText(/Written recognition score:/)).toBeVisible();
 await quiz.getByRole('button',{name:'Retry questions'}).click();
 await expect(button).toBeDisabled();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
 expect(overflow).toBe(false);
});
