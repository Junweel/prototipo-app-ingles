"""Do not require media preloading before a phone can display the Play button.
The request is delayed, then continued unchanged; no fake MP3/response is used.
"""
import os
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context();c.add_init_script("if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Aluno de verificação',criado:'2026-11-07'}))");q=c.new_page();held=[];q.route('**/ep0.mp3',lambda r:held.append(r));q.goto(f'{O}/{base}/index.html#d-ouvir',wait_until='domcontentloaded')
  q.locator('#oPP').wait_for(timeout=2500);assert q.locator('#oScrub').count()==1
  q.wait_for_function('mergeTest.PL.audio!==null')
  for r in held:r.continue_()
  q.unroute('**/ep0.mp3');q.locator('#oPP').click();q.wait_for_function('mergeTest.PL.audio.currentTime>.4');c.close();print(base,'PASS Play ready without preload; original MP3 plays after delayed network is released')
 b.close()
