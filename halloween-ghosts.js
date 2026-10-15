// Mansion-only, non-damaging encounters. Values are in world pixels/seconds.
(()=>{'use strict';
const tuning=Object.freeze({noticeRadius:145,loseRadius:215,leash:185,noticeTime:.4,chaseSpeed:48,returnSpeed:76,stun:.22,immunity:1.8,rest:1.3,knockSpeed:115});
let ghosts=[],time=0,stun=0,immune=0;
function reset(stage){time=stun=immune=0;ghosts=stage.theme==='halloween-mansion'?stage.platforms.flatMap((p,n)=>n%4===1?[{ox:p.x+p.w*.55,oy:p.y-90,x:p.x+p.w*.55,y:p.y-90,phase:n,mode:'idle',timer:0}]:[]):[];}
function active(){return ghosts.length&&!window.HalloweenSecrets?.inVault()&&!window.HalloweenSecrets?.isCinematic();}
function advance(dt){if(!active())return;time+=dt;stun=Math.max(0,stun-dt);immune=Math.max(0,immune-dt);}
function move(g,x,y,speed,dt){const dx=x-g.x,dy=y-g.y,d=Math.hypot(dx,dy),step=Math.min(d,speed*dt);if(d){g.x+=dx/d*step;g.y+=dy/d*step;}return d<=step+.5;}
function tick(player,dt){if(!active())return null;let hit=null;for(const g of ghosts){const px=player.x,py=player.y-25,d=Math.hypot(px-g.x,py-g.y),homeDistance=Math.hypot(px-g.ox,py-g.oy);g.timer=Math.max(0,g.timer-dt);
 if(g.mode==='idle'){g.x=g.ox;g.y=g.oy+Math.sin(time*1.7+g.phase)*9;if(!g.timer&&homeDistance<tuning.noticeRadius&&Math.abs(py-g.oy)<110){g.mode='notice';g.timer=tuning.noticeTime;}}
 else if(g.mode==='notice'){if(homeDistance>tuning.loseRadius){g.mode='return';}else if(!g.timer)g.mode='chase';}
 else if(g.mode==='chase'){if(homeDistance>tuning.leash||d>tuning.loseRadius){g.mode='return';}else move(g,px,py,tuning.chaseSpeed,dt);}
 else if(g.mode==='return'){if(move(g,g.ox,g.oy,tuning.returnSpeed,dt)){g.mode='idle';g.timer=tuning.rest;}}
 if(!immune&&!hit&&['notice','chase'].includes(g.mode)&&Math.abs(px-g.x)<27&&Math.abs(py-g.y)<28){const direction= Math.abs(player.vx)>15?Math.sign(player.vx):(player.face||1);hit={velocity:-direction*tuning.knockSpeed,duration:tuning.stun};stun=tuning.stun;immune=tuning.immunity;for(const other of ghosts){if(other.mode!=='idle')other.mode='return';}g.mode='return';}
 }return hit;}
function draw(g,camera){if(!active())return;for(const ghost of ghosts){HalloweenSecrets.ghost(g,ghost.x-camera,ghost.y);if(ghost.mode==='notice'){g.save();g.textAlign='center';g.font='bold 24px Meiryo,sans-serif';g.lineWidth=3;g.strokeStyle='#623561';g.strokeText('!',ghost.x-camera,ghost.y-34);g.fillStyle='#ffe3a2';g.fillText('!',ghost.x-camera,ghost.y-34);g.restore();}}}
window.HalloweenGhosts={reset,advance,tick,draw,locked:()=>!!active()&&stun>0,state:()=>({ghosts:ghosts.map(g=>({...g})),stun,immune}),tuning};
})();
