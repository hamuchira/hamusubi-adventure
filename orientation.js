// Presentation-only phone support. Game state and physics remain owned by game.js.
(()=>{'use strict';
const ua=navigator.userAgent;
const phone=navigator.userAgentData?.mobile===true||/iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua);
if(!phone)return;
const root=document.documentElement,main=document.querySelector('main'),notice=document.querySelector('#rotate-notice');
root.classList.add('phone');
const portrait=matchMedia('(orientation: portrait)');
// Layout dimensions take priority over orientation APIs, which can be stale on PWA resume.
function isPortrait(){
 const w=window.innerWidth,h=window.innerHeight;
 if(w>0&&h>0)return w<=h;
 const v=window.visualViewport;
 if(v?.width>0&&v?.height>0)return v.width<=v.height;
 if(typeof portrait.matches==='boolean')return portrait.matches;
 return !screen.orientation?.type?.startsWith('landscape');
}
let previousBlocked,timers=[];
function sync(){
 const blocked=isPortrait();
 root.style.setProperty('--visible-height',(window.visualViewport?.height||window.innerHeight)+'px');
 root.classList.toggle('phone-portrait',blocked);notice.hidden=!blocked;main.inert=blocked;
 if(blocked){main.setAttribute('aria-hidden','true');if(previousBlocked!==true)window.dispatchEvent(new Event('blur'))}
 else{main.removeAttribute('aria-hidden');requestAnimationFrame(()=>{if(isPortrait())return;const box=document.querySelector('#game').getBoundingClientRect();if(box.height>0)window.dispatchEvent(new CustomEvent('hamusubi-fit',{detail:{width:Math.round(540*box.width/box.height)}}))})}
 previousBlocked=blocked;
}
// Recheck after the initial layout and after wake-up; resume events can arrive before the viewport settles.
function recheck(){timers.forEach(clearTimeout);sync();requestAnimationFrame(sync);timers=[120,400,1000,2500,5000].map(delay=>setTimeout(sync,delay))}
if(portrait.addEventListener)portrait.addEventListener('change',recheck);else portrait.addListener(recheck);
window.addEventListener('resize',recheck);
window.addEventListener('orientationchange',recheck);
window.addEventListener('pageshow',recheck);
window.addEventListener('focus',recheck);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)recheck()});
document.addEventListener('fullscreenchange',recheck);
screen.orientation?.addEventListener?.('change',recheck);
window.visualViewport?.addEventListener('resize',recheck);
recheck();
async function enterLandscape(){
// Called directly from a user gesture. Unsupported APIs and rejected promises
// deliberately leave the CSS orientation notice as the normal fallback.
try{if(!document.fullscreenElement&&root.requestFullscreen)await root.requestFullscreen()}catch{}
try{if(screen.orientation?.lock)await screen.orientation.lock('landscape')}catch{}
recheck();
}
document.querySelector('#play').addEventListener('click',enterLandscape);
document.addEventListener('click',event=>{if(event.target.closest?.('[data-start]'))enterLandscape()});
})();
