"""Play the complete real EP0 at 1x in both apps. No seeking, fake TTS or audio fixtures."""
import os,time
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch();pages=[];errors=[]
 for base in ['v6','teste']:
  c=b.new_context();c.add_init_script("window.deviceSpeechCalls=0;if(window.speechSynthesis)speechSynthesis.speak=()=>deviceSpeechCalls++;if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Aluno de verificação',criado:'2026-11-07'}))");q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(f'{O}/{base}/index.html#d-ouvir');q.locator('#oPP').wait_for();q.locator('#oPP').click();pages.append((base,q,time.monotonic()))
 for base,q,start in pages:
  q.wait_for_function('mergeTest.PL.audio.ended',timeout=90000);assert q.evaluate('mergeTest.PL.audio.playbackRate')==1;assert q.evaluate('mergeTest.EF.heardOnce');assert q.evaluate('deviceSpeechCalls')==0
  assert time.monotonic()-start>=q.evaluate('mergeTest.PL.dur')-.5
  print(base,'PASS entire real EP0 at 1x, no seek, natural end, duration',q.evaluate('mergeTest.PL.dur'),flush=True)
 assert not errors,errors;b.close()
