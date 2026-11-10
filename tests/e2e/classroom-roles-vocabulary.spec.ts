import {test,expect} from '@playwright/test';
test('N5 classroom roles: keyboard, retry, 320px dark mode',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/learn/n5/module-01/chapter-02/lesson-02/');
 await expect(page.getByRole('heading',{level:1,name:/People and classroom roles/})).toBeVisible();
 const groups=page.locator('fieldset[data-question-id]');
 await expect(groups).toHaveCount(10);
 await expect(groups.first().getByRole('radio').first()).toBeEnabled();
 await groups.first().getByRole('radio').first().focus();await page.keyboard.press('Space');
 await expect(groups.first().getByRole('radio').first()).toBeChecked();
 for(let i=1;i<10;i++)await groups.nth(i).getByRole('radio').first().check();
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Score: 10/10')).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});