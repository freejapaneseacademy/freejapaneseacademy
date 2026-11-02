/* Regression guard: verify the two original complete audio recordings byte-for-byte. */
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const tracks=[
 {path:'public/audio/fja-lesson-audio-l06-a.wav',size:1344706,sha:'da38bd5223c82181281514fea1b382fff872936d602affdb69830e9c7fdda703'},
 {path:'public/audio/fja-lesson-audio-l06-b.wav',size:992532,sha:'69ae9543c408a3f973e0dec3a495fa128c7b68e63b43aa5dfb007bb741b11d3b'},
];
for (const track of tracks) {
 const b=await readFile(track.path);
 const sha=createHash('sha256').update(b).digest('hex');
 if(b.length!==track.size||sha!==track.sha||b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WAVE'||b.readUInt32LE(4)+8!==b.length||b.readUInt32LE(24)!==44100||b.readUInt16LE(22)!==1)throw Error('Original WAV corruption: '+track.path+' '+b.length+' '+sha);
 let n=0;for(let i=44;i+1<b.length;i+=2048)if(b.readInt16LE(i)!==0)n++;
 if(n<20)throw Error('Original WAV unexpectedly silent: '+track.path);
 console.log('SHA-256 verified '+track.path+' '+b.length+' bytes '+sha);
}
