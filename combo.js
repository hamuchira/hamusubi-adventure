/* Additive run scoring. Item credits prevent stolen rice from farming bonuses. */
window.ComboScore={seconds:3,step:10,cap:100,create(enabled=false){return {enabled,count:0,remaining:0,pop:0,max:0,normal:0,rare:0,bonus:0,
 tick(dt){this.pop=Math.max(0,this.pop-dt);this.remaining=Math.max(0,this.remaining-dt);if(!this.remaining)this.count=0},
 collect(item,base){if(item.scoreHeld)return 0;if(!item.scoreCredit){let extra=0;if(this.enabled){this.count=this.remaining>0?this.count+1:1;this.remaining=ComboScore.seconds;this.max=Math.max(this.max,this.count);this.pop=.2;extra=Math.min(ComboScore.cap,(this.count-1)*ComboScore.step)}item.scoreCredit={base,extra,bucket:item.kind==='normal'&&!item.fromChest?'normal':'rare'}}const c=item.scoreCredit;item.scoreHeld=true;this[c.bucket]+=c.base;this.bonus+=c.extra;return c.base+c.extra},
 remove(item,base){if(!item.scoreHeld)return base;const c=item.scoreCredit;item.scoreHeld=false;this[c.bucket]-=c.base;this.bonus-=c.extra;return c.base+c.extra},
 snapshot(){return {enabled:this.enabled,count:this.count,remaining:this.remaining,max:this.max,normal:this.normal,rare:this.rare,bonus:this.bonus,total:this.normal+this.rare+this.bonus}},
 summary(){return `はむすび ${this.normal.toLocaleString()}点　レア／宝箱 ${this.rare.toLocaleString()}点\nコンボボーナス +${this.bonus.toLocaleString()}点（最大 ${this.max} COMBO）`}
}}};
