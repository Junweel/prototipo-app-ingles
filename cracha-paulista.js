/* Crachá = identidade + cordão da empresa. Camada somente visual; IDs e storage legados preservados. */
(()=>{'use strict';
const cache=new Map();
function palette(src){
 if(cache.has(src))return cache.get(src);
 const job=new Promise(resolve=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{try{
  const c=document.createElement('canvas');c.width=c.height=40;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,40,40);const p=x.getImageData(0,0,40,40).data,bins=new Map();
  for(let i=0;i<p.length;i+=4){const [r,g,b,a]=p.slice(i,i+4),lo=Math.min(r,g,b),hi=Math.max(r,g,b);if(a<160||hi-lo<28||lo>230||hi<35)continue;const key=[r,g,b].map(v=>Math.min(255,Math.round(v/24)*24)).join(',');bins.set(key,(bins.get(key)||0)+1)}
  const top=[...bins].sort((a,b)=>b[1]-a[1])[0];if(!top)return resolve(['#1B2A4A','#F3EBDD']);const rgb=top[0].split(',').map(Number),l=rgb[0]*.299+rgb[1]*.587+rgb[2]*.114;resolve(['rgb('+rgb.join(',')+')',l>145?'#0B1119':'#FFFFFF']);
 }catch(_){resolve(['#1B2A4A','#F3EBDD'])}};img.onerror=()=>resolve(['#1B2A4A','#F3EBDD']);img.src=src});cache.set(src,job);return job;
}
function company(host){
 const node=host.querySelector('.cpi-company,.cpi-minico,.tl-company,.company');
 if(node){const label=node.querySelector('.co,b,span')||node;const logo=node.querySelector('img');if(logo)return {name:label.textContent.trim(),logo:logo.src}}
 if(host.classList.contains('cpi-contextbadge')){const logo=host.querySelector(':scope > img');const name=logo?.alt.replace(/^Logo\s+/,'');if(logo&&name)return {name,logo:logo.src}}
 return null;
}
function decorate(host){
 const co=company(host);if(!co?.name||!co.logo)return;const sig=co.name+'|'+co.logo;
 const old=host.querySelector(':scope > .cracha-lanyard');if(host.dataset.crachaSignature===sig&&old)return;
 old?.remove();host.querySelector(':scope > .cracha-slot')?.remove();host.dataset.crachaSignature=sig;host.classList.add('cracha-badge');
 const strap=document.createElement('div');strap.className='cracha-lanyard';strap.setAttribute('aria-hidden','true');
 for(let i=0;i<3;i++){const print=document.createElement('span'),im=document.createElement('img'),text=document.createElement('span');text.className='cracha-print-name';im.src=co.logo;im.alt='';text.textContent=co.name;print.append(im,text);strap.append(print)}
 const slot=document.createElement('span');slot.className='cracha-slot';slot.setAttribute('aria-hidden','true');host.prepend(strap,slot);
 palette(co.logo).then(([bg,fg])=>{if(host.isConnected&&host.dataset.crachaSignature===sig){host.style.setProperty('--cracha-company',bg);host.style.setProperty('--cracha-ink',fg)}});
}
function render(){document.querySelectorAll('.cpi-hero,.cpi-practicebar,.cpi-personbadge,.cpi-contextbadge,.cpi-profileid,.tl-id,.phone .hero').forEach(decorate)}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;render()})}
render();new MutationObserver(ms=>{if(ms.some(m=>!m.target.closest?.('.cracha-lanyard,.cracha-slot')))schedule()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});window.addEventListener('hashchange',schedule);
})();
