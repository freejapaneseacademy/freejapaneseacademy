import { test, expect } from '@playwright/test';
test('L07 marked-kana writing supports keyboard, retry, self-review and 320px dark mode',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-03/chapter-01/lesson-07/');
 await expect(page.getByRole('heading',{name:'Write voiced and p-series hiragana in classroom labels'})).toBeVisible();
 const button=page.getByRole('button',{name:'Check ten marked-kana answers'});
 await expect(button).toBeDisabled();
 const inputs=page.locator('input[type=text]');
 await expect(inputs).toHaveCount(10);
 // Astro renders inputs before React attaches event handlers; wait for the island to hydrate.
 await expect(page.locator('astro-island').filter({has:button})).not.toHaveAttribute('ssr','');
 for(const input of await inputs.all())await input.fill('かぎ');
 await expect(button).toBeEnabled();
 await button.click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await expect(page.getByText(/Model:/).first()).toBeVisible();
 await page.getByRole('button',{name:'Try the written answers again'}).click();
 await expect(button).toBeDisabled();
 await page.getByLabel('Your two-line message').fill('かぎは １ばん。\nかぎをみてください。');
 await page.getByText('Voiced or p-series marks match my intended words.').click();
 await expect(page.getByText('1/4 self-review criteria checked.')).toBeVisible();
 await page.evaluate(()=>document.documentElement.classList.add('dark'));
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});