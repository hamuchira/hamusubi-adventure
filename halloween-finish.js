(()=>{'use strict';
const E=EventSystem,ID='halloween2026',ids=HALLOWEEN_COURSES.map(e=>e.eventId);
const definitions=[
 {id:'courses',name:'ハロウィン3コースをすべてクリア',target:3,tickets:1,value:(d,s)=>ids.filter(id=>d.records[id]?.clears>0).length},
 {id:'tricks',name:'3コースすべてでTRICK OR TREATを発生させる',target:3,tickets:2,value:(d,s)=>ids.filter(id=>s.tricks[id]).length},
 {id:'score',name:'ハロウィンコースでベストスコア5000点以上',target:5000,tickets:1,value:(d,s)=>Math.max(0,...ids.map(id=>d.records[id]?.bestScore||0))},
 {id:'chests',name:'ハロウィンコースで宝箱を累計20個開ける',target:20,tickets:1,value:(d,s)=>s.chests},
 {id:'clears',name:'ハロウィンコースを累計10回クリア',target:10,tickets:1,value:(d,s)=>ids.reduce((n,id)=>n+(d.records[id]?.clears||0),0)}
];
function state(d){d.campaignStats||={};const c=d.campaignStats[ID]||={};return c.missions||={tricks:{},chests:0,awarded:{}}}
function evaluate(d){const s=state(d),awards=[];for(const m of definitions)if(!s.awarded[m.id]&&m.value(d,s)>=m.target){s.awarded[m.id]=true;awards.push(m)}if(definitions.every(m=>s.awarded[m.id])&&!s.awarded.all){s.awarded.all=true;awards.push({name:'ハロウィン全ミッション達成',tickets:2})}if(awards.length){d.gacha||={};const w=d.gacha[ID]||={tickets:0,fragments:0,draws:0,lastResult:null};w.tickets+=awards.reduce((n,m)=>n+m.tickets,0)}return awards}
function commit(change){try{const awards=E.transact(d=>{change?.(state(d));return evaluate(d)});if(awards.length)HomeGame.notice('ハロウィンミッション達成！ ガチャ券 +'+awards.reduce((n,m)=>n+m.tickets,0));refresh();return true}catch{HomeGame.notice('ミッションを保存できませんでした。保存先の空き容量を確認してください。');return false}}
function check(){const d=JSON.parse(JSON.stringify(E.data));if(evaluate(d).length)commit()}
function trick(id){if(ids.includes(id))commit(s=>{s.tricks[id]=true})}
function chest(){if(E.current?.campaignId===ID)commit(s=>{s.chests++})}
function render(body){check();const s=state(E.data),section=document.createElement('section');section.className='hw-missions';const h=document.createElement('h3');h.textContent='🎃 ハロウィンミッション';section.append(h);for(const m of [...definitions,{id:'all',name:'全ミッション達成',target:5,tickets:2,value:()=>definitions.filter(m=>s.awarded[m.id]).length}]){const row=document.createElement('div');row.className='hw-mission'+(s.awarded[m.id]?' complete':'');const name=document.createElement('strong');name.textContent=m.name;const progress=document.createElement('span');progress.textContent=s.awarded[m.id]?'✓ 達成・受取済み':Math.min(m.target,m.value(E.data,s))+' / '+m.target;const reward=document.createElement('small');reward.textContent='ガチャ券 '+m.tickets+'枚';row.append(name,progress,reward);section.append(row)}body.append(section)}
function available(){return !!HALLOWEEN_COURSES[0]&&HalloweenCourses.active(HALLOWEEN_COURSES[0])}
const banner=document.createElement('button');banner.id='halloween-home-gacha';banner.type='button';banner.hidden=true;banner.onclick=()=>{HomeGame.audio();HalloweenGacha.show()};document.querySelector('#home-screen').append(banner);
function refresh(){banner.hidden=!available();banner.textContent='🎃 ハロウィンガチャ　🎟 '+(E.data.gacha?.[ID]?.tickets||0)+'枚'}
window.HalloweenMissions={check,trick,chest,render,available,definitions};
setInterval(refresh,500);refresh();
})();
