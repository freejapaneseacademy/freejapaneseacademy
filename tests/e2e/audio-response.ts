import { expect, type APIResponse } from '@playwright/test';
import { createHash } from 'node:crypto';
const originals = {
  'a': {size: 1344706, sha: 'da38bd5223c82181281514fea1b382fff872936d602affdb69830e9c7fdda703'},
  'b': {size: 992532, sha: '69ae9543c408a3f973e0dec3a495fa128c7b68e63b43aa5dfb007bb741b11d3b'},
} as const;
/** Astro's local dev server may return HTTP 200/full even for byte-range requests.
 * The production Pages audio Function must return 206; that is checked in live CI.
 * Always verify actual bytes, never treat a 200 HTML placeholder as valid audio.
 */
export async function verifyWavRangeOrFull(response: APIResponse, src: string) {
  const key = src.endsWith('-a.wav') ? 'a' : src.endsWith('-b.wav') ? 'b' : null;
  expect(key, 'Known original L06 track').not.toBeNull();
  if(!key)throw Error('Unknown audio path');
  const meta = originals[key];
  expect(response.headers()['content-type']).toMatch(/^audio\/(?:wav|wave|x-wav)/);
  const body = await response.body();
  expect(body.toString('ascii',0,4)).toBe('RIFF');
  expect(body.toString('ascii',8,12)).toBe('WAVE');
  expect(body.readUInt32LE(4)+8).toBe(meta.size);
  expect(body.readUInt32LE(24)).toBe(44100);
  if(response.status()===206) {
    expect(response.headers()['content-range']).toBe('bytes 0-43/'+meta.size);
    expect(body.length).toBe(44);
  } else {
    expect(response.status(), 'Astro local dev must serve full original WAV if not honoring range').toBe(200);
    expect(body.length).toBe(meta.size);
    expect(createHash('sha256').update(body).digest('hex')).toBe(meta.sha);
  }
}
