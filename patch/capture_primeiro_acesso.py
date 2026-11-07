import os,json
from pathlib import Path
from datetime import datetime,timezone,timedelta
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/onboarding-capa/screenshots';OUT.mkdir(parents=True,exist_ok=True)
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844});q=c.new_page();q.set_default_timeout(7000);u=f'{O}/{base}/'
  q.goto(u+'?novo=1');q.locator('#pa-landing').wait_for();q.screenshot(path=str(OUT/f'{base}-capa.png'))
  q.locator('#welcome>.scroll').evaluate("e=>e.scrollTop+=e.querySelector('.pa-method').getBoundingClientRect().top-e.getBoundingClientRect().top-8");q.screenshot(path=str(OUT/f'{base}-capa-metodologia.png'))
  q.locator('#welcome .foot [data-go="onboard"]').click();q.locator('#tNome' if base=='teste' else '#pa-nome').fill('Ana Teste' if base=='teste' else 'Joël')
  for screen in ['onboard','placement','turma','plan']:q.locator(f'#{screen} .foot [data-go]').click()
  q.locator('#pa-liga').check();q.locator('#pa-logo').set_input_files(str(ROOT/'cartao-paulista/assets/logo-nexa.png'));q.locator('#pa-company').fill('Nexa Logística');q.locator('#pa-finish').wait_for();q.wait_for_function("!document.querySelector('#pa-finish').disabled");q.screenshot(path=str(OUT/f'{base}-configuracao.png'));q.locator('#pa-finish').click()
  q.locator('#practice.on').wait_for();q.locator('.is-current button').click()
  # Complete the original warm-up through its real UI. The resulting check is earned in this isolated demo browser.
  for _ in range(3):q.locator('#wshow').click();q.locator('.wr').nth(2).click()
  q.locator('#wnext').click();q.locator('#oToGist').wait_for()
  # Return via bare entry URL, not a hash or script-selected trail.
  q.goto(u);q.locator('#practice.on').wait_for();assert q.locator('.is-done').count()==1;assert q.locator('.is-current').get_attribute('data-step')=='ep'
  q.screenshot(path=str(OUT/f'{base}-retorno-trilha.png'))
  q.goto(u+'#profile');q.locator('#pa-review>summary').click();q.screenshot(path=str(OUT/f'{base}-perfil-rever.png'))
  assert q.evaluate('document.documentElement.scrollWidth===390')
  print(base,'captured landing, methodology, setup, real returning trail and Profile replay')
  c.close()
 b.close()
(OUT/'origem.json').write_text(json.dumps({'origem':O,'capturadoEm':datetime.now(timezone(timedelta(hours=-3))).isoformat(),'viewport':'390x844','nota':'Retorno após concluir o cadastro e o aquecimento original em navegador de teste isolado; sem injetar etapas concluídas.'},ensure_ascii=False,indent=2)+'\n')
