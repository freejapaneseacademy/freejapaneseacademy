import { expect, type APIResponse } from '@playwright/test';
import { createHash } from 'node:crypto';
import listening from '../../src/content/audio/l0-m01-c01-l06.json';

const originals = {
  'fja-lesson-audio-l06-a.wav': { size: 1344706, sha: 'da38bd5223c82181281514fea1b382fff872936d602affdb69830e9c7fdda703' },
  'fja-lesson-audio-l06-b.wav': { size: 992532, sha: '69ae9543c408a3f973e0dec3a495fa128c7b68e63b43aa5dfb007bb741b11d3b' }
};
const current = Object.fromEntries(listening.assets.map(track => [
  track.mediaPath.split('/').at(-1)!, { size: track.qa.bytes, sha: track.qa.sha256 }
]));
const known: Record<string, {size: number;sha:string}> = { ...originals, ...current };

/** In local Astro dev, a valid WAV range request may return full 200 instead of 206.
 * Verify the exact whole WAV's pinned hash; never accept an HTML fallback.
 */
export async function verifyWavRangeOrFull(response: APIResponse, src: string) {
  const filename = new URL(src).pathname.split('/').at(-1) ?? '';
  const meta=known[filename];
  expect(meta, 'Known and pinned L06 dialogue or archived L08 speaking WAV').toBeDefined();
  if(!meta)throw Error('Unrecognized audio asset path');
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
    expect(response.status(), 'Astro dev may serve a full WAV to range requests').toBe(200);
    expect(body.length).toBe(meta.size);
    expect(createHash('sha256').update(body).digest('hex')).toBe(meta.sha);
  }
}
