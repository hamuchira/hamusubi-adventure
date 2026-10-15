// Course-only mechanics and rendering. Gacha draws/animations are not modified.
(()=>{'use strict';
const C=HALLOWEEN_COURSE_CONFIG;let run=null;
function active(e){return !!e?.developmentOnly&&(C.preview||(C.enabled&&C.startsAt&&C.endsAt&&Date.now()>=Date.parse(C.startsAt)&&Date.now()<Date.parse(C.endsAt)))}
function reset(stage){HalloweenSecrets.reset(stage);HalloweenGhosts.reset(stage);run=stage.halloween?{stage,candies:stage.candies.map(c=>({...c,taken:false})),unlocked:false,celebrate:0,ticketToast:0,visited:false,roomHint:false}:null}
function tick(stage,player,oldX,oldY,dt,notify,fx,view){if(!stage.halloween||!run)return;HalloweenSecrets.advance(dt);HalloweenSecrets.constrain(player);if(HalloweenSecrets.inVault()){run.ticketToast=Math.max(0,run.ticketToast-dt);return;}run.celebrate=Math.max(0,run.celebrate-dt);run.ticketToast=Math.max(0,run.ticketToast-dt);const room=stage.secretRoom;
 for(const c of run.candies)if(!c.taken&&Math.abs(player.x-c.x)<31&&Math.abs(player.y-25-c.y)<36){c.taken=true;fx();const n=run.candies.filter(c=>c.taken).length;if(n===3){run.unlocked=true;HalloweenSecrets.unlock(view);window.HalloweenMissions?.trick(EventSystem.current?.eventId)}else notify('キャンディ '+n+' / 3 を見つけた！')}
 const inside=player.x+14>room.x&&player.x-14<room.x+room.w&&player.y>room.y&&player.y-45<room.floor;
 if(inside&&!run.unlocked){// Resolve only the blocked axis; restoring both coordinates can suspend the player in midair.
const sides=[
 {side:'top',distance:player.y-room.y},
 {side:'bottom',distance:room.floor-(player.y-45)},
 {side:'left',distance:player.x+14-room.x},
 {side:'right',distance:room.x+room.w-(player.x-14)}
];
const side=oldY<=room.y?'top':oldY-45>=room.floor?'bottom':oldX+14<=room.x?'left':oldX-14>=room.x+room.w?'right':sides.sort((a,b)=>a.distance-b.distance)[0].side;
if(side==='top'){player.y=room.y;player.vy=0;player.on=true;player.airJumpAvailable=true}
else if(side==='bottom'){player.y=room.floor+45;player.vy=Math.max(0,player.vy)}
else{player.x=side==='left'?room.x-14:room.x+room.w+14;player.vx=0}
if(!run.roomHint){run.roomHint=true;notify('キャンディ3個で開く秘密の扉')}}
 if(inside&&run.unlocked)run.visited=true;
}
function fallBoundary(stage,x,lastFloor){if(HalloweenSecrets.inVault())return stage.vault.floor+200;const nearby=[...stage.platforms,...stage.extras].filter(p=>x>p.x-160&&x<p.x+p.w+160);return nearby.length?Math.max(...nearby.map(p=>p.y))+200:lastFloor+360}
function grantTicket(chest){if(!chest.ticketPending||chest.ticketCredited)return false;try{EventSystem.transact(data=>{data.gacha||={};const w=data.gacha.halloween2026||={tickets:0,fragments:0,draws:0,lastResult:null};if(!Number.isSafeInteger(w.tickets)||w.tickets<0)throw Error('Invalid wallet');w.tickets++;});chest.ticketCredited=true;chest.ticketPending=false;if(run){run.ticketToast=4;HalloweenSecrets.ticketFound(chest)}return true}catch{return false}}
const fill=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
function oval(g,x,y,rx,ry,c){g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill()}
function label(g,s,x,y,size=14,c='#ffeec6'){g.fillStyle=c;g.font='bold '+size+'px Meiryo,sans-serif';g.textAlign='center';g.fillText(s,x,y);g.textAlign='left'}
function pumpkin(g,x,y,w,h){oval(g,x+w/2,y+h*.52,w/2,h*.5,'#a84d2a');for(let i=0;i<5;i++)oval(g,x+w*(.18+i*.16),y+h*.48,w*.17,h*.47,['#df772d','#ef963e','#ffb74e','#e88432','#c76829'][i]);fill(g,x+w*.48,y-6,w*.06,12,'#697143');g.fillStyle='#fff0a1';for(const f of [.32,.65]){g.beginPath();g.moveTo(x+w*f,y+h*.28);g.lineTo(x+w*(f-.09),y+h*.48);g.lineTo(x+w*(f+.07),y+h*.47);g.fill()}g.beginPath();g.ellipse(x+w*.5,y+h*.6,w*.2,h*.17,0,0,Math.PI);g.fill()}
function ground(g,p,camera,stage){if(!stage.halloween)return false;const x=p.x-camera,y=p.y;if(x+p.w<0||x>g.canvas.width)return true;g.save();switch(p.kind){
 case 'pumpkin':pumpkin(g,x,y,p.w,Math.min(95,p.w*.45));fill(g,x+5,y,p.w-10,5,'#f4c276');break;
 case 'crate':fill(g,x,y,p.w,70,'#754936');fill(g,x+5,y+5,p.w-10,60,'#ad7849');for(let a=0;a<p.w;a+=50){fill(g,x+a,y,5,70,'#e6b56e');g.strokeStyle='#754936';g.lineWidth=5;g.beginPath();g.moveTo(x+a+7,y+8);g.lineTo(x+Math.min(a+45,p.w-5),y+62);g.stroke()}fill(g,x,y,p.w,7,'#e2b16d');break;
 case 'books':fill(g,x,y,p.w,110,'#382635');for(let row=0;row<2;row++){for(let a=8;a<p.w-12;a+=14){fill(g,x+a,y+14+row*46,10,31+(a%3)*3,['#83646c','#637268','#826796','#ba825c'][Math.floor(a/14)%4]);fill(g,x+a+2,y+19+row*46,6,2,'#d3bc89')}fill(g,x+3,y+49+row*46,p.w-6,6,'#95643e')}fill(g,x,y,p.w,8,'#d4a777');break;
 case 'wood':fill(g,x,y,p.w,24,'#533549');fill(g,x,y,p.w,7,'#c58b5d');for(let a=10;a<p.w;a+=60)fill(g,x+a,y+8,2,13,'#a66c52');break;
 case 'cloud':HalloweenSecrets.cloud(g,p,x,y);break;
 case 'broom':HalloweenSecrets.broom(g,p,x,y);break;
 case 'vault-floor':break;
 case 'island':g.fillStyle='#514260';g.beginPath();g.moveTo(x,y);g.lineTo(x+p.w,y);g.lineTo(x+p.w*.8,y+42);g.lineTo(x+p.w*.56,y+77);g.lineTo(x+p.w*.36,y+49);g.lineTo(x+12,y+29);g.fill();fill(g,x,y,p.w,8,'#8f9077');fill(g,x+4,y,p.w-8,3,'#d7c69b');break;
 default:fill(g,x,y,p.w,65,'#68402f');fill(g,x,y,p.w,9,'#b78349');fill(g,x+3,y,p.w-6,4,'#e1ac61');for(let a=12;a<p.w;a+=33){fill(g,x+a,y+20,16,7,'#875532');fill(g,x+a+10,y+42,13,6,'#4e322c')}break;
 }g.restore();return true}
function candle(g,x,y){fill(g,x-3,y-23,6,23,'#f1d49b');oval(g,x,y-29,4,7,'#ffdb80');oval(g,x,y-29,2,4,'#fff9de')}
function scenery(g,stage,camera,time){if(!stage.halloween)return;if(HalloweenSecrets.vaultScenery(g,camera))return;g.save();
 for(const [n,p] of stage.platforms.entries()){const x=p.x-camera;if(x+p.w<0||x>g.canvas.width)continue;
 if(stage.theme==='halloween-pumpkin'&&p.kind==='soil'){for(let a=32;a<Math.min(p.w-35,230);a+=58){fill(g,x+a,p.y-35,6,35,'#815637');fill(g,x+a-18,p.y-27,50,5,'#bd915a')}if(n%2===0)pumpkin(g,x+p.w-69,p.y-37,48,37);if(n%3===0){fill(g,x+24,p.y-75,4,75,'#694232');fill(g,x+20,p.y-57,16,22,'#75543e');fill(g,x+23,p.y-53,10,14,'#ffd283')}}
 if(stage.theme==='halloween-mansion'){if(n%2===0)candle(g,x+p.w-30,p.y);}
 if(stage.theme==='halloween-witch'&&n%3===1){g.strokeStyle='#ceb0ef99';g.lineWidth=2;g.beginPath();g.ellipse(x+p.w/2,p.y-7,27,7,0,0,Math.PI*2);g.stroke();label(g,'✧',x+p.w/2,p.y-31,20,'#f1d5ff')}
 }

 HalloweenGhosts.draw(g,camera);
 const r=stage.secretRoom,x=r.x-camera,sky=stage.theme==='halloween-witch',field=stage.theme==='halloween-pumpkin';
 if(field){for(const e of stage.extras.filter(e=>e.y>=500&&e.x!==r.x)){const ex=e.x-camera;const wall=g.createLinearGradient(0,e.y-110,0,e.y);wall.addColorStop(0,'#37243bee');wall.addColorStop(1,'#6c423ae6');g.fillStyle=wall;g.fillRect(ex,e.y-110,e.w,110);fill(g,ex,e.y-110,e.w,12,'#785037');for(let a=20;a<e.w;a+=70){fill(g,ex+a,e.y-101,4,18,'#9f7444');label(g,'✦',ex+a,e.y-45,12,'#eeb86e')}}}
 if(sky){const halo=g.createRadialGradient(x+r.w/2,r.y+r.h*.55,20,x+r.w/2,r.y+r.h*.55,r.w*.65);halo.addColorStop(0,'#bd8cef77');halo.addColorStop(1,'#6646a000');g.fillStyle=halo;g.fillRect(x-50,r.y-50,r.w+100,r.h+100);for(let a=15;a<r.w;a+=32){oval(g,x+a,r.y+12,28,15,'#8e78b5');oval(g,x+a,r.y+6,25,12,'#cfb5ef')}g.strokeStyle='#e0c2ff';g.lineWidth=2;g.beginPath();g.ellipse(x+r.w*.62,r.floor-7,85,17,0,0,Math.PI*2);g.stroke();for(let i=0;i<7;i++)label(g,'✧',x+80+i*46,r.y+45+(i%2)*22,17,'#f4d49e')}
 else {const wall=g.createLinearGradient(0,r.y,0,r.floor);wall.addColorStop(0,field?'#40293d':'#2e2136');wall.addColorStop(1,field?'#76503e':'#5a3945');g.fillStyle=wall;g.fillRect(x,r.y,r.w,r.h);fill(g,x,r.y,r.w,9,field?'#9b7048':'#b38758');fill(g,x,r.floor-5,r.w,5,'#9e7651');if(field){for(let a=30;a<r.w;a+=77){fill(g,x+a,r.y+28,27,8,'#593537');fill(g,x+a+20,r.y+65,22,9,'#593537')}pumpkin(g,x+r.w-66,r.floor-47,50,45)}else{for(let a=95;a<r.w-80;a+=45){fill(g,x+a,r.y+35,26,57,'#765062');fill(g,x+a+3,r.y+43,20,3,'#b58a6c')}fill(g,x+85,r.y+94,r.w-170,5,'#c39466')}for(let a=95;a<r.w-50;a+=130)candle(g,x+a,r.floor-4)}
 if(run?.unlocked)label(g,r.name,x+r.w/2,r.y+29,14);
 g.restore()}
function foreground(g,stage,camera,player,time){if(!stage.halloween||!run||HalloweenSecrets.inVault())return;g.save();for(const c of run.candies)if(!c.taken){const x=c.x-camera,y=c.y+Math.sin(time*3)*3;g.fillStyle='#b879df';for(const d of [-1,1]){g.beginPath();g.moveTo(x+d*10,y);g.lineTo(x+d*24,y-10);g.lineTo(x+d*24,y+10);g.closePath();g.fill()}oval(g,x,y,14,11,'#f7b4e6');g.strokeStyle='#9957bb';g.lineWidth=3;g.beginPath();g.moveTo(x-4,y-8);g.lineTo(x+5,y+8);g.stroke();label(g,'✦',x+24,y-14,12,'#ffe6a2')}
 for(const c of stage.concealed){if(c.x===stage.secretRoom.x)continue;const near=player.x>c.x-65&&player.x<c.x+c.w+65&&player.y>c.y-55&&player.y<c.y+c.h+65;g.globalAlpha=near?.14:.92;fill(g,c.x-camera,c.y,c.w,c.h,'#442d39');for(let a=12;a<c.w;a+=18)fill(g,c.x-camera+a,c.y+9,11,c.h-22,['#987853','#73556e','#787251'][Math.floor(a/18)%3]);g.globalAlpha=1;label(g,'✧',c.x-camera+18,c.y+c.h-10,16,'#ffdb8f')}
 HalloweenSecrets.entrance(g,stage,camera,pumpkin);g.restore()}
function hud(g,stage,W,H,camera){if(!stage.halloween||!run)return;g.save();fill(g,(W-960)/2+615,83,145,30,'#48304aea');label(g,'キャンディ '+run.candies.filter(c=>c.taken).length+' / 3  '+(run.unlocked?'🔓':'🍬'),(W-960)/2+687,103,14,'#ffe0ee');if(run.ticketToast>0){fill(g,(W-960)/2+615,118,145,27,'#f8deb9');HalloweenSecrets.ticketIcon(g,(W-960)/2+640,132,38);label(g,'ガチャ券 +1',(W-960)/2+707,137,13,'#673950')}HalloweenSecrets.overlay(g,stage,W,H,camera);g.restore()}
function decorateEvent(body){if(!active(HALLOWEEN_COURSES[0]))return;const section=document.createElement('section');section.className='hw-courses';const h=document.createElement('h3');h.textContent='ハロウィンの3つの冒険';section.append(h);const period=document.createElement('p');period.textContent=C.period;section.append(period);const note=document.createElement('p');note.textContent='キャンディ3個で秘密の扉が開く！ 宝箱から追加でガチャ券が出る確率は10%。';section.append(note);const grid=document.createElement('div');grid.className='hw-course-grid';for(const [n,e] of HALLOWEEN_COURSES.entries()){const b=document.createElement('button');b.className='hw-course-card';b.dataset.course=e.eventId;const img=document.createElement('img');img.src=e.background;img.alt='';const strong=document.createElement('strong');strong.textContent=(n+1)+'. '+e.name;const desc=document.createElement('span');desc.textContent=['かぼちゃの足場と地下の寄り道 · やさしめ','動く本棚と壁の奥を探索 · ふつう','ほうきと浮島を乗り継ぐ · アクション'][n];const rec=EventSystem.record(e.eventId);const status=document.createElement('small');status.textContent=rec.clears?'CLEAR!　ベスト '+rec.bestScore+'点':'🍬 3個を探そう';b.append(img,strong,desc,status);b.onclick=()=>{HalloweenGacha.close();HomeUpgrade.close();HomeGame.beginEvent(e.eventId)};grid.append(b)}section.append(grid);body.prepend(section);window.HalloweenMissions?.render(body)}
window.HalloweenCourses={fallBoundary,active,reset,tick,ground,scenery,foreground,hud,grantTicket,decorateEvent,state:()=>run?{candies:run.candies.map(c=>({...c})),unlocked:run.unlocked,visited:run.visited,secrets:HalloweenSecrets.state()}:null};
if(C.preview){const launch=()=>{if(!window.HalloweenGacha||!document.querySelector('#loading')?.hidden){requestAnimationFrame(launch);return}HalloweenGacha.showEvent()};requestAnimationFrame(launch)}
})();
