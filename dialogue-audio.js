/* Real, versioned neural recordings shared by /v6/ and /teste/. No device TTS. */
(function(root){
 'use strict';
 const version='20261107-neural-v1';
 const base=new URL('./audio/dialogues/'+version+'/',document.currentScript.src);
 let pending,active=null,finishActive=null;
 function ready(){if(!pending)pending=fetch(new URL('manifest.json',base),{cache:'reload'}).then(r=>{if(!r.ok)throw Error('Manifesto de áudio HTTP '+r.status);return r.json()}).then(m=>{if(m.version!==version)throw Error('Versão de áudio incompatível');return m}).catch(e=>{pending=null;throw e});return pending}
 const url=file=>new URL(file,base).href;
 function stop(){if(active){active.pause();active.currentTime=0;active=null}if(finishActive){finishActive(false);finishActive=null}}
 function playURL(src,rate=1){stop();return new Promise((resolve,reject)=>{const a=new Audio(src);active=a;finishActive=resolve;a.playbackRate=+rate||1;a.preservesPitch=true;const done=()=>{if(active===a){active=null;finishActive=null}resolve(true)};a.onended=done;a.onerror=()=>{done();reject(Error('Não foi possível carregar o áudio gravado.'))};a.play().catch(e=>{done();reject(e)})})}
 async function speak(text,speaker='erick',rate=1){const m=await ready(),u=m.utterances[speaker+'|'+String(text).trim()];if(!u)return false;await playURL(url(u.file),rate);return true}
 async function episode(ep){const m=await ready(),d=m.dialogues[ep.id];if(!d||d.lines.length!==ep.lines.length||d.lines.some((l,i)=>l.text!==ep.lines[i][1]))throw Error('Áudio e texto do episódio não conferem');return {...d,url:url(d.file)}}
 function status(message){let el=document.getElementById('recordedAudioStatus');if(!el){el=document.createElement('p');el.id='recordedAudioStatus';el.setAttribute('role','status');el.style.cssText='position:fixed;left:16px;right:16px;bottom:88px;background:#0b1119;color:#fff;padding:14px;border-radius:10px;z-index:9999';document.body.appendChild(el)}el.textContent=message;clearTimeout(status.timer);status.timer=setTimeout(()=>el.remove(),6000)}
 function widget(host,id,title){if(!host||document.querySelector('[data-recorded-widget="'+id+'"]'))return;const box=document.createElement('div');box.className='card recorded-widget';box.dataset.recordedWidget=id;box.style.cssText='margin:10px 16px;padding:12px;flex:none';const label=document.createElement('p');label.className='small';label.style.margin='0 0 8px';label.textContent=title+' · exemplo gravado, não é a sua voz';const a=document.createElement('audio');a.controls=true;a.preload='none';a.style.cssText='width:100%;height:44px';a.setAttribute('aria-label',title);box.append(label,a);host.prepend(box);ready().then(m=>{a.src=url(m.dialogues[id].file)}).catch(e=>status(e.message))}
 function decorate(){
  const groups=[['#chat .msg','hotel-chat'],['#tk .msg','mark-roleplay'],['#tcard .tl','daily-transcript-example']];
  ready().then(m=>groups.forEach(([selector,id])=>document.querySelectorAll(selector).forEach(el=>{
   if(el.querySelector('[data-recorded-line]'))return;const clone=el.cloneNode(true);clone.querySelectorAll('.tools,.tapfb,.wh').forEach(x=>x.remove());const text=clone.textContent.trim(),d=m.dialogues[id],line=d.lines.find(l=>l.text===text);if(!line)return;
   const b=document.createElement('button');b.type='button';b.className='lbtn';b.dataset.recordedLine=line.file;b.style.cssText='display:block;min-height:44px;margin-top:6px';b.textContent='▶ Ouvir fala';b.setAttribute('aria-label','Ouvir '+(line.speaker==='learner'?'aluno de exemplo':line.speaker));el.appendChild(b);
   // Previously inert replay buttons gain the same real per-line audio.
   el.querySelectorAll('.tools button').forEach(old=>{if(old.hasAttribute('data-say'))return;if(old.textContent.trim()==='PT')return;old.dataset.recordedLine=line.file;if(old.textContent.includes('0,7'))old.dataset.recordedRate='.7'});
  }))).catch(()=>{})
 }
 function mount(){
  widget(document.querySelector('#chat .chat'),'hotel-chat','Sophia e aluno: quarto errado');
  widget(document.getElementById('m-talk'),'mark-roleplay','Mark e aluno: atraso na entrega');
  widget(document.querySelector('#d-transcript .scroll'),'daily-transcript-example','Sophia e aluno: status do projeto');
  const player=document.querySelector('#input .player');if(player&&!player.dataset.recordedReady){player.dataset.recordedReady='1';const a=document.createElement('audio');a.preload='none';player.appendChild(a);ready().then(m=>{const d=m.dialogues.room512;a.src=url(d.file);const pp=player.querySelector('.pp'),buttons=player.querySelectorAll('.o-ctl button');pp.setAttribute('aria-label','Ouvir ou pausar conversa');pp.innerHTML='▶';pp.onclick=()=>a.paused?a.play().catch(e=>status(e.message)):a.pause();if(buttons[0])buttons[0].onclick=()=>a.currentTime=Math.max(0,a.currentTime-15);if(buttons[2])buttons[2].onclick=()=>a.currentTime=Math.min(a.duration||d.duration,a.currentTime+15);a.ontimeupdate=()=>{const spans=player.querySelectorAll('.row.between.small span'),time=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');if(spans[0])spans[0].textContent=time(a.currentTime);if(spans[1])spans[1].textContent=time(d.duration);const bar=player.querySelector('.o-mbar i');if(bar)bar.style.width=(a.currentTime/d.duration*100)+'%'};a.onplay=()=>{stop();pp.innerHTML='Ⅱ'};a.onpause=()=>pp.innerHTML='▶';a.onended=a.onpause;a.ontimeupdate();const label=player.querySelector('.o-mrow .small');if(label)label.textContent='2 vozes neurais gravadas · inglês americano';}).catch(e=>status(e.message))}
  const roleplay=document.querySelector('[data-recorded-widget="mark-roleplay"]');if(roleplay)roleplay.hidden=location.hash!=='#m-talk~texto';
  decorate();const tk=document.getElementById('tk');if(tk&&!tk.dataset.recordedObserved){tk.dataset.recordedObserved='1';new MutationObserver(()=>decorate()).observe(tk,{childList:true})}
  document.querySelectorAll('audio').forEach(a=>{if(!a.dataset.recordedExclusive){a.dataset.recordedExclusive='1';a.addEventListener('play',()=>{document.querySelectorAll('audio').forEach(other=>{if(other!==a)other.pause()})})}})
 }
 document.addEventListener('click',e=>{const b=e.target.closest('[data-recorded-line]');if(!b)return;e.preventDefault();e.stopPropagation();playURL(url(b.dataset.recordedLine),b.dataset.recordedRate||1).catch(e=>status(e.message))},true);
 root.addEventListener('hashchange',()=>{stop();document.querySelectorAll('audio').forEach(a=>a.pause());setTimeout(mount,0)});
 root.addEventListener('pagehide',stop);
 document.addEventListener('DOMContentLoaded',mount);
 root.SplaDialogueAudio={version,ready,episode,speak,stop,url,playURL};ready().catch(()=>{});
})(window);
