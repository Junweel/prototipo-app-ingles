"""Actual MP3 files/decoder/network. No synthesized mocks, fixture WAVs or fake voices."""
import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765');OUT=Path('/workspace/voice-evidence-live');OUT.mkdir(exist_ok=True)
M=json.loads(Path('audio/dialogues/20261107-neural-v1/manifest.json').read_text())
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844});c.add_init_script("window.fallbackSpeechCalls=0;if(window.speechSynthesis){speechSynthesis.speak=()=>{fallbackSpeechCalls++};speechSynthesis.getVoices=()=>[{name:'Samantha',lang:'en-US',voiceURI:'Samantha'}]};if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Aluno de verificação',criado:'2026-11-07'}))")
  errors=[]
  for i in range(7):
   q=c.new_page();q.set_default_timeout(10000);q.on('pageerror',lambda e:errors.append(str(e)));q.goto(f'{O}/{base}/index.html#ep~ep{i}');q.locator('#oPP').wait_for();d=M['dialogues'][f'ep{i}']
   assert q.evaluate('mergeTest.PL.recorded') and q.evaluate('mergeTest.PL.mode')=='audio'
   q.wait_for_function('Number.isFinite(mergeTest.PL.audio.duration)');assert abs(q.evaluate('mergeTest.PL.audio.duration')-d['duration'])<.08
   q.locator('#oPP').click();q.wait_for_function('mergeTest.PL.audio.currentTime>.4');q.locator('#oPP').click();assert q.evaluate('fallbackSpeechCalls')==0;q.close()
  q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(f'{O}/{base}/index.html#d-ouvir');q.locator('#oPP').wait_for();q.locator('#oToGist').click()
  for i in range(2):q.locator(f'[data-q="{i}"][data-o="0"]').click()
  q.locator('#oToTr').click()
  for i in range(5):
   q.locator('#oTrSkip').click()
   if i==0:
    q.locator('#oTrSlow').click();assert q.evaluate('mergeTest.PL.audio.playbackRate')==.75
    ep=q.evaluate('mergeTest.EPS[0]');chunk=ep['tr'][0][2][0][0];clip=M['utterances']['ana|'+chunk]['file']
    with q.expect_request('**/'+clip):q.locator('#oTrChunk').click()
   if i==3:assert 'cúdja' in q.locator('.o-pl').inner_text()
   q.locator('#oTrNext').click()
  q.locator('#oLyr p').nth(1).click();q.wait_for_timeout(150);assert q.locator('#oLyr p.on').get_attribute('data-i')=='1';assert abs(q.evaluate('mergeTest.PL.audio.currentTime')-M['dialogues']['ep0']['lines'][1]['start'])<.5
  q.locator('#oPP').click();q.screenshot(path=str(OUT/f'{base}-real-mp3-com-letra.png'),full_page=True);assert q.evaluate('fallbackSpeechCalls')==0;q.close()
  for route,widget in [('chat~texto','hotel-chat'),('d-transcript','daily-transcript-example'),('m-talk~texto','mark-roleplay')]:
   q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(f'{O}/{base}/index.html#{route}');a=q.locator(f'[data-recorded-widget="{widget}"] audio');a.wait_for();q.wait_for_function('(id)=>document.querySelector(`[data-recorded-widget="${id}"] audio`).src.includes("neural-v1")',arg=widget)
   line=q.locator('[data-recorded-line]:visible').first;line.click();a.evaluate('a=>a.play()');q.wait_for_function('(id)=>document.querySelector(`[data-recorded-widget="${id}"] audio`).currentTime>.4',arg=widget);a.evaluate('a=>a.pause()');q.screenshot(path=str(OUT/f'{base}-real-{widget}.png'),full_page=True);assert q.evaluate('fallbackSpeechCalls')==0;q.close()
  q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(f'{O}/{base}/index.html#input');q.locator('#input .player .pp').click();q.wait_for_function('document.querySelector("#input .player audio").currentTime>.4');q.close()
  assert not errors,errors;c.close();print(base,'PASS seven actual MP3 episodes; questions/chunks/slow/lyrics/cúdja; four legacy conversations; single female system voice cannot affect playback; no JS errors')
 b.close()
