import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const publisher = 'ca-pub-3399213817491318';

function getAstroPages(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const pathname = join(directory, entry.name);
    return entry.isDirectory() ? getAstroPages(pathname)
      : entry.isFile() && entry.name.endsWith('.astro') ? [pathname] : [];
  });
}

describe('AdSense is inherited by every current and future page', () => {
  it('all HTML routes use the shared Base layout (no unmonetized bypass)', () => {
    const pages = getAstroPages(join(root, 'src/pages'));
    expect(pages.length).toBeGreaterThan(20);
    for (const page of pages) {
      const source = readFileSync(page, 'utf8');
      expect(source, page + ' must import the shared Base layout').toMatch(/from\s+['"][^'"]*layouts\/Base\.astro['"]/);
      expect(source, page + ' must render the shared Base layout').toContain('<Base');
    }
  });

  it('AdSense client is configured exactly once inside the global document head', () => {
    const source = readFileSync(join(root, 'src/layouts/Base.astro'), 'utf8');
    expect(source.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)).toHaveLength(1);
    expect(source).toContain('client=' + publisher);
    expect(source).toMatch(/<script\s+is:inline\s+async\s+src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3399213817491318"\s+crossorigin="anonymous"/);
    expect(source.indexOf('adsbygoogle.js')).toBeLessThan(source.indexOf('</head>'));
  });

  it('publishes the matching ads.txt declaration', () => {
    const ads = readFileSync(join(root, 'public/ads.txt'), 'utf8');
    expect(ads.trim()).toBe('google.com, pub-3399213817491318, DIRECT, f08c47fec0942fa0');
  });
});
