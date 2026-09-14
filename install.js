(()=>{'use strict';
const button=document.querySelector('#install-home'),dialog=document.querySelector('#install-help'),copy=document.querySelector('#install-steps'),close=document.querySelector('#install-close');
const standalone=matchMedia('(display-mode: standalone)');let pending=null,installed=false;
function update(){button.hidden=installed||standalone.matches||navigator.standalone===true;if(button.hidden&&dialog.open)dialog.close()}
function instructions(){const ua=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);let embedded=false;try{embedded=window.top!==window.self}catch{embedded=true}
if(embedded)return 'Safari または Chrome でこのゲームのURLを開いてから、もう一度お試しください。';
if(ios)return 'ブラウザの「共有」→「ホーム画面に追加」→「追加」を選んでね。「Webアプリとして開く」がある場合はオンにしてください。項目が見つからないときは、SafariでこのURLを開いて試してね。';
if(/Android/.test(ua))return 'ブラウザのメニュー（⋮）から「アプリをインストール」または「ホーム画面に追加」を選んでね。項目が見つからないときは、ChromeでこのURLを開いて試してね。';
return 'Chrome／Edgeではアドレスバーのインストールアイコン、またはブラウザのメニューから追加できます。Safariでは「ファイル」→「Dockに追加」を確認してください。対応していないブラウザではブックマークから開けます。';}
function help(){copy.textContent=instructions();if(!dialog.open)dialog.showModal();close.focus()}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();pending=e;update()});addEventListener('appinstalled',()=>{installed=true;pending=null;update()});standalone.addEventListener?.('change',update);addEventListener('pageshow',update);
button.addEventListener('click',async()=>{if(!pending){help();return}const request=pending;pending=null;button.disabled=true;try{await request.prompt();await request.userChoice}catch{help()}finally{button.disabled=false;update()}});
close.onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});update();
})();

