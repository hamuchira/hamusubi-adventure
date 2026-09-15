(()=>{'use strict';
const $=s=>document.querySelector(s);let request=0,objectURL=null,file=null;
function reset(){request++;file=null;if(objectURL)URL.revokeObjectURL(objectURL);objectURL=null;$('#shelf-preview').hidden=true;$('#shelf-native').hidden=true;$('#shelf-download').removeAttribute('href');$('#shelf-image').removeAttribute('src')}
window.ShelfShare={reset};
$('#shelf-share').onclick=async()=>{
 reset();const token=request,ids=[...Journey.progress.favorites],url=location.href.split(/[?#]/)[0];
 const copy='はむすび🍙で遊んでるよ！\n推しケツ'+ids.length+'選をおうちに飾ったよ🐹\n#はむチラ #ハムスター';
 $('#share-title').textContent='推しケツ棚を シェア';$('#share-x').href='https://twitter.com/intent/tweet?text='+encodeURIComponent(I18n.t(copy))+'&url='+encodeURIComponent(url);$('#share-line').href='https://line.me/R/msg/text/?'+encodeURIComponent(I18n.t(copy)+'\n'+url);$('#share-status').textContent='棚の画像を じゅんび中…';$('#share-panel').hidden=false;$('#share-close').focus();
 try{const art=new Image();art.src='assets/home.png';const photos=ids.map(id=>{const c=HAMUKETSU.find(c=>c.collection_id===id),img=new Image();img.src='assets/hamuketsu/'+c.butt_file;return {c,img}});await Promise.all([art.decode(),...photos.map(p=>p.img.decode())]);if(token!==request)return;
 const out=document.createElement('canvas');out.width=1280;out.height=720;const ctx=out.getContext('2d');ctx.fillStyle='#fff2cf';ctx.fillRect(0,0,1280,720);ctx.imageSmoothingEnabled=false;ctx.drawImage(art,0,0,art.width,art.height*.35,0,125,1280,252);
 ctx.save();ctx.translate(0,125);ctx.scale(1280/960,252/(540*.35));for(let n=0;n<10;n++)window.Customize?.shelf(ctx,164+n%5*139,n<5?58:133,106,Missions.data.selected.shelf);ctx.restore();
 // The same alpha bounds and bottom alignment as the live shelf, enlarged for sharing.
 photos.forEach(({c,img},n)=>{const [l,t,r,b]=PHOTO_BOUNDS[c.butt_file],scale=Math.min(145/(r-l),74/(b-t)),w=(r-l)*scale,h=(b-t)*scale,x=291+(n%5)*185.33,y=n<5?205:305;ctx.imageSmoothingEnabled=true;ctx.drawImage(img,l,t,r-l,b-t,x-w/2,y-h,w,h);ctx.fillStyle='#593d28';ctx.font='bold 18px Meiryo,sans-serif';ctx.textAlign='center';ctx.fillText(c.display_name,x,y+23,174)});
 ctx.textAlign='left';ctx.fillStyle='#593d28';ctx.font='bold 48px Meiryo,sans-serif';ctx.fillText('はむすび　推しケツ棚',65,80);ctx.font='bold 29px Meiryo,sans-serif';ctx.fillText('わたしの推しケツ '+ids.length+' / 10',65,453);ctx.font='24px Meiryo,sans-serif';ctx.fillText('小さな冒険で出会った、大好きな仲間たち。',65,505);ctx.fillText('#はむチラ  #ハムスター',65,560);ctx.font='18px Meiryo,sans-serif';ctx.fillText(url,65,651,1150);
 const blob=await new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(Error('image')),'image/png'));if(token!==request)return;objectURL=URL.createObjectURL(blob);file=new File([blob],'hamusubi-oshi-shelf.png',{type:'image/png'});$('#shelf-image').src=objectURL;$('#shelf-download').href=objectURL;$('#shelf-preview').hidden=false;$('#shelf-native').hidden=!navigator.canShare?.({files:[file]});$('#share-status').textContent='いまの棚を画像にしたよ！';
 }catch{if(token===request)$('#share-status').textContent='画像を作れませんでした。URLと文章は共有できます。'}
};
$('#shelf-native').onclick=async()=>{if(!file)return;try{await navigator.share({files:[file],title:I18n.t('はむすびの推しケツ棚'),text:I18n.t('はむすび🍙で遊んでるよ！ #はむチラ #ハムスター')});$('#share-status').textContent='共有したよ！'}catch(e){$('#share-status').textContent=e.name==='AbortError'?'共有をとじたよ。':'画像を保存して、好きなアプリで共有してね。'}};
})();
