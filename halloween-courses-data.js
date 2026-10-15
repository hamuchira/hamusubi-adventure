// Halloween routes are isolated from the existing moon campaign. No invented schedule.
(()=>{'use strict';
const preview=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('halloweenTest')==='1';
const config={preview,ticketRate:.10,enabled:true,startsAt:'2026-10-18T12:00:00+09:00',endsAt:'2026-11-01T00:00:00+09:00',period:'2026/10/18 12:00 ～ 10/31 23:59（JST）'};
window.HALLOWEEN_COURSE_CONFIG=config;
const names=['かぼちゃ畑のハロウィン','おばけ屋敷の大冒険','魔女の夜空をひとっとび'];
const themes=['pumpkin','mansion','witch'];
const p=(x,y,w,kind='soil',extra={})=>({x,y,w,kind,oneWay:true,...extra});
// Hand-authored traversal beats, not a repeated/scaled template. All courses end at 7,600.
const paths=[
 [[0,450,620],[680,420,360],[1110,365,180,'pumpkin'],[1380,430,490],[1940,390,260],[2270,330,160,'pumpkin'],[2500,390,430],[3000,450,370],[3440,415,530],[4050,355,220,'crate'],[4340,425,450],[4860,380,320],[5250,320,170,'pumpkin'],[5490,390,400],[5960,445,420],[6450,410,320],[6840,350,210,'pumpkin'],[7120,410,480]],
 [[0,450,530,'wood'],[600,375,290,'books'],[970,290,190,'wood'],[1230,205,300,'books'],[1610,280,210,'wood'],[1900,365,440,'wood'],[2410,280,190,'books'],[2670,190,250,'books'],[2990,110,410,'wood'],[3470,195,160,'books'],[3700,280,320,'wood'],[4090,365,420,'wood'],[4580,270,230,'books'],[4880,180,170,'wood'],[5120,100,350,'books'],[5540,185,210,'wood'],[5820,270,240,'books'],[6130,350,460,'wood'],[6660,260,260,'books'],[6990,180,180,'wood'],[7240,270,360,'wood']],
 [[0,450,430,'island'],[530,395,180,'cloud'],[810,310,230,'island'],[1140,375,125,'pumpkin'],[1370,270,310,'cloud'],[1780,195,160,'broom'],[2040,285,240,'island'],[2380,190,145,'cloud'],[2625,110,300,'island'],[3025,195,170,'broom'],[3295,95,210,'cloud'],[3605,0,150,'pumpkin'],[3855,80,320,'island'],[4275,-10,180,'cloud'],[4555,-100,140,'broom'],[4795,-25,300,'island'],[5195,-120,150,'pumpkin'],[5445,-210,240,'cloud'],[5785,-120,130,'broom'],[6015,-230,300,'island'],[6415,-315,190,'cloud'],[6705,-230,180,'pumpkin'],[6985,-335,180,'cloud'],[7265,-400,335,'island']]
];
const branches=[
 [p(1290,570,500),p(1840,510,180),p(3230,300,160,'crate'),p(3450,210,200,'pumpkin'),p(5200,465,400),p(5440,555,250),p(5800,560,190),p(6030,635,170),p(6250,710,520),p(6830,620,150),p(7040,520,150)],
 [p(1090,385,420,'wood'),p(1740,150,130,'books'),p(1800,65,220,'wood'),p(3470,40,180,'books'),p(3700,-55,230,'wood'),p(5260,-25,120,'books'),p(5450,-110,250,'wood'),p(5950,445,190,'wood'),p(6200,535,480,'wood'),p(6740,450,180,'books'),p(6970,355,170,'wood')],
 [p(1490,130,160,'cloud'),p(1720,40,170,'island'),p(3420,-45,110,'broom'),p(3620,-140,160,'cloud'),p(5220,-270,120,'cloud'),p(5420,-370,200,'island'),p(5860,-365,140,'cloud'),p(6080,-455,440,'cloud'),p(6580,-415,160,'broom'),p(5710,-330,100,'cloud')]
];
const candies=[[[1600,540],[3540,180],[5580,525]],[[1260,355],[1900,35],[5570,-140]],[[1810,10],[3700,-170],[5520,-400]]];
const rooms=[{x:6250,y:580,w:520,h:130,floor:710,doorX:6268,name:'かぼちゃの地下室'}, {x:6200,y:390,w:480,h:145,floor:535,doorX:6218,name:'本棚の奥の秘密部屋'}, {x:6080,y:-600,w:440,h:145,floor:-455,doorX:6098,name:'雲の魔法の部屋'}];
const defs=paths.map((rows,i)=>{
 const platforms=rows.map(a=>p(...a));const extras=branches[i];
 // Moving bookshelves and broom ferries use the existing carry physics.
 if(i===1){Object.assign(platforms[6],{moving:true,baseX:2410,baseY:280,travel:35,vertical:28,speed:.8});Object.assign(platforms[13],{moving:true,baseX:4880,baseY:180,travel:24,vertical:24,speed:.7});}
 if(i===2)for(const n of [5,9,14,18])Object.assign(platforms[n],{moving:true,baseX:platforms[n].x,baseY:platforms[n].y,travel:24,vertical:15,speed:.8});
 const seeds=platforms.flatMap((q,n)=>[[q.x+(n===0?260:Math.min(q.w/2,70)),q.y-32,'normal'],...(q.w>=300?[[Math.min(7320,q.x+q.w-75),q.y-32,'normal']]:[])]);
 // Optional routes reward exploration, but preserve the standard scoring and rice values.
 for(const q of extras.slice(0,6))seeds.push([q.x+q.w*.7,q.y-32,'normal']);
 const room=rooms[i];const stage={id:40+i,name:names[i],eventRoute:true,eventDifficulty:'normal',halloween:true,theme:'halloween-'+themes[i],verticalCamera:true,gravity:1,hunger:true,tip:'キャンディを3個探そう！ 秘密の扉が開くよ。はむすび10個でゴール！',platforms,extras,seeds,rivalPlatforms:[],keys:[],fixedKeys:true,chests:[[platforms[4].x+110,platforms[4].y],[platforms[12].x+80,platforms[12].y],[room.x+room.w-105,room.floor]],end:7600,goalY:platforms.at(-1).y,routeHints:[],checkpoints:[4,8,12,16].filter(n=>platforms[n]).map(n=>({x:platforms[n].x+40,y:platforms[n].y,trigger:platforms[n].x+15})),candies:candies[i].map(([x,y])=>({x,y})),secretRoom:room,concealed:i===1?[{x:1090,y:290,w:420,h:95},{x:6200,y:390,w:480,h:145}]:[]};
 if(i===0)stage.vault={x:5800,w:1000,floor:1450,exitX:5890,platforms:[p(5800,1450,1000,'vault-floor',{area:'vault'})],chests:[[6100,1450,{area:'vault'}],[6360,1450,{area:'vault'}],[6620,1450,{area:'vault'}]]};
 if(i>0)stage.vault={x:5800,w:1000,floor:1450,exitX:5890,name:room.name,background:'assets/events/halloween2026/courses/'+themes[i]+'.png',sharedChestId:i===2?2:undefined,platforms:[p(5800,1450,1000,i===1?'wood':'cloud',{area:'vault'})],chests:i===1?[[6100,1450,{area:'vault'}],[6360,1450,{area:'vault'}],[6620,1450,{area:'vault'}]]:[]};
 stage.keys=[[platforms[2].x+80,platforms[2].y-32],[extras[1].x+65,extras[1].y-32]];
 return {eventId:'halloween2026-normal'+(i+1),campaignId:'halloween2026',number:i+1,mode:'normal',name:names[i],icon:'🎃',description:stage.tip,background:'assets/events/halloween2026/courses/'+themes[i]+'.png',rewards:[],enabled:true,developmentOnly:true,stage};
});
window.HAMUSUBI_EVENTS.push(...defs);
window.HALLOWEEN_COURSES=defs;
})();
