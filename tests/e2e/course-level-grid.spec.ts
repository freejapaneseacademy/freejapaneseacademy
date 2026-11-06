import { test, expect } from '@playwright/test';

const expected = [
  ['/learn/start/', 'L0', 'Japanese Foundations'],
  ['/learn/n5/', 'N5', 'The first steps'],
  ['/learn/n4/', 'N4', 'Build your foundation'],
  ['/learn/n3/', 'N3', 'Find your rhythm'],
  ['/learn/n2/', 'N2', 'Go beyond the basics'],
  ['/learn/n1/', 'N1', 'Explore the full depth']
] as const;

test('Level 0 is the first of six equal pathway cards, without a separate red CTA', async ({page}) => {
  await page.goto('/learn/');
  const cards = page.locator('.course-grid--pathway > a.course-card');
  await expect(cards).toHaveCount(6);
  for (let i = 0; i < expected.length; i++) {
    await expect(cards.nth(i)).toHaveAttribute('href', expected[i][0]);
    await expect(cards.nth(i).locator('.course-symbol')).toHaveText(expected[i][1]);
    await expect(cards.nth(i).locator('strong')).toHaveText(expected[i][2]);
  }
  await expect(page.locator('.foundation-feature')).toHaveCount(0);
  await expect(page.locator('.course-card--foundations')).toHaveCount(1);
  await expect(cards.first().locator('.course-bottom')).toContainText('View pathway');
  await cards.first().click();
  await expect(page).toHaveURL(/\/learn\/start\/$/);
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
});

for (const [width, columns] of [[320,1],[375,1],[600,2],[768,2],[1024,3],[1440,3]] as const) {
  test('Six level cards fit ' + width + 'px with ' + columns + ' columns, including dark mode', async ({page}) => {
    await page.setViewportSize({width, height:880});
    await page.goto('/learn/');
    const cards = page.locator('.course-grid--pathway > a.course-card');
    await expect(cards).toHaveCount(6);
    const count = await page.locator('.course-grid--pathway').evaluate(node =>
      getComputedStyle(node).gridTemplateColumns.split(' ').filter(Boolean).length
    );
    expect(count).toBe(columns);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    await expect(cards.first()).toBeVisible();
    const cardWidth = await cards.first().evaluate(node => node.getBoundingClientRect().width);
    expect(cardWidth).toBeGreaterThan(200);
    await page.locator('html').evaluate(node => { node.dataset.theme = 'dark'; });
    await expect(cards.first().locator('.course-symbol')).toBeVisible();
    await cards.first().focus();
    await expect(cards.first()).toBeFocused();
  });
}
