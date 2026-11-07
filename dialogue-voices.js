/* Shared character voice policy. Web Speech exposes names/locales, NOT gender. */
(function (root) {
 'use strict';
 const female=/\b(female|samantha|zira|jenny|aria|emma|victoria|karen|ava|allison|susan|sara|hazel|moira|tessa|veena|joanna|salli|kimberly|kendra|ivy|sonia|libby|serena)\b/i;
 const male=/\b(male|guy|david|daniel|alex|aaron|fred|tom|andrew|rishi|davis|tony|ryan|christopher|brian|eric|george|james|oliver|liam|arthur|lee|oliver|matthew|justin|joey|russell)\b/i;
 const norm=s=>String(s||'').replace(/_/g,'-').toLowerCase();
 const key=v=>v?[v.name,norm(v.lang),v.voiceURI||''].join('|'):'';
 const gender=v=>female.test(v.name)?'f':male.test(v.name)?'m':null;
 const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function all(){try{return [...new Map(root.speechSynthesis.getVoices().filter(v=>/^en(?:-|_)/i.test(v.lang)).map(v=>[key(v),v])).values()]}catch(_){return []}}
 function character(ep,sp='E'){
  if(sp==='G'&&ep&&ep.guest)return {id:'guest-'+ep.guest.name.toLowerCase(),name:ep.guest.name,g:ep.guest.g,preferred:ep.guest.v};
  if(sp==='S'||/^sophia$/i.test(sp))return {id:'sophia',name:'Sophia',g:'f',preferred:'Jenny'};
  if(sp==='L'||/^lili$/i.test(sp))return {id:'lili',name:'Lili',g:'f',preferred:'Aria'};
  return {id:'erick',name:'Erick',g:'m',preferred:'Andrew'};
 }
 function saved(){try{return JSON.parse(root.localStorage.getItem('dialogue_voices_v1')||'{}')}catch(_){return {}}}
 function choose(c,vs,avoid){
  const explicit=vs.find(v=>key(v)===saved()[c.id]);if(explicit)return explicit;
  const preferred=String(c.preferred||'').replace(/^en-US-/,'').replace(/(?:Multilingual)?Neural$/,'').toLowerCase();
  return vs.slice().sort((a,b)=>score(b)-score(a)||key(a).localeCompare(key(b)))[0]||null;
  function score(v){const g=gender(v);return (g===c.g?1000:g?0:500)+(norm(v.lang)==='en-us'?200:0)+(key(v)!==key(avoid)?50:0)+(preferred&&v.name.toLowerCase().includes(preferred)?30:0)}
 }
 function pair(ep){const vs=all(),E=character(ep,'E'),G=character(ep,'G'),a=choose(E,vs),b=choose(G,vs,a);return {vs,E,G,a,b,same:!!a&&key(a)===key(b)}}
 function select(ep,sp='E'){
  const p=pair(ep),c=character(ep,sp),voice=sp==='E'?p.a:sp==='G'?p.b:choose(c,p.vs);
  const match=voice&&gender(voice)===c.g;
  // Real matching voices keep their natural pitch. One-voice/opaque-name engines
  // get a modest character-specific fallback; pitch cannot manufacture a male voice.
  let pitch=match?1:c.g==='m'?.82:1.14;
  if(p.same&&(sp==='E'||sp==='G'))pitch=sp==='E'?.86:c.g==='m'?1.04:1.14;
  return {voice,pitch,lang:voice?voice.lang.replace(/_/g,'-'):'en-US',character:c,identified:!!match};
 }
 let settled=false,pending=null;
 function ready(){
  if(all().length||settled||!root.speechSynthesis)return Promise.resolve();
  if(pending)return pending;
  pending=new Promise(resolve=>{let interval,timer;
   const finish=()=>{clearInterval(interval);clearTimeout(timer);root.speechSynthesis.removeEventListener?.('voiceschanged',check);settled=true;resolve()};
   const check=()=>{if(all().length)finish()};
   root.speechSynthesis.addEventListener?.('voiceschanged',check);interval=setInterval(check,50);timer=setTimeout(finish,900);check();
  });return pending;
 }
 function apply(u,ep,sp){const v=select(ep,sp);if(v.voice)u.voice=v.voice;u.lang=v.lang;u.pitch=v.pitch;return u}
 function azure(ep,sp){const c=character(ep,sp);if(sp==='G'&&ep&&ep.guest)return [ep.guest.v,c.g==='m'?'en-US-GuyNeural':'en-US-JennyNeural'];if(c.g==='f')return [c.id==='lili'?'en-US-AriaNeural':'en-US-JennyNeural','en-US-EmmaNeural'];return ['en-US-AndrewMultilingualNeural','en-US-AndrewNeural','en-US-GuyNeural']}
 function html(ep,mode){
  if(mode==='audio')return '<p class="dv-status o-sm o-mut">Vozes neurais por personagem · Erick'+(ep.guest?' + '+escape(ep.guest.name):'')+'</p>';
  const speakers=ep.guest?['E','G']:['E'],p=pair(ep),limited=speakers.some(sp=>!select(ep,sp).identified)||(ep.guest&&p.same);
  return '<details class="dv-settings" style="margin:12px 0"><summary style="font-size:13px;cursor:pointer">Vozes do diálogo · neste aparelho</summary><p class="dv-status o-sm o-mut">'+(limited?'O aparelho não oferece duas vozes identificáveis adequadas. Usamos contraste de tom quando necessário; isso não substitui uma voz masculina/feminina. Você pode escolher uma voz abaixo ou instalar vozes em inglês no sistema.':'Vozes distintas por personagem, com preferência por inglês americano.')+'</p>'+speakers.map(sp=>'<label style="display:block;margin:10px 0;font-size:13px">'+escape(character(ep,sp).name)+' <select data-dv-speaker="'+sp+'" aria-label="Voz de '+escape(character(ep,sp).name)+'" style="width:100%;min-height:44px;margin-top:5px"><option value="">Automática</option>'+p.vs.map(v=>'<option value="'+escape(key(v))+'"'+(saved()[character(ep,sp).id]===key(v)?' selected':'')+'>'+escape(v.name+' · '+v.lang)+'</option>').join('')+'</select><button type="button" class="o-btn" style="margin-top:5px" data-dv-preview="'+sp+'">Ouvir '+escape(character(ep,sp).name)+'</button></label>').join('')+'</details>';
 }
 function bind(box,ep,preview){box.querySelectorAll('[data-dv-speaker]').forEach(el=>el.onchange=()=>{const v=saved(),id=character(ep,el.dataset.dvSpeaker).id;if(el.value)v[id]=el.value;else delete v[id];try{root.localStorage.setItem('dialogue_voices_v1',JSON.stringify(v))}catch(_){}preview(el.dataset.dvSpeaker)});box.querySelectorAll('[data-dv-preview]').forEach(el=>el.onclick=()=>preview(el.dataset.dvPreview))}
 // Ask for the device roster early. ready() also handles older Safari without voiceschanged.
 try{root.speechSynthesis?.getVoices()}catch(_){}
 root.SplaDialogueVoices={all,character,select,ready,apply,azure,html,bind};
})(typeof window==='undefined'?globalThis:window);
