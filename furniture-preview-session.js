// An explicit furniture-preview session uses memory only, including the game's existing saves.
(()=>{'use strict';if(new URLSearchParams(location.search).get('furniturePreview')!=='1')return;
const values=new Map(),memory={getItem:k=>values.has(String(k))?values.get(String(k)):null,setItem:(k,v)=>values.set(String(k),String(v)),removeItem:k=>values.delete(String(k)),clear:()=>values.clear(),key:n=>[...values.keys()][n]??null,get length(){return values.size}};
Object.defineProperty(window,'localStorage',{value:memory});window.HAMUSUBI_FURNITURE_PREVIEW=true;
})();
