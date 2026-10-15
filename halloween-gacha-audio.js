(()=>{'use strict';
const C=HALLOWEEN_GACHA_AUDIO_CONFIG,buffers=new Map(),pending=new Map(),effects=new Set();
let ctx,musicGain,seGain,music=null,operation=null,entered=false,animation=false,pendingResult=false,allowed=true,revision=0,run=0,fired=new Set(),lastEnabled=null,lastLevel=null;
async function load(path){if(buffers.has(path))return buffers.get(path);if(!pending.has(path))pending.set(path,(async()=>{const res=await fetch(path);if(!res.ok)throw Error('Audio '+res.status);const buffer=await ctx.decodeAudioData(await res.arrayBuffer());buffers.set(path,buffer);return buffer})().finally(()=>pending.delete(path)));return pending.get(path)}
function gain(param,value,seconds=.2){const now=ctx.currentTime;param.cancelScheduledValues(now);param.setValueAtTime(param.value,now);param.linearRampToValueAtTime(value,now+seconds)}
function setup(){HomeGame.audio();ctx=HamusubiBGM.context;if(!ctx||musicGain)return;musicGain=ctx.createGain();seGain=ctx.createGain();musicGain.gain.value=C.bgmVolume;seGain.gain.value=C.seVolume;musicGain.connect(ctx.destination);seGain.connect(ctx.destination)}
function sync(enabled=HamusubiBGM.enabled){allowed=enabled&&!document.hidden;if(!musicGain)return;const audible=entered&&allowed;if(lastEnabled!==audible){lastEnabled=audible;gain(seGain.gain,audible?C.seVolume:0,.025);if(!audible)stopEffects()}const level=audible?C.bgmVolume:0;if(level!==lastLevel){lastLevel=level;gain(musicGain.gain,level,.2)}}
function enter(){if(entered){sync();return}entered=true;const token=++revision;HamusubiBGM.setExclusive(true);setup();sync();load(C.bgm).then(buffer=>{if(!entered||token!==revision)return;music=ctx.createBufferSource();music.buffer=buffer;music.loop=true;music.connect(musicGain);music.onended=()=>{};music.start()}).catch(e=>console.warn('Gacha BGM unavailable',e.message));for(const effect of Object.values(C.effects))load(effect.file).catch(e=>console.warn('Gacha SE unavailable',e.message))}
function stopVoice(voice){if(!voice)return;try{voice.stop()}catch{}effects.delete(voice);if(operation===voice)operation=null}
function stopEffects(){for(const voice of [...effects])stopVoice(voice)}
function end(){animation=false;run++;stopEffects();sync()}
function leave(){if(!entered)return;entered=false;pendingResult=false;revision++;end();if(music){music.stop();music.disconnect();music=null}HamusubiBGM.setExclusive(false);HomeGame.audio()}
function begin(){if(!entered)enter();end();animation=true;pendingResult=true;fired=new Set();sync()}
function effect(name,loop=false){if(!entered||!allowed||!ctx)return;const def=C.effects[name],buffer=buffers.get(def.file);if(!buffer)return;const voice=ctx.createBufferSource(),level=ctx.createGain();voice.buffer=buffer;voice.loop=loop;level.gain.value=def.volume;voice.connect(level).connect(seGain);effects.add(voice);voice.onended=()=>{effects.delete(voice);if(operation===voice)operation=null;voice.disconnect();level.disconnect()};voice.start();if(loop)operation=voice}
function once(name){if(fired.has(name))return;fired.add(name);effect(name)}
function tick(clip,time,playing){if(!animation)return;sync();if(clip==='machine'){if(playing&&allowed&&time>=C.cues.operationStart&&time<C.cues.operationEnd){if(!operation)effect('operation',true)}else stopVoice(operation);if(time>=C.cues.capsule)once('capsule')}else{stopVoice(operation);if(time>=C.cues.opening)once('opening')}}
function reveal(){if(!pendingResult)return;pendingResult=false;stopVoice(operation);once('reward');sync()}
// On user gesture, resume the shared context without restarting the loop.
document.addEventListener('pointerdown',()=>{if(entered&&ctx?.state==='suspended')ctx.resume().catch(()=>{})},{capture:true});
document.addEventListener('visibilitychange',()=>sync());window.addEventListener('pagehide',leave);
window.HalloweenGachaAudio={enter,leave,begin,end,tick,reveal,sync,state:()=>({entered,animation,allowed,musicPlaying:!!music,bgmLevel:lastLevel,activeEffects:effects.size,fired:[...fired]})};
})();
