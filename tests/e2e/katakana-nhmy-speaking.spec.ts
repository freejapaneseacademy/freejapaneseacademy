import { test,expect } from '@playwright/test';
const path='/learn/start/module-04/chapter-02/lesson-08/';
test('optional shadowing page is keyboard accessible with separate written grading',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/optional model-audio shadowing/i})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.getByText(/not a pronunciation test/i).first()).toBeVisible();
 const submit=page.getByRole('button',{name:'Check eight written answers'});
 await expect(submit).toBeDisabled();
 const groups=page.locator('fieldset').filter({has:page.locator('input[type=radio]')});
 await expect(groups).toHaveCount(8);
 for(const group of await groups.all()) await group.locator('input[type=radio]').first().check();
 await expect(submit).toBeEnabled();
 await submit.click();
 await expect(page.getByText(/Written recognition score:/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Try written questions again'})).toBeVisible();
 await page.getByRole('button',{name:'Try written questions again'}).click();
 await expect(submit).toBeDisabled();
});
test('320px mobile viewport has no horizontal overflow and supports keyboard checklist',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/optional model-audio shadowing/i})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 const box=page.getByRole('checkbox').first();
 await box.focus();await page.keyboard.press('Space');
 await expect(box).toBeChecked();
 await expect(page.getByText(/Checked 1 of 3 reflections/)).toBeVisible();
});
