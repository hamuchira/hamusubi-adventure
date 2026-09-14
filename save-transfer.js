(()=>{'use strict';
const $=s=>document.querySelector(s), clone=v=>JSON.parse(JSON.stringify(v));
const keys=[Journey.KEY,Missions.KEY,...(window.EventSystem?[EventSystem.KEY]:[])], backupKey='hamusubi.transfer.backup.v1';
function pack(){return {format:'hamusubi-save',version:1,savedAt:new Date().toISOString(),journey:clone(Journey.progress),missions:clone(Missions.data),events:window.EventSystem?clone(EventSystem.data):null}}
function validate(raw){
 if(!raw||raw.format!=='hamusubi-save'||raw.version!==1)throw Error('この形式のセーブは読み込めません。ゲームを最新版にして確認してください。');
 function walk(v,depth=0){if(depth>12)throw Error('セーブの構造が正しくありません。');if(typeof v==='number'&&(!Number.isFinite(v)||v<0||v>Number.MAX_SAFE_INTEGER))throw Error('記録の数値が正しくありません。');if(typeof v==='string'&&(v.length>160||/[<>]/.test(v)))throw Error('記録の文字が正しくありません。');if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){if(['__proto__','prototype','constructor'].includes(k))throw Error('セーブの構造が正しくありません。');walk(x,depth+1)}}
 walk(raw);
 const p=raw.journey,m=raw.missions,obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
 if(!obj(p)||p.version!==3||!obj(m)||!obj(m.counts)||!obj(m.selected)||!obj(m.outings)||!obj(m.recoveryCredits))throw Error('セーブに必要な記録が足りません。');
 for(const [k,v]of Object.entries(Journey.progress)){if(!Object.hasOwn(p,k))throw Error('セーブに必要な記録が足りません。');if(typeof v==='number'&&!['currentStage','lastClearedStage'].includes(k)&&!Number.isSafeInteger(p[k]))throw Error('冒険の記録が正しくありません。');if(typeof v==='boolean'&&typeof p[k]!=='boolean')throw Error('冒険の記録が正しくありません。')}
 if(!Number.isInteger(p.unlocked)||p.unlocked<1||p.unlocked>10||![p.currentStage,p.lastClearedStage,p.adventureStage,p.lapStartStage].every(v=>v===null||(Number.isInteger(v)&&v>=0&&v<10)))throw Error('開始ステージが正しくありません。');
 for(const k of ['cleared','best','gifts','clearCounts','topScores'])if(!Array.isArray(p[k])||p[k].length!==10)throw Error('ステージ記録が正しくありません。');
 for(const k of ['collection','favorites','bonusTopScores'])if(!Array.isArray(p[k]))throw Error('コレクション記録が正しくありません。');
 if(p.collection.some(id=>!HAMUKETSU.some(c=>c.collection_id===id))||p.favorites.some(id=>!p.collection.includes(id))||p.favorites.length>10||typeof m.extraUnlocked!=='boolean'||Object.values(m.recoveryCredits).some(v=>!Number.isSafeInteger(v)))throw Error('取得記録が正しくありません。');
 for(const k of ['cleared','gifts'])if(p[k].some(v=>typeof v!=='boolean'))throw Error('クリア記録が正しくありません。');
 const numbers=a=>Array.isArray(a)&&a.every(v=>Number.isSafeInteger(v)&&v>=0);
 if(!numbers(p.best)||!numbers(p.clearCounts)||!p.topScores.every(a=>numbers(a)&&a.length<=3)||!numbers(p.bonusTopScores)||!obj(p.care)||!Number.isFinite(p.care.hunger)||p.care.hunger>100||![0,1,2,3].includes(p.care.lives)||![0,1,2,3].includes(p.care.snacks))throw Error('スコアまたは体調の記録が正しくありません。');
 for(const k of Object.keys(Missions.data.counts))if(!Number.isSafeInteger(m.counts[k])||m.counts[k]<0)throw Error('ミッション記録が正しくありません。');
 const ids=Missions.definitions.map(d=>d.id);for(const k of ['unlocks','seen'])if(!Array.isArray(m[k])||m[k].some(id=>!ids.includes(id)))throw Error('報酬記録が正しくありません。');
 for(const [k,options]of Object.entries({fur:Customize.palettes,wheel:Customize.wheelColors,shelf:Customize.shelves,house:Customize.houses}))if(!Object.hasOwn(options,m.selected[k]))throw Error('カスタムの記録が正しくありません。');
 for(const [id,r]of Object.entries(m.outings))if(!['0','1','2','3'].includes(id)||!obj(r)||!Number.isSafeInteger(r.clears)||!numbers(r.top)||r.top.length>3||(r.best!==undefined&&!Number.isSafeInteger(r.best)))throw Error('おでかけ記録が正しくありません。');
 if(m.notifications!==undefined){if(!obj(m.notifications)||['customSeen','adventureSeen','played'].some(k=>!Array.isArray(m.notifications[k])||m.notifications[k].some(v=>typeof v!=='string')))throw Error('通知記録が正しくありません。')}else m.notifications={customSeen:[],adventureSeen:[],played:[]};if(raw.events!=null){const e=raw.events;if(e.version!==1||!obj(e.records)||!obj(e.owned)||!obj(e.selected)||!Array.isArray(e.seen))throw Error('イベント記録が正しくありません。');for(const r of Object.values(e.records))if(!obj(r)||!numbers(r.top)||!obj(r.items)||!['plays','clears','bestScore','bestRice'].every(k=>Number.isSafeInteger(r[k])))throw Error('イベントの進捗が正しくありません。')}return clone(raw);
}
function apply(raw){
 const data=validate(raw),old=keys.map(k=>localStorage.getItem(k));
 // Keep a recoverable copy before either active save is replaced.
 localStorage.setItem(backupKey,JSON.stringify(pack()));
 try{localStorage.setItem(keys[0],JSON.stringify(data.journey));localStorage.setItem(keys[1],JSON.stringify(data.missions));if(window.EventSystem)localStorage.setItem(EventSystem.KEY,JSON.stringify(data.events||{version:1,records:{},owned:{},selected:{},seen:[]}))}catch(e){keys.forEach((k,i)=>{if(old[i]===null)localStorage.removeItem(k);else localStorage.setItem(k,old[i])});throw e}
 Object.assign(Journey.progress,data.journey);Object.assign(Missions.data,data.missions);Missions.queue.length=0;
 window.EventSystem?.restore(data.events);HomeGame.adoptCare();
}
window.SaveTransfer={pack,validate,apply};
const openButton=document.createElement('button');openButton.id='save-transfer-open';openButton.textContent='⇄ セーブの引きつぎ';$('#title-screen').append(openButton);
const back=document.createElement('button');back.id='home-title-back';back.textContent='‹ タイトルへ';back.onclick=()=>HomeGame.goTitle();$('#home-screen').append(back);
const dialog=document.createElement('dialog');dialog.id='save-transfer';dialog.setAttribute('aria-labelledby','save-transfer-heading');dialog.innerHTML='<h2 id="save-transfer-heading">セーブの書き出し・読み込み</h2><p>書き出したファイルを、別の端末で読み込むと続きから遊べます。自動同期ではありません。</p><div class="transfer-actions"><button id="save-export">↓ セーブを書き出す</button><button id="save-import">↑ セーブを読み込む</button></div><input id="save-file" type="file" accept=".json,application/json" hidden><p id="save-transfer-status" role="status"></p><section id="save-preview" hidden><p id="save-preview-text"></p><p>この端末の記録を置き換えます。現在の記録は1つ前の記録として退避します。</p><div class="transfer-actions"><button id="save-cancel">いいえ</button><button id="save-confirm">はい、読み込む</button></div></section><button id="save-restore">1つ前の記録に戻す</button><button id="save-transfer-close">閉じる</button>';
$('#stage').append(dialog);let pending=null;
const status=t=>$('#save-transfer-status').textContent=t;
openButton.onclick=()=>{pending=null;$('#save-preview').hidden=true;status('ステージ途中の位置は引き継がず、そのステージの最初から再開します。');try{$('#save-restore').hidden=!localStorage.getItem(backupKey)}catch{$('#save-restore').hidden=true}dialog.showModal()};
$('#save-transfer-close').onclick=()=>dialog.close();$('#save-cancel').onclick=()=>{pending=null;$('#save-preview').hidden=true};
$('#save-export').onclick=()=>{try{const blob=new Blob([JSON.stringify(pack(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='hamusubi-save-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);status('ファイルの保存先を確認してください。移動先の端末へファイルを送り「セーブを読み込む」で選んでね。')}catch{status('書き出せませんでした。ブラウザのダウンロード設定を確認してください。')}};
$('#save-import').onclick=()=>{$('#save-file').value='';$('#save-file').click()};
function preview(data){pending=validate(data);$('#save-preview-text').textContent='保存日時：'+(Number.isNaN(Date.parse(pending.savedAt))?'不明':new Date(pending.savedAt).toLocaleString())+' ／ 本編クリア '+pending.journey.cleared.filter(Boolean).length+'/10 ／ ハムケツ '+pending.journey.collection.length+'/30';$('#save-preview').hidden=false;$('#save-cancel').focus();status('この記録を読み込みますか？')}
$('#save-file').onchange=async()=>{pending=null;$('#save-preview').hidden=true;const file=$('#save-file').files[0];if(!file)return;try{if(file.size>1024*1024)throw Error('ファイルが大きすぎます。はむすびのセーブファイルを選んでください。');preview(JSON.parse(await file.text()))}catch(e){status(e instanceof SyntaxError?'ファイルを読み取れません。JSON形式のセーブを選んでください。':e.message)}};
$('#save-restore').onclick=()=>{try{preview(JSON.parse(localStorage.getItem(backupKey)))}catch(e){status('退避した記録を読み込めません：'+e.message)}};
$('#save-confirm').onclick=()=>{if(!pending)return;try{apply(pending);pending=null;$('#save-preview').hidden=true;$('#save-restore').hidden=false;status('読み込みました！ 閉じて「ぼうけんを はじめる」から続けてね。')}catch{status('保存できませんでした。ブラウザの空き容量・保存設定を確認してください。')}};
})();
