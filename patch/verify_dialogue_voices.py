"""Browser speech-engine simulation: test app routing/utterances, not audible OS quality."""
import os,json
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
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
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  for ep,male in [('ep3',True),('ep5',True),('ep0',False),('ep1',False),('ep2',False),('ep4',False)]:
   c=b.new_context(viewport={'width':390,'height':844});c.add_init_script(stub(VOICES));q=c.new_page();q.set_default_timeout(6000);errs=[];q.on('pageerror',lambda e:errs.append(str(e)))
   q.goto(f'{O}/{base}/index.html#ep~{ep}');q.locator('#oPP').wait_for();q.locator('#oPP').click();q.wait_for_function('voiceCalls.length>=1');first=q.evaluate('voiceCalls[0]');assert first['voice'] in ['Daniel','Alex'],(base,ep,'Erick male',first)
   q.locator('#oScrub').evaluate("e=>{e.value=mergeTest.PL.lines[1].start;e.dispatchEvent(new Event('input'));e.dispatchEvent(new Event('change'))}")
   q.wait_for_function('voiceCalls.length>=2');second=q.evaluate('voiceCalls.at(-1)');expected=['Daniel','Alex'] if male else ['Samantha','Karen'];assert second['voice'] in expected,(base,ep,'guest gender',second)
   assert second['voice']!=first['voice'],(base,ep,'distinct voices')
   q.locator('#oPP').click();n=q.evaluate('voiceCalls.length');q.wait_for_timeout(450);assert q.evaluate('voiceCalls.length')==n,'pause must stop sequence'
   assert not errs,errs;c.close()
  print(base,'PASS all six two-speaker episodes: Erick male, female/male guest, distinct IDs, pause')
  for voices,delay in [(VOICES,250),([VOICES[0]],0),([],0)]:
   c=b.new_context();c.add_init_script(stub(voices,delay));q=c.new_page();q.goto(f'{O}/{base}/index.html#d-ouvir');q.locator('#oPP').wait_for();q.locator('#oPP').click();q.wait_for_function('voiceCalls.length>=1');first=q.evaluate('voiceCalls[0]')
   if delay:assert first['voice'] in ['Daniel','Alex'],(base,'async voices',first)
   q.locator('#oScrub').evaluate("e=>{e.value=mergeTest.PL.lines[1].start;e.dispatchEvent(new Event('input'));e.dispatchEvent(new Event('change'))}");q.wait_for_function('voiceCalls.length>=2');second=q.evaluate('voiceCalls.at(-1)')
   if len(voices)<=1:assert first['pitch']<second['pitch'],(base,'same-voice pitch fallback',first,second)
   q.locator('.dv-settings > summary').click();assert q.locator('.dv-status').inner_text()
   c.close()
  print(base,'PASS delayed voices and honest single/no-voice fallback')
 b.close()
