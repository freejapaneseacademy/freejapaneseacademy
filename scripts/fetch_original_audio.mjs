/* One-time migration of two unchanged, verified WAVs from Cloudflare Worker to static Pages.
 * Existing originals remain in KV. Each downloaded file MUST match prior measured SHA-256.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const origin='https://fja-lesson-audio.free-japanese-academy.workers.dev';
const tracks=[
 {url:'/l0-m01-c01-l06-a.wav',file:'fja-lesson-audio-l06-a.wav',size:1344706,sha:'da38bd5223c82181281514fea1b382fff872936d602affdb69830e9c7fdda703'},
 {url:'/l0-m01-c01-l06-b.wav',file:'fja-lesson-audio-l06-b.wav',size:992532,sha:'69ae9543c408a3f973e0dec3a495fa128c7b68e63b43aa5dfb007bb741b11d3b'},
];
await mkdir('public/audio',{recursive:true});
for(const track of tracks) {
 let accepted=null,lastFailure='';
 for(let attempt=1;attempt<=12;attempt++) {
  try {
   const response=await fetch(origin+track.url,{signal:AbortSignal.timeout(25000),cache:'no-store'});
   if(response.status!==200)throw Error('HTTP '+response.status);
   const b=Buffer.from(await response.arrayBuffer());
   const hash=createHash('sha256').update(b).digest('hex');
   if(b.length!==track.size||hash!==track.sha||b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WAVE'||b.readUInt32LE(4)+8!==b.length||b.readUInt32LE(24)!==44100)throw Error('Asset integrity check failed: '+b.length+' '+hash);
   accepted=b;break;
  } catch(error) {
   lastFailure=String(error);
   console.error(track.file+' attempt '+attempt+': '+lastFailure);
   if(attempt<12)await new Promise(r=>setTimeout(r,700*attempt));
  }
 }
 if(!accepted)throw Error('FAILED to safely transfer '+track.file+' after all attempts: '+lastFailure);
 await writeFile('public/audio/'+track.file,accepted);
 console.log('Validated original audio: '+track.file+' '+accepted.length+' bytes sha256 '+track.sha);
}
console.log('Both original licensed WAVs are byte-for-byte preserved for Cloudflare Pages static publication.');
