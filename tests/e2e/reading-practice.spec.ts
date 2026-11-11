import { test,expect } from '@playwright/test';

test('L05 chart, feedback, score and completion persist in browser',async({page})=>{
  await page.goto('/learn/start/module-01/chapter-01/lesson-05/');
  await expect(page.getByRole('heading',{name:/Read a classroom script chart/i,level:1})).toBeVisible();
  const practice=page.locator('.reading-practice');
  await expect(practice.locator('tbody tr')).toHaveCount(9);
  await expect(practice.locator('fieldset')).toHaveCount(12);
  await expect(practice.getByRole('button',{name:'Check answers & save score'})).toBeDisabled();
  for(const fieldset of await practice.locator('fieldset').all())await fieldset.locator('input[type="radio"]').first().check();
  await practice.getByRole('button',{name:'Check answers & save score'}).click();
  await expect(practice.getByText(/Your reading-practice score was saved locally/)).toBeVisible();
  await expect(practice.getByText(/Chart evidence:/)).toHaveCount(12);
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Chart reading and evidence')).toBeVisible();
  await page.goto('/learn/start/module-01/chapter-01/lesson-05/');
  await page.getByRole('button',{name:/Mark lesson complete/}).click();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
});

test('L05 reading chart and optional evidence self-review are accessible',async({page})=>{
  await page.goto('/learn/start/module-01/chapter-01/lesson-05/');
  await expect(page.getByRole('region',{name:/Script-identification chart/})).toBeVisible();
  await page.locator('#reading-evidence-draft').fill('Row D shows 山 with やま, meaning mountain.');
  await page.getByRole('button',{name:'Compare with model & checklist'}).click();
  await expect(page.getByText('Model evidence note',{exact:true})).toBeVisible();
  await expect(page.getByText(/self-reviewed, not automatically graded/)).toBeVisible();
});

for(const width of [320,375,390,768,1024,1440])test('L05 chart does not overflow page at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:800});
  await page.goto('/learn/start/module-01/chapter-01/lesson-05/');
  const dimensions=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:window.innerWidth}));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport+2);
  await expect(page.locator('.reading-chart-scroll')).toBeVisible();
});
