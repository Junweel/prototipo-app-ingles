/* Crachá = identidade + cordão da empresa. Camada somente visual; IDs e storage legados preservados. */
(()=>{'use strict';
const cache=new Map();
let clipSeq=0;
const luminance=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
function palette(src){
 if(cache.has(src))return cache.get(src);
 const job=new Promise(resolve=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{try{
  const c=document.createElement('canvas');c.width=c.height=40;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,40,40);const p=x.getImageData(0,0,40,40).data,bins=new Map();
  for(let i=0;i<p.length;i+=4){const [r,g,b,a]=p.slice(i,i+4),lo=Math.min(r,g,b),hi=Math.max(r,g,b);if(a<160||hi-lo<28||lo>230||hi<35)continue;const key=[r,g,b].map(v=>Math.min(255,Math.round(v/24)*24)).join(',');bins.set(key,(bins.get(key)||0)+1)}
  const top=[...bins].sort((a,b)=>b[1]-a[1])[0];if(!top)return resolve(['#1B2A4A','#F3EBDD']);const rgb=top[0].split(',').map(Number),l=luminance(rgb),white=contrast(1,l),navy=contrast(luminance([11,17,25]),l);const ink=Math.max(white,navy)<4.5?'#000000':white>=navy?'#FFFFFF':'#0B1119';resolve(['rgb('+rgb.join(',')+')',ink]);
 }catch(_){resolve(['#1B2A4A','#F3EBDD'])}};img.onerror=()=>resolve(['#1B2A4A','#F3EBDD']);img.src=src});cache.set(src,job);return job;
}
function company(host){
 const missing=host.dataset.companyReady==='false'||host.classList.contains('tl-id')&&window.cartaoPaulistaIdentity?.().companyReady===false;
 if(missing){const im=host.querySelector('.tl-company img');if(im&&!window.cartaoPaulistaIdentity?.().logo){im.hidden=true;if(im.hasAttribute('src'))im.removeAttribute('src')}return {name:'Sua empresa no cordão',logo:'',empty:true}}
 const node=host.querySelector('.cpi-company,.cpi-minico,.tl-company,.company');
 if(node){const label=node.querySelector('.co,b,span')||node;const logo=node.querySelector('img');if(logo)return {name:label.textContent.trim(),logo:logo.src}}
 if(host.classList.contains('cpi-contextbadge')){const logo=host.querySelector(':scope > img');const name=logo?.alt.replace(/^Logo\s+/,'');if(logo&&name)return {name,logo:logo.src}}
 return null;
}
function fullHost(host){return host.classList.contains('hero')&&!!host.closest('.phone')}
function clip(){
 const id='crachaMetal'+(++clipSeq);
 const s=document.createElement('span');s.className='cracha-clip';
 s.innerHTML=`<svg viewBox="0 0 88 56" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8fbfc"/><stop offset=".42" stop-color="#c5d0d8"/><stop offset=".7" stop-color="#6e7a84"/><stop offset="1" stop-color="#e7eef3"/></linearGradient><linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#d5dee6"/><stop offset="1" stop-color="#8d98a2"/></linearGradient></defs><rect x="8" y="0" width="72" height="26" rx="4" fill="url(#${id})" stroke="#556068" stroke-width="1.1"/><rect x="12" y="3" width="64" height="6" rx="2" fill="#fff" opacity=".55"/><rect x="18" y="12" width="52" height="9" rx="2" fill="url(#${id}t)" stroke="#66717a" stroke-width=".7"/><circle cx="26" cy="16.5" r="1.4" fill="#3e484f"/><circle cx="62" cy="16.5" r="1.4" fill="#3e484f"/><path d="M30 25h28v5h-6V56h-16V30h-6z" fill="url(#${id})" stroke="#556068" stroke-width=".8"/></svg>`;
 return s;
}
function printNode(co,size){
 const print=document.createElement('span');print.className='cracha-print';
 if(co.logo){const im=document.createElement('img');im.src=co.logo;im.alt='';print.append(im)}
 const text=document.createElement('span');text.className='cracha-print-name';text.textContent=co.name;text.style.fontSize=size;print.append(text);
 return print;
}
function decorate(host){
 const co=company(host);if(!co?.name)return;
 const full=fullHost(host),mode=full?'full':'tab',sig=co.name+'|'+co.logo+'|'+mode;
 const old=host.querySelector(':scope > .cracha-lanyard');if(host.dataset.crachaSignature===sig&&old)return;
 old?.remove();host.querySelector(':scope > .cracha-slot')?.remove();host.dataset.crachaSignature=sig;host.dataset.crachaMode=mode;host.classList.add('cracha-badge');
 host.classList.toggle('cracha-full',full);host.classList.toggle('cracha-compact',!full);
 const strap=document.createElement('div');strap.className='cracha-lanyard '+(full?'cracha-lanyard-full':'cracha-lanyard-tab');strap.setAttribute('aria-hidden','true');
 if(full){
  const size=Math.max(11,Math.min(13,Math.floor((co.logo?160:190)/Math.max(co.name.length,1))))+'px';
  ['left','right'].forEach(side=>{const arm=document.createElement('span');arm.className='cracha-strap cracha-strap-'+side;arm.append(printNode(co,size));strap.append(arm)});
 }else{
  const tab=document.createElement('span');tab.className='cracha-tab';
  if(co.logo){const im=document.createElement('img');im.src=co.logo;im.alt='';tab.append(im)}
  else{const mono=document.createElement('span');mono.className='cracha-mono';const parts=co.name.split(/\s+/).filter(Boolean);mono.textContent=(parts.length>1?parts[0][0]+parts[1][0]:co.name.slice(0,2)).toUpperCase();tab.append(mono)}
  strap.append(tab);
 }
 strap.append(clip());
 const slot=document.createElement('span');slot.className='cracha-slot';slot.setAttribute('aria-hidden','true');host.prepend(strap,slot);
 (co.logo?palette(co.logo):Promise.resolve(['#1B2A4A','#F3EBDD'])).then(([bg,fg])=>{if(host.isConnected&&host.dataset.crachaSignature===sig){host.style.setProperty('--cracha-company',bg);host.style.setProperty('--cracha-ink',fg)}});
}
function render(){document.querySelectorAll('.cpi-hero,.cpi-practicebar,.cpi-personbadge,.cpi-contextbadge,.cpi-profileid,.tl-id,.phone .hero').forEach(decorate)}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;render()})}
render();new MutationObserver(ms=>{if(ms.some(m=>!m.target.closest?.('.cracha-lanyard,.cracha-slot')))schedule()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});window.addEventListener('hashchange',schedule);
})();
