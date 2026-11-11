// Submit only changed, published, canonical URLs after the exact Cloudflare commit is live.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

export const SITE = 'https://free-japanese-academy.pages.dev';
export const KEY_PATH = 'public/722667cd0b13f77b4f75fead7224eec8.txt';

export const eligible = entry => entry?.status === 'published' &&
  entry.noindex === false && typeof entry.url === 'string' && entry.url.startsWith('/');

export function changedPaths(now, old, filenames) {
  const changed = new Set(filenames), previous = new Map(old.map(x => [x.id, x]));
  const paths = new Set();
  for (const item of now) {
    if (!eligible(item)) continue;
    const prior = previous.get(item.id);
    if ((item.content && changed.has(item.content)) ||
        (changed.has('docs/LESSON_INVENTORY.json') &&
          (!eligible(prior) || prior.url !== item.url))) paths.add(item.url);
  }
  for (const file of changed) {
    if (!/^src\/pages\/.+\.(astro|md|mdx)$/.test(file) || /[\[\]]/.test(file)) continue;
    let route = file.replace(/^src\/pages\//, '').replace(/\.(astro|md|mdx)$/, '');
    route = route.replace(/(^|\/)index$/, '$1').replace(/\/+$/, '');
    if (route === '404') continue;
    paths.add('/' + (route ? route + '/' : ''));
  }
  return [...paths].sort();
}

export function locations(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(m =>
    m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"')
       .replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
}

export function isSiteUrl(value) {
  try { const url = new URL(value); return url.origin === SITE && !url.search && !url.hash; }
  catch { return false; }
}

function git(args) {
  return execFileSync('git', args, {encoding:'utf8', maxBuffer:8*1024*1024}).trim();
}
function readOld(sha) {
  if (!/^[a-f0-9]{40}$/.test(sha) || /^0+$/.test(sha)) return [];
  try { return JSON.parse(git(['show', sha + ':docs/LESSON_INVENTORY.json'])).items || []; }
  catch { return []; }
}
function changedFiles(before, after) {
  if (!/^[a-f0-9]{40}$/.test(before) || /^0+$/.test(before)) return [];
  return git(['diff','--name-only',before,after]).split('\n').filter(Boolean);
}
async function get(url) {
  const r = await fetch(url, {
    signal: AbortSignal.timeout(20000), cache:'no-store',
    headers:{'user-agent':'FreeJapaneseAcademy-IndexNow/1.0'}
  });
  if (!r.ok) throw Error('GET ' + url + ' returned HTTP ' + r.status);
  return r;
}
async function waitForProduction(sha) {
  const url = SITE + '/indexnow-deployment.txt?commit=' + sha;
  for (let attempt=0; attempt<96; attempt++) {
    try {
      const r = await get(url);
      if ((await r.text()).trim() === sha) {
        console.log('Cloudflare production verified at commit ' + sha);
        return;
      }
    } catch (e) {
      if (attempt % 6 === 0) console.log('Production not yet ready: ' + e.message);
    }
    await sleep(10000);
  }
  throw Error('Expected commit not visible on production; IndexNow notification stopped.');
}
async function sitemapUrls() {
  const index = await (await get(SITE + '/sitemap-index.xml')).text();
  const sitemaps = index.includes('<urlset') ? [SITE + '/sitemap-index.xml'] : locations(index);
  if (!sitemaps.length) throw Error('Sitemap index is empty.');
  const urls = new Set();
  for (const path of sitemaps) {
    if (!isSiteUrl(path) || !new URL(path).pathname.endsWith('.xml')) throw Error('Invalid child sitemap: ' + path);
    const xml = await (await get(path)).text();
    for (const url of locations(xml)) if (isSiteUrl(url)) urls.add(url);
  }
  if (!urls.size) throw Error('Production sitemap contains no usable URLs.');
  return urls;
}
async function liveAndIndexable(url) {
  try {
    const r = await get(url);
    if (!isSiteUrl(r.url) || !(r.headers.get('content-type')||'').includes('text/html')) return false;
    const html = await r.text();
    const link = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
    const canonical = link?.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (!canonical || new URL(canonical, SITE).href !== url) return false;
    if ([...html.matchAll(/<meta\b[^>]*\bname=["']robots["'][^>]*>/gi)]
      .some(m => /\bnoindex\b/i.test(m[0]))) return false;
    return true;
  } catch (e) {
    console.warn('Skipped unreachable page: ' + url + ' (' + e.message + ')');
    return false;
  }
}
async function send(urls, key) {
  for(let i=0; i<urls.length; i+=10000) {
    const batch=urls.slice(i,i+10000);
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method:'POST', signal:AbortSignal.timeout(30000),
      headers:{'content-type':'application/json; charset=utf-8','user-agent':'FreeJapaneseAcademy-IndexNow/1.0'},
      body:JSON.stringify({
        host:new URL(SITE).hostname, key,
        keyLocation:SITE + '/' + key + '.txt', urlList:batch
      })
    });
    if (![200,202].includes(r.status)) {
      throw Error('IndexNow rejected URLs: HTTP ' + r.status + ' ' + (await r.text()).slice(0,300));
    }
    console.log('IndexNow received ' + batch.length + ' URL(s), HTTP ' + r.status);
  }
}
async function main() {
  const sha=process.env.TARGET_COMMIT || process.env.GITHUB_SHA || '';
  const before=process.env.PREVIOUS_COMMIT || '';
  if(!/^[a-f0-9]{40}$/.test(sha) || git(['rev-parse','HEAD']) !== sha)
    throw Error('Refusing to submit without matching checked-out production SHA.');
  const key=readFileSync(KEY_PATH, 'utf8').trim();
  if(!/^[A-Za-z0-9-]{8,128}$/.test(key) || KEY_PATH !== 'public/' + key + '.txt')
    throw Error('Invalid IndexNow key or key filename.');
  const files=changedFiles(before,sha);
  const bootstrap=process.env.INDEXNOW_BOOTSTRAP === 'true' || files.includes(KEY_PATH);
  const inventory=JSON.parse(readFileSync('docs/LESSON_INVENTORY.json','utf8')).items;
  const candidates=changedPaths(inventory,readOld(before),files);
  if(!bootstrap && !candidates.length) {
    console.log('No new or changed public pages to submit.');
    return;
  }
  console.log(bootstrap ? 'Initial production sitemap bootstrap.' : 'Changed page paths: ' + candidates.length);
  if(process.argv.includes('--dry-run')) { console.log(JSON.stringify({bootstrap,candidates},null,2));return; }
  await waitForProduction(sha);
  if((await (await get(SITE + '/' + key + '.txt')).text()).trim() !== key)
    throw Error('Production IndexNow ownership key mismatch.');
  const sitemap=await sitemapUrls();
  const candidatesURLs=bootstrap ? [...sitemap] : candidates.map(p=>new URL(p,SITE).href);
  const verified=[];
  for(const url of candidatesURLs) {
    if(isSiteUrl(url) && sitemap.has(url) && await liveAndIndexable(url)) verified.push(url);
    else console.warn('Excluded missing, unlisted, noncanonical or noindex URL: ' + url);
  }
  const urls=[...new Set(verified)].sort();
  if(!urls.length) {console.log('No eligible URLs after live checks.');return;}
  await send(urls,key);
}
if(process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error=>{console.error(error);process.exitCode=1;});
}
