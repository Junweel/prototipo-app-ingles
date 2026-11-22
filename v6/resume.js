/* Grava o ponto da trilha. A leitura na abertura está em show(), para valer no primeiro paint. */
(function(){
'use strict';
const PATH=/^(d-warm|d-ouvir|d-trail|d-call|d-close|sophia|ep|foco|cartoes|m-warm|m-talk|m-pron|m-cycle)$/;
function remember(){
 const h=location.hash.replace(/^#/,'');
 const base=h.split('~')[0];
 if(!PATH.test(base))return;
 const data={hash:h,at:Date.now()};
 if(base==='d-warm'&&typeof wi==='number'){data.wi=wi;data.wrev=!!wrev}
 if(base==='d-trail'&&typeof ei==='number')data.ei=ei;
 try{localStorage.setItem('spla_resume',JSON.stringify(data))}catch(_){}
}
const baseShow=window.show;
if(typeof baseShow==='function')window.show=function(){const out=baseShow.apply(this,arguments);remember();return out};
if(typeof renderW==='function'){const prev=renderW;window.renderW=function(){const out=prev.apply(this,arguments);remember();return out}}
if(typeof renderEx==='function'){const prev=renderEx;window.renderEx=function(){const out=prev.apply(this,arguments);remember();return out}}
})();
