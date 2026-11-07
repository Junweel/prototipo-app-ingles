import os
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context();c.add_init_script("if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Aluno de verificação',criado:'2026-11-07'}))");q=c.new_page();q.goto(f'{O}/{base}/index.html#chat~texto');a=q.locator('[data-recorded-widget="hotel-chat"] audio');q.locator('[data-recorded-widget="hotel-chat"] p').click();a.evaluate('a=>a.play()');q.wait_for_function('document.querySelector("[data-recorded-widget=hotel-chat] audio").currentTime>.2');q.locator('#chat [data-recorded-line]').first.click();assert a.evaluate('a=>a.paused'),'individual line must pause the full conversation';c.close();print(base,'PASS replaying a line cannot overlap the complete dialogue')
 b.close()
