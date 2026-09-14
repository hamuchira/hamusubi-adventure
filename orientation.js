// Presentation-only phone support. Game state and physics remain owned by game.js.
(()=>{'use strict';
const ua=navigator.userAgent;
const phone=navigator.userAgentData?.mobile===true||/iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua);
if(!phone)return;
const root=document.documentElement,main=document.querySelector('main'),notice=document.querySelector('#rotate-notice');
root.classList.add('phone');
const portrait=matchMedia('(orientation: portrait)');
function sync(){const blocked=portrait.matches;root.style.setProperty('--visible-height',(window.visualViewport?.height||innerHeight)+'px');root.classList.toggle('phone-portrait',blocked);notice.hidden=!blocked;main.inert=blocked;if(blocked){main.setAttribute('aria-hidden','true');window.dispatchEvent(new Event('blur'))}else{main.removeAttribute('aria-hidden');requestAnimationFrame(()=>{const box=document.querySelector('#game').getBoundingClientRect();if(box.height>0)window.dispatchEvent(new CustomEvent('hamusubi-fit',{detail:{width:Math.round(540*box.width/box.height)}}))})}}
if(portrait.addEventListener)portrait.addEventListener('change',sync);else portrait.addListener(sync);
window.addEventListener('resize',sync);window.addEventListener('orientationchange',sync);document.addEventListener('fullscreenchange',sync);sync();
window.visualViewport?.addEventListener('resize',sync);
async function enterLandscape(){
// Called directly from a user gesture. Unsupported APIs and rejected promises
// deliberately leave the CSS orientation notice as the normal fallback.
try{if(!document.fullscreenElement&&root.requestFullscreen)await root.requestFullscreen()}catch{}
try{if(screen.orientation?.lock)await screen.orientation.lock('landscape')}catch{}
sync();
}
document.querySelector('#play').addEventListener('click',enterLandscape);
document.addEventListener('click',event=>{if(event.target.closest?.('[data-start]'))enterLandscape()});
})();
