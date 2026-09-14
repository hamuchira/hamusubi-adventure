// Optional score routes: the safe ten and the treasure detours are different choices.
(()=>{'use strict';
Journey.stages.forEach((s,id)=>{
 const p=s.platforms,ex=s.extras,last=p.at(-1);const endP=p.at(id%2?-3:-2);
 s.seeds[s.seeds.length-1]=[endP.x+endP.w*[.32,.66,.45,.72,.5,.28,.64,.4,.75,.55][id],endP.y-([2,4,8].includes(id)?65:34)];
 // Supply a forgiving ordinary route; optional upper branches retain their reward.
 const goal=s.end-145,pool=p.slice(0,-1).flatMap(a=>[.26,.76].map(f=>[a.x+a.w*f,a.y-34]));
 for(const seed of pool){if(s.seeds.length>=13)break;if(Math.abs(seed[0]-goal)>180&&!s.seeds.some(i=>Math.abs(i[0]-seed[0])<100&&Math.abs(i[1]-seed[1])<70))s.seeds.push(seed)}
 let rare=[];
 if(id===0){const a=p[2];ex.push({x:a.x+370,y:a.y-70,w:130,oneWay:true},{x:a.x+170,y:a.y-140,w:130,oneWay:true});rare=[[a.x+230,a.y-174],[p[8].x+p[8].w*.5,p[8].y-78]]}
 if(id===1){rare=[[1150,251],[1470,431]];}
 if(id===2){rare=[[p[11].x+140,p[11].y-34],[p[7].x+50,p[7].y-70]]}
 if(id===3){const a=p[6];rare=[[a.x+470,211],[p[4].x+p[4].w-35,p[4].y-64]]}
 if(id===4){rare=[[p[3].x+32,p[3].y-65],[p[8].x+32,p[8].y-68]]}
 if(id===5){const movers=ex.filter(a=>a.moving);rare=movers.slice(1).map(a=>[a.baseX+a.w*.5,a.y-65])}
 if(id===6){rare=[[1610,296],[1110,421]];const a=ex.find(a=>a.moving&&a.w===80);if(a)rare.push([a.baseX+40,a.y-60])}
 if(id===7){const a=p[6];rare=[[a.x+255,a.y-104],[p[5].x+55,p[5].y-70]]}
 if(id===8){rare=[[p[2].x+30,p[2].y-60],[p[12].x+35,p[12].y-60]]}
 if(id===9){rare=[[p[5].x+294,p[5].y-109],[p[4].x+65,p[4].y-65]];const a=ex.filter(a=>a.moving)[1];rare.push([a.baseX+a.w*.5,a.y-60])}
 s.seeds.push(...rare.map(([x,y])=>[x,y,'sparkle']));
 // No collectible sits under the goal flag, including optional additions.
 s.seeds=s.seeds.map(([x,y,...rest])=>[x<180?180:x,y,...rest]);
 s.seeds=s.seeds.filter(([x])=>Math.abs(x-goal)>100);
 s.tip+='　10こ以上でゴール。たくさん あつめて 高得点！';
});
const ps=Array.from({length:7},(_,j)=>({x:j*560,y:j%2?445:420,w:560}));
Journey.bonusStage={id:10,name:'たからもののへや',tip:'BONUS STAGE！ ボーナスかぎ3こ。赤い旗で帰れるよ！',hunger:true,end:3920,goalY:420,platforms:ps,extras:Array.from({length:6},(_,j)=>({x:300+j*540,y:350,w:260,oneWay:true})),seeds:Array.from({length:13},(_,j)=>[150+j*275,ps[Math.min(6,Math.floor((150+j*275)/560))].y-34]),checkpoints:[],rivalPlatforms:[],routeHints:[]};
})();
