/* Keep the source artwork unchanged and expose only the controls described in the spec. */
(function(){
 const cp=route=>({type:'cp-nav',dest:route});
 const go=route=>parent.postMessage(cp(route),location.origin);
 function announce(){parent.postMessage({type:'cp-size'},location.origin)}
 const is=n=>location.pathname.endsWith(n)||location.pathname.endsWith(({'01-perfil.html':'cartao-paulista.html','02-status-picker.html':'cp-status-picker.html','03-divisao-leaderboard.html':'cp-divisions.html','04-liga-empresas.html':'cp-liga.html','05-editar-perfil.html':'cp-edit.html'})[n]||n);
 // Demo changes can update these screens without changing their approved visual structure.
 const storageKey=name=>((parent.location.pathname.includes('/teste/')?'teste_':'')+name);
 let saved={};try{saved=JSON.parse(localStorage.getItem(storageKey('cartaoPaulista'))||'{}')}catch(_){}
 /* Embedded Crachá inherits the student, standalone mockups retain their fictional example. */
 try{if(parent.cartaoPaulistaIdentity)saved=Object.assign(parent.cartaoPaulistaIdentity(),saved)}catch(_){}
 if(saved.name&&is('01-perfil.html'))document.querySelector('.name').textContent=saved.name;
 if(saved.status&&is('01-perfil.html'))document.querySelector('.status-sticker').textContent=saved.status;
 if(is('01-perfil.html')&&'company' in saved)document.querySelector('.company .co').textContent=saved.company||'Sua empresa';
 if(is('01-perfil.html')&&'logo' in saved){const im=document.querySelector('.company>img');im.hidden=!saved.logo;im.alt='Logo da empresa';if(saved.logo)im.src=saved.logo;else im.removeAttribute('src')}
 if(saved.photo&&is('01-perfil.html'))document.querySelector('.frame img').src=saved.photo;
 if(saved.name&&is('05-editar-perfil.html'))document.querySelector('.field .val').textContent=saved.name;
 if('company' in saved&&is('05-editar-perfil.html')){document.querySelector('input').value=saved.company;document.querySelector('.upload b').textContent=saved.company||'Adicionar logo da empresa'}
 if(is('05-editar-perfil.html')&&'logo' in saved){const im=document.querySelector('.upload>img');im.hidden=!saved.logo;im.alt='Logo da empresa';if(saved.logo)im.src=saved.logo;else im.removeAttribute('src')}
 if(saved.photo&&is('05-editar-perfil.html'))document.querySelector('.avatar-edit>img').src=saved.photo;
 document.querySelector('.back')?.addEventListener('click',()=>go(is('05-editar-perfil.html')?'cartao-paulista':'profile'));
 document.querySelector('.tabbar') && [...document.querySelectorAll('.tabbar .tab')].forEach((b,i)=>b.addEventListener('click',()=>go(['home','practice','leagues','profile'][i])));
 document.querySelector('.right')?.addEventListener('click',()=>go(is('01-perfil.html')?'cp-edit':is('05-editar-perfil.html')?'cartao-paulista':'home'));
 // Mockups explicitly contain demonstration data, never real learners.
 if(is('03-divisao-leaderboard.html')){
   const b=document.querySelector('.banner');b.title='Pessoas, empresas e placares fictícios para demonstração de interface.';
   document.querySelector('.right')?.addEventListener('click',()=>go('cp-liga'));
 }
 if(is('04-liga-empresas.html'))document.querySelector('.hero-card .kicker').textContent+=' · exemplo fictício';
 if(is('01-perfil.html')){
   const ready=('company' in saved||'logo' in saved)?!!(String(saved.company||'').trim()&&String(saved.logo||'').trim()):!!document.querySelector('.company>img')?.getAttribute('src'),host=document.querySelector('.hero');host.dataset.companyReady=String(ready);
   const chip=document.querySelector('.company .rec');chip.dataset.companyState=ready?'on':'off';chip.textContent=ready?'Vestindo a camisa ✓':'Vista a camisa +';chip.title=ready?'Logo presente no cordão · editar empresa':'Adicionar empresa e logo ao cordão';
   document.querySelector('.status-sticker')?.addEventListener('click',()=>go('cp-status-picker'));
   document.querySelector('.divisao')?.addEventListener('click',()=>go('cp-divisions'));
   document.querySelector('.company')?.addEventListener('click',()=>go('cp-edit'));
 }
 if(is('02-status-picker.html')){
   const states=[...document.querySelectorAll('.st')];
   let savedStatus=null;try{savedStatus=JSON.parse(localStorage.getItem(storageKey('cartaoPaulista'))||'{}').status}catch(_){}
   if(savedStatus)states.forEach(el=>{el.classList.toggle('on',el.textContent.replace('✓','').trim()===savedStatus);if(el.classList.contains('on')&&!el.querySelector('.check'))el.insertAdjacentHTML('beforeend','<span class="check">✓</span>');else if(!el.classList.contains('on'))el.querySelector('.check')?.remove()});
   states.forEach(el=>el.addEventListener('click',()=>{
     states.forEach(x=>{x.classList.remove('on');x.querySelector('.check')?.remove()});
     el.classList.add('on');el.insertAdjacentHTML('beforeend','<span class="check">✓</span>');
     document.querySelector('.preview .txt').innerHTML='<b>Prévia no avatar</b>'+el.textContent.replace('✓','').trim()+' · Divisão Mirante';
   }));
   document.querySelector('.btn')?.addEventListener('click',()=>{
     const selected=states.find(x=>x.classList.contains('on'))?.textContent.replace('✓','').trim();
     parent.postMessage({type:'cp-profile',value:{status:selected}},location.origin);go('cartao-paulista')
   })
 }
 if(is('05-editar-perfil.html')){
   const fields=[...document.querySelectorAll('.field')];
   const name=fields[0].querySelector('.val');name.contentEditable='true';name.setAttribute('role','textbox');
   const company=document.querySelector('input');
   const upload=document.querySelector('.upload');
   let currentLogo=('logo' in saved)?saved.logo||'':upload.querySelector('img')?.getAttribute('src')||'';
   const fi=document.createElement('input');fi.type='file';fi.accept='image/png,image/svg+xml,image/jpeg,image/webp';fi.hidden=true;document.body.append(fi);
   const photo=document.createElement('input');photo.type='file';photo.accept='image/*';photo.hidden=true;document.body.append(photo);
   const setImage=(el,file,key)=>{if(!file||!file.type.startsWith('image/'))return;const r=new FileReader();r.onload=()=>{el.hidden=false;el.src=r.result;if(key==='cpLogo')currentLogo=r.result;parent.postMessage({type:'cp-filedata',key:key,data:r.result},location.origin)};r.readAsDataURL(file)};
   upload.addEventListener('click',()=>fi.click());fi.onchange=()=>setImage(upload.querySelector('img'),fi.files[0],'cpLogo');
   const photoButton=document.querySelector('.avatar-edit .g');photoButton.onclick=()=>photo.click();photo.onchange=()=>setImage(document.querySelector('.avatar-edit img'),photo.files[0],'cpPhoto');
   let avatarIndex=0;document.querySelector('.avatar-edit .p').onclick=()=>{avatarIndex=(avatarIndex+1)%4;const src=['marina-circle.png','sophia.png','erick.png','lili-3d.png'][avatarIndex];document.querySelector('.avatar-edit img').src='assets/'+src;};
   document.querySelector('.right').onclick=()=>{
     parent.postMessage({type:'cp-profile',value:{name:name.textContent.trim(),company:company.value,logo:currentLogo,photo:localStorage.getItem(storageKey('cpPhoto'))||''}},location.origin);go('cartao-paulista')
   };
   document.querySelectorAll('.sw').forEach(x=>x.addEventListener('click',()=>x.classList.toggle('off')));
 }
 announce();window.addEventListener('load',announce);
})();
