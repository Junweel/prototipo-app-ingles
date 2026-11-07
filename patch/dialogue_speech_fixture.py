import json
VOICES=[{'name':n,'lang':lang,'voiceURI':n,'localService':True,'default':i==0} for i,(n,lang) in enumerate([('Samantha','en-US'),('Daniel','en-US'),('Alex','en-US'),('Karen','en-US')])]
def stub(voices,delay=0):
 return '''(()=>{
 const voices=VOICES,delay=DELAY;let live=delay?[]:voices,utterance=null,timer=null;
 window.voiceCalls=[];window.voiceCancels=0;
 class U{constructor(t){this.text=t;this.voice=null;this.pitch=1;this.rate=1}}
 const synth=new EventTarget();Object.assign(synth,{speaking:false,pending:false,paused:false,getVoices:()=>live,
 speak:u=>{utterance=u;synth.speaking=true;window.voiceCalls.push({text:u.text,voice:u.voice?.name||null,pitch:u.pitch,rate:u.rate,lang:u.lang});timer=setTimeout(()=>{synth.speaking=false;u.onend?.()},350)},
 cancel:()=>{window.voiceCancels++;clearTimeout(timer);synth.speaking=false;utterance?.onerror?.({error:'canceled'});utterance=null},pause:()=>{},resume:()=>{}});
 Object.defineProperty(window,'speechSynthesis',{value:synth,configurable:true});window.SpeechSynthesisUtterance=U;
 if(delay)setTimeout(()=>{live=voices;synth.dispatchEvent(new Event('voiceschanged'))},delay);
 if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-07'}));
 })()'''.replace('VOICES',json.dumps(voices)).replace('DELAY',str(delay))
