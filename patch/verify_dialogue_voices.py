"""Browser speech-engine simulation: test app routing/utterances, not audible OS quality."""
import os,json
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
from dialogue_speech_fixture import VOICES,stub
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  for ep,male in [('ep3',True),('ep5',True),('ep0',False),('ep1',False),('ep2',False),('ep4',False)]:
   c=b.new_context(viewport={'width':390,'height':844});c.add_init_script(stub(VOICES));q=c.new_page();q.set_default_timeout(6000);errs=[];q.on('pageerror',lambda e:errs.append(str(e)))
   q.goto(f'{O}/{base}/index.html#ep~{ep}');q.locator('#oPP').wait_for();q.locator('#oPP').click();q.wait_for_function('voiceCalls.length>=1');first=q.evaluate('voiceCalls[0]');assert first['voice'] in ['Daniel','Alex'],(base,ep,'Erick male',first)
   q.locator('#oScrub').evaluate("e=>{e.value=mergeTest.PL.lines[1].start;e.dispatchEvent(new Event('input'));e.dispatchEvent(new Event('change'))}")
   q.wait_for_function('voiceCalls.length>=2');second=q.evaluate('voiceCalls.at(-1)');expected=['Daniel','Alex'] if male else ['Samantha','Karen'];assert second['voice'] in expected,(base,ep,'guest gender',second)
   assert second['voice']!=first['voice'],(base,ep,'distinct voices')
   az=q.evaluate('SplaDialogueVoices.azure(mergeTest.PL.ep,"G")');assert ('en-US-GuyNeural' if male else 'en-US-JennyNeural') in az,(base,ep,'Azure guest gender',az)
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
  c=b.new_context();c.add_init_script(stub(VOICES));q=c.new_page();q.goto(f'{O}/{base}/index.html#ep~ep0');q.locator('#oPP').wait_for();q.locator('#oPP').click();q.wait_for_function('mergeTest.EF.heardOnce',timeout=25000)
  lines=q.evaluate('mergeTest.EPS[0].lines');calls=q.evaluate('voiceCalls');assert len(calls)==len(lines),(base,len(calls),len(lines))
  for line,call in zip(lines,calls):
   assert line[1]==call['text'];assert call['voice'] in (['Daniel','Alex'] if line[0]=='E' else ['Samantha','Karen']),(base,line,call)
  c.close();print(base,'PASS complete 16-line dialogue plays sequentially with every speaker alternation')
 b.close()
