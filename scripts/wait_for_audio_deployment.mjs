/* Wait for every versioned WAV to appear on production before strict HTTP probes. */
import { readFile, readdir } from 'node:fs/promises';
const base='https://free-japanese-academy.pages.dev';
const paths=new Set([
 '/audio/fja-l06-real-dialogue-a-v2.wav','/audio/fja-l06-real-dialogue-b-v2.wav',
 '/audio/fja-lesson-audio-l06-a.wav','/audio/fja-lesson-audio-l06-b.wav'
]);
for(const name of (await readdir(new URL('../src/content/audio/',import.meta.url)))
 .filter(x=>/^(?:l0|n[1-5])-m[0-9]{2}-c[0-9]{2}-l06-v[1-9][0-9]*[.]json$/.test(x))){
 const m=JSON.parse(await readFile(new URL('../src/content/audio/'+name,import.meta.url),'utf8'));
 for(const asset of m.assets)paths.add(asset.mediaPath);
}
for(let attempt=1;attempt<=36;attempt++){
 const pending=[];
 for(const path of paths){
  try{
   const res=await fetch(base+path,{method:'HEAD',cache:'no-store',signal:AbortSignal.timeout(12000)});
   if(res.status!==200)pending.push(path+': HTTP '+res.status);
  }catch(error){pending.push(path+': '+String(error));}
 }
 if(!pending.length){console.log('All '+paths.size+' WAVs are live on Cloudflare Pages');process.exit(0);}
 console.log('Production deployment not ready, attempt '+attempt+' of 36: '+pending.join('; '));
 if(attempt<36)await new Promise(resolve=>setTimeout(resolve,10000));
}
throw Error('New production audio was never deployed: waiting expired');
