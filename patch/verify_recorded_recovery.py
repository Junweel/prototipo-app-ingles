"""Actual recording playback with no speech engine; file failure must offer retry, not female fallback."""
import os
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context();c.add_init_script("Object.defineProperty(window,'speechSynthesis',{value:undefined});window.SpeechSynthesisUtterance=undefined;if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Aluno de verificação',criado:'2026-11-07'}))")
  q=c.new_page();errs=[];q.on('pageerror',lambda e:errs.append(str(e)));q.route('**/ep0.mp3',lambda r:r.abort());q.goto(f'{O}/{base}/index.html#d-ouvir');q.locator('#oAudioRetry').wait_for();assert q.evaluate('mergeTest.PL.mode')=='error'
  q.unroute('**/ep0.mp3');q.locator('#oAudioRetry').click();q.locator('#oPP').wait_for();q.locator('#oPP').click();q.wait_for_function('mergeTest.PL.audio.currentTime>.4');assert not errs,errs;q.close()
  q=c.new_page();q.on('pageerror',lambda e:errs.append(str(e)));q.goto(f'{O}/{base}/index.html#chat~texto');button=q.locator('#chat [data-recorded-line]').first;button.wait_for();file=button.get_attribute('data-recorded-line');q.route('**/'+file,lambda r:r.abort());button.click();q.locator('#recordedAudioStatus').wait_for(timeout=2500);assert 'áudio gravado' in q.locator('#recordedAudioStatus').inner_text();assert not errs,errs;c.close();print(base,'PASS no device TTS needed; failed real file → explicit retry → actual MP3 plays')
 b.close()
