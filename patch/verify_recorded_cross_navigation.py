"""Switch between daily and library players without reloading the app; both must bind correctly."""
import os
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context();c.add_init_script("if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Aluno de verificação',criado:'2026-11-07'}))");q=c.new_page();q.goto(f'{O}/{base}/index.html#d-ouvir');q.locator('#d-ouvir #oPP').wait_for()
  for route,screen in [('ep~ep1','ep'),('d-ouvir','d-ouvir'),('ep~ep3','ep')]:
   q.evaluate('(r)=>location.hash=r',route);q.locator(f'#{screen} #oPP').wait_for();q.wait_for_function('(id)=>mergeTest.PL.ep?.id===id',arg='ep0' if route=='d-ouvir' else route.split('~')[1]);q.locator(f'#{screen} #oPP').click();q.wait_for_function('mergeTest.PL.audio.currentTime>.4',timeout=5000)
  c.close();print(base,'PASS daily → library → daily → another episode without page reload')
 b.close()
