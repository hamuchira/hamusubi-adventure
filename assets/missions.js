// Persistent additions live beside the original journey save, never replacing it.
(()=>{'use strict';
const KEY='hamusubi.missions.v1';
const definitions=[
{id:'clears',name:'何度でも、おでかけ',goal:50,reward:'新コース解放「たからもののへや」'},
{id:'score',name:'スコアの達人',goal:4000,reward:'主人公の毛色変更'},
{id:'collection',name:'ハムケツコレクター',goal:20,reward:'お花の推しケツ棚'},
{id:'favorites',name:'推しケツ棚',goal:10,reward:'回し車デザイン'},
{id:'gold',name:'金のはむすび',goal:10,reward:'新コース解放「海とネモフィラ」'},
{id:'rainbow',name:'虹のはむすび',goal:1,reward:'虹の推しケツ棚'},
{id:'chests',name:'宝箱',goal:30,reward:'おうちデザイン'},
{id:'recovered',name:'鍵どろぼう',goal:5,reward:'新コース解放「ほたると天の川」'}];
const fresh=()=>({counts:{gold:0,rainbow:0,chests:0,recovered:0,outings:0,keys:0,bonusClears:0,bonusBest:0},recoveryCredits:{},unlocks:[],seen:[],selected:{fur:'original',shelf:'wood',wheel:'wood',house:'wood'},outings:{},extraUnlocked:false,notifications:{customSeen:[],adventureSeen:[],played:[]}});let data=fresh();try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw){for(const k in data.counts)data.counts[k]=Math.max(0,Number(raw.counts?.[k])||0);data.unlocks=definitions.map(d=>d.id).filter(id=>raw.unlocks?.includes(id));data.seen=data.unlocks.filter(id=>raw.seen?.includes(id));Object.assign(data.selected,raw.selected||{});data.outings=raw.outings||{};data.recoveryCredits=raw.recoveryCredits&&typeof raw.recoveryCredits==='object'&&!Array.isArray(raw.recoveryCredits)?raw.recoveryCredits:{};data.extraUnlocked=raw.extraUnlocked===true}}catch{}
for(const k of ['customSeen','adventureSeen','played']){try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');data.notifications[k]=Array.isArray(raw?.notifications?.[k])?raw.notifications[k].filter(x=>typeof x==='string'):[]}catch{}}
for(const [id,r]of Object.entries(data.outings))if(r.clears>0&&!data.notifications.played.includes('outing-'+id))data.notifications.played.push('outing-'+id);if(data.counts.bonusClears>0&&!data.notifications.played.includes('treasure'))data.notifications.played.push('treasure');
const queue=[],listeners=[];function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}
function value(id){const p=Journey.progress;return id==='clears'?p.clearCounts.reduce((a,b)=>a+b,0)+data.counts.outings:id==='score'?Math.max(0,...p.topScores.flat()):id==='collection'?p.collection.length:id==='favorites'?p.favorites.length:data.counts[id]||0}
function check(){let change=false;for(const d of definitions)if(!data.unlocks.includes(d.id)&&value(d.id)>=d.goal){data.unlocks.push(d.id);queue.push('ミッション達成！ '+d.reward+'を解放！');listeners.forEach(fn=>fn(d));change=true}if(Journey.progress.ending&&!data.extraUnlocked){data.extraUnlocked=true;queue.push('あたらしいおでかけ先が増えたよ！ 桜とひまわりへ。');change=true}if(change)save();return change}
window.Missions={near:id=>!data.unlocks.includes(id)&&value(id)>0&&value(id)>=definitions.find(d=>d.id===id).goal*.8,customRewards:()=>data.unlocks.filter(id=>['score','favorites','collection','rainbow','chests'].includes(id)),destinations:()=>[...Outings.stages.filter(s=>Outings.unlocked(s.outing)).map(s=>'outing-'+s.outing),...(Journey.bonusAvailable?['treasure']:[])],markNotice(kind,ids){data.notifications[kind]=[...new Set([...data.notifications[kind],...ids])];save()},unplayed:id=>!data.notifications.played.includes(id),definitions,creditRecovery(id,cycle){if(!id||!Number.isInteger(cycle)||data.recoveryCredits[id]===cycle)return false;data.recoveryCredits[id]=cycle;data.counts.recovered++;check();save();return true},onAchieved(fn){listeners.push(fn)},unseen:()=>data.unlocks.filter(id=>!data.seen.includes(id)),markSeen(){data.seen=[...data.unlocks];save()},get data(){return data},value,check,save,queue,has:id=>data.unlocks.includes(id),add(id,n=1){if(id in data.counts){data.counts[id]+=n;check();save()}},select(k,v){data.selected[k]=v;save()},recordOuting(id,count){const s=data.outings[id]||{clears:0,top:[]};s.best=Math.max(s.best||(s.clears>0?10:0),count);data.outings[id]=s;save()},clearOuting(id,score,count=10){const s=data.outings[id]||{clears:0,top:[]};s.best=Math.max(s.best||(s.clears>0?10:0),count);s.clears++;s.top.push(score);s.top.sort((a,b)=>b-a);s.top=s.top.slice(0,3);data.outings[id]=s;data.counts.outings++;Journey.progress.totalScore+=Math.max(0,Math.floor(Number(score)||0));Journey.save();check();save()},reset(){data=fresh();save()},KEY};
const oldSave=Journey.save;Journey.save=function(){const result=oldSave();check();return result};
Object.defineProperty(Journey,'bonusAvailable',{get:()=>data.unlocks.includes('clears')});Journey.claimBonus=()=>Journey.bonusAvailable;
const oldBonus=Journey.clearBonus;Journey.clearBonus=function(score){oldBonus(score);Missions.add('bonusClears');Missions.add('outings')};const oldKey=Journey.addKey;Journey.addKey=function(){oldKey();Missions.add('keys')};
check();
})();

