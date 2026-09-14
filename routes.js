// Hand-authored course silhouettes. No shared ascend-and-return template.
(()=>{'use strict';
const courses=[
// 1: broad meadow, gentle steps, a small fork, then short islands.
{route:[[650,445,45],[400,400,60],[520,435,0],[360,385,55],[460,345,65],[500,420,0],[380,420,65,'bridge'],[240,445,80],[180,410,80],[360,450,55],[550,415,0],[720,415,0]],rice:[0,1,2,3,4,5,6,8,9,11],extra:[[1300,370,160]],swap:{2:[1380,338]}},
// 2: two parallel flower paths, a shared garden, then a different island exit.
{route:[[520,445,40],[1500,465,65],[440,405,0],[340,405,70,'bridge'],[220,440,80],[190,395,70],[580,430,65],[400,375,50],[690,415,0]],rice:[0,1,2,3,4,5,6,7,8],extra:[[650,405,160],[840,345,160],[1030,285,220],[1320,325,220],[1600,385,210]],custom:[[330,411],[1100,251],[1420,291],[1830,431],[2280,371],[2740,371],[3110,406],[3620,361],[4360,341],[4900,381]]},
// 3: islands make up most of the river, with one climb beside the waterfall.
{route:[[490,430,80],[84,470,95],[90,455,105],[100,440,85],[360,410,0],[280,410,90,'bridge'],[110,455,100],[100,475,90],[340,425,65],[150,365,60],[170,305,55],[470,255,50],[160,325,70],[170,385,85],[120,445,100],[100,470,90],[520,420,0],[650,420,0]],rice:[0,2,4,5,7,9,11,13,15,17]},
// 4: climb a high plateau, cross a rival's clearing, descend into a lower valley.
{route:[[550,450,55],[150,390,100],[160,330,110],[720,270,65],[260,330,65],[220,390,70],[650,455,0],[350,455,75,'bridge'],[240,395,65],[430,340,70],[180,400,75],[240,450,65],[780,430,0]],rice:[0,1,3,4,6,7,8,9,11,12],rivals:[3]},
// 5: bridges, narrow landings, a raised suspension span, long take-off gaps.
{route:[[440,435,0],[780,435,100,'bridge'],[72,405,125],[64,355,140],[88,410,150],[450,450,0],[900,450,115,'bridge'],[70,400,125],[64,360,150],[90,420,150],[420,450,0],[750,450,0,'bridge'],[690,425,0]],rice:[0,1,3,4,5,6,8,9,11,12],rivals:[5],air:[1,6]},
// 6: wet horizontal stretches, a travelling ferry, dry recovery clearings.
{route:[[510,445,0],[430,445,95,'wet'],[340,420,290],[420,450,0],[560,450,300,'wet'],[440,450,85],[76,415,145,'wet'],[390,445,95],[600,410,0],[440,410,310,'wet'],[66,445,145],[750,430,0]],rice:[0,1,2,3,4,5,6,8,9,11],rivals:[8],movers:[{after:2,w:145,travel:55,y:435,speed:.65,phase:0},{after:4,w:135,travel:65,y:450,speed:.8,phase:2},{after:9,w:130,travel:75,y:430,speed:.9,phase:3}],air:[2,9]},
// 7: a moonlit bridge with a real lower path and a side inlet.
{route:[[500,420,60],[190,365,60],[1200,455,620],[220,405,125],[76,445,140],[500,420,100],[100,365,120],[720,425,0]],rice:[0,1,2,3,4,5,6,7],extra:[[910,390,180],[1150,330,200],[1410,330,300,'bridge']],custom:null,branchRice:true,rivals:[5],ferries:{after:2,steps:[[65,80,445,40,0],[255,80,420,65,2.3],[445,80,450,40,4.6]]}},
// 8: a broad deep valley, lower rival crossing, one upper fork and a high exit.
{route:[[550,340,65],[64,405,140],[56,465,150],[660,475,70],[100,415,155],[110,355,145],[680,295,75],[52,365,150],[48,435,150],[610,475,90],[90,415,150],[110,355,145],[720,300,0],[700,300,0,'bridge']],rice:[0,2,3,4,6,7,9,10,12,13],rivals:[3,6],branch:{platform:6,w:90,rise:70,offset:210,rice:4}},
// 9: ice run-up, wide leaps to snow landings, then alternating grip and glide.
{route:[[500,445,0],[740,445,215,'ice'],[62,445,135],[64,405,160],[210,450,0],[700,450,210,'ice'],[72,440,123],[90,385,125],[460,335,70],[56,390,155],[80,445,0],[740,445,215,'ice'],[70,445,155],[780,420,0]],rice:[0,1,3,4,5,7,8,10,11,13],rivals:[8],air:[1,5]},
// 10: stream entrance, terraced hill, ferry, suspended path, and a generous village.
{route:[[520,445,85],[52,470,140],[56,435,135],[400,405,65],[130,345,155],[640,285,65],[64,345,150],[60,405,150],[490,450,620],[480,450,0],[730,450,0,'bridge'],[420,420,75],[330,385,90,'wet'],[780,425,0],[780,425,0]],rice:[0,2,4,5,7,8,10,11,12,14],rivals:[5,13],ferries:{after:8,steps:[[60,72,450,40,0],[250,72,420,65,2.3],[440,72,450,40,4.6]]},branch:{platform:5,w:88,rise:75,offset:250,rice:3}}
];
Journey.stages.forEach((s,id)=>{const c=courses[id];let x=0;s.platforms=c.route.map(([w,y,gap,type])=>{const p={x,y,w,bridge:type==='bridge',ice:type==='ice'||type==='wet',boost:type==='ice',wet:type==='wet'};x+=w+gap;return p});s.end=x;s.extras=(c.extra||[]).map(([x,y,w,type])=>({x,y,w,oneWay:true,bridge:type==='bridge'}));s.seeds=c.custom||c.rice.map((j,k)=>{const p=s.platforms[j];return c.swap?.[k]||[p.x+p.w*.57,p.y-(c.air?.includes(j)?79:34)]});
 if(c.branch){const b=c.branch,p=s.platforms[b.platform];s.extras.push({x:p.x+b.offset,y:p.y-b.rise,w:b.w,oneWay:true});s.seeds[b.rice]=[p.x+b.offset+b.w/2,p.y-b.rise-34]}
 if(c.branchRice){s.seeds=[[280,386],[1240,296],[1530,296],[1550,421],...c.rice.slice(3).map(j=>{const p=s.platforms[j];return [p.x+p.w*.55,p.y-34]})];const p=s.platforms[2];s.seeds.splice(4,0,[p.x+p.w+300,355])}
 if(c.ferries){const f=c.ferries,p=s.platforms[f.after];for(const [dx,w,y,travel,phase] of f.steps)s.extras.push({x:p.x+p.w+dx,y,w,oneWay:true,bridge:true,moving:true,baseX:p.x+p.w+dx,baseY:y,travel,vertical:12,phase,initialPhase:phase,speed:1.05})}
 for(const m of c.movers||[]){const p=s.platforms[m.after];s.extras.push({x:p.x+p.w+85,y:m.y,w:m.w,oneWay:true,bridge:true,moving:true,baseX:p.x+p.w+85,travel:m.travel,phase:m.phase,initialPhase:m.phase,speed:m.speed})}

 // A three-turn climb in the highland basin. Going along the ground misses the upper reward.
 if(id===3){const p=s.platforms[6];for(const [dx,y,w] of [[420,385,140],[220,315,130],[400,245,140]])s.extras.push({x:p.x+dx,y,w,oneWay:true});s.seeds[4]=[p.x+470,211]}
 // Ten different approaches to the flag; retain each world's ground palette and decoration.
 const finishes=[
 [[220,0,25],[190,-35,30],[300,-10,0]],
 [[170,-30,50],[140,-80,55],[310,-35,0]],
 [[90,30,100],[100,5,100],[310,-25,0]],
 [[160,-30,85],[130,30,85],[320,50,0]],
 [[110,-25,120,'bridge'],[78,-55,125],[310,-5,0,'bridge']],
 [[160,0,60],[110,-40,80],[320,-15,0]],
 [[100,-30,95],[100,-85,90],[320,-130,0]],
 [[115,30,130],[80,95,125],[320,150,0]],
 [[260,0,210,'ice'],[80,10,110],[320,-20,0]],
 [[110,-45,100],[90,-105,100],[320,-160,0]]
 ][id];
 const old=s.platforms.at(-1);let fx=old.x;const replacement=finishes.map(([w,dy,gap,type])=>{const p={x:fx,y:old.y+dy,w,bridge:type==='bridge',ice:type==='ice',boost:type==='ice'};fx+=w+gap;return p});
 s.platforms.splice(s.platforms.length-1,1,...replacement);s.end=fx;const last=replacement.at(-1);s.seeds[s.seeds.length-1]=[last.x+last.w*.48,last.y-34];
 s.routeHints=[];s.checkpoints=[Math.floor(s.platforms.length*.35),Math.floor(s.platforms.length*.7)].map(j=>({x:s.platforms[j].x+Math.min(45,s.platforms[j].w/2),y:s.platforms[j].y,trigger:s.platforms[j].x+10}));s.goalY=s.platforms.at(-1).y;s.rivalPlatforms=c.rivals||[];s.tip=['A/D・←/→で移動、SPACEでジャンプ。','花いっぱいの草原を おさんぽしよう。','おなかがすいたら、おやつで ひとやすみ。','風車のある高原へ ようこそ。','夕焼けの橋が、遠くまでつづいている。','雨の森を のんびり ぼうけん。','月あかりに はむすびが きらきら。','もみじの谷で 秋をみつけよう。','雪の丘へ ようこそ。氷はすべるよ。','みんなが待っている はむすびの里へ！'][id];
});
})();
