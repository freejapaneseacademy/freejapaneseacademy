import { test, expect } from '@playwright/test';
test('homepage leads to the five course levels', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('one word');
  for (const level of ['n5', 'n4', 'n3', 'n2', 'n1']) await expect(page.locator(`a[href="/learn/${level}/"]`).first()).toBeVisible();
});
test('lesson, quiz, and saved results', async ({ page }) => {
  await page.goto('/learn/n5/hiragana-introduction/');
  await page.getByRole('button', { name: /Mark lesson complete/ }).click();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
  await page.goto('/practice/demo/');
  await page.locator('input[name="demo-vowel-a"][value="a"]').check();
  await page.locator('input[name="demo-vowel-i"][value="i"]').check();
  await page.locator('input[name="demo-vowel-o"][value="o"]').check();
  await page.getByRole('button', { name: /Check my answers/ }).click();
  await expect(page.getByText('This result was saved on this device.')).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Hiragana demo quiz')).toBeVisible();
});

test('theme defaults to system and a manual choice persists across pages', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const toggle = page.getByRole('button', { name: 'Dark mode' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(() => localStorage.getItem('fja-theme'))).toBe('light');
  await page.goto('/dashboard/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Dark mode' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
