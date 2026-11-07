"""Verify real static MP3 playback; no mocked TTS, no fake audio responses."""
import os
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844});c.add_init_script("window.fallbackSpeechCalls=0;if(window.speechSynthesis)speechSynthesis.speak=()=>{fallbackSpeechCalls++};if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Aluno de verificação',criado:'2026-11-07'}))")
  q=c.new_page();q.goto(f'{O}/{base}/index.html#d-ouvir');q.locator('#oPP').wait_for()
  assert q.evaluate('mergeTest.PL.mode')=='audio',(base,'must play actual two-voice audio, not device synthesis')
  src=q.evaluate('mergeTest.PL.audio.src');assert '.mp3' in src and 'neural' in src,src
  q.locator('#oPP').click();q.wait_for_function('mergeTest.PL.audio.currentTime>1');q.locator('#oPP').click()
  assert q.evaluate('fallbackSpeechCalls')==0
  assert q.evaluate('mergeTest.PL.audio.preservesPitch')
  c.close();print(base,'PASS real versioned MP3 plays without Web Speech:',src)
 b.close()
