import {test,expect} from '@playwright/test';

test('audio-gated listening and keyboard transcript reveal',async({page})=>{
  await page.goto('/learn/n5/module-02/chapter-04/lesson-06/');
  await expect(page.getByRole('heading',{name:/describing a room/i}).first()).toBeVisible();
  await expect(page.getByRole('button',{name:/check six listening answers/i})).toBeDisabled();
  const button=page.getByRole('button',{name:/show transcript/i}).first();
  // Astro renders the button before React's client:load event handlers hydrate.
  // Wait for the containing island to finish hydration before testing Enter.
  const island=page.locator('astro-island').filter({has:button});
  await expect(island).toHaveCount(1);
  await expect.poll(()=>island.getAttribute('ssr')).toBeNull();
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded','true');
  await expect(page.getByText('机の上に本があります。',{exact:false}).first()).toBeVisible();
});

test('320px dark mode avoids horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:700});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto('/learn/n5/module-02/chapter-04/lesson-06/');
  await expect(page.locator('audio')).toHaveCount(2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
