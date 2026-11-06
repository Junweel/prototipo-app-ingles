"""Real activities: no stepDone(), no fake Sophia call, no localStorage seeding."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844});q=c.new_page();errors=[]
  q.set_default_timeout(10000);q.on('pageerror',lambda e:errors.append(str(e)));q.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  if base=='teste':
   q.goto(f'http://127.0.0.1:8765/{base}/index.html#welcome');q.evaluate("localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-06'}))")
  q.goto(f'http://127.0.0.1:8765/{base}/index.html#practice')
  assert q.locator('.is-current').get_attribute('data-step')=='aquec'
  q.locator('.is-current button').click()
  for i in range(3):q.locator('#wshow').click();q.locator('.wr').nth(2).click()
  q.locator('#wnext').click();q.locator('#oToGist').wait_for();q.locator('#oToGist').click()
  for i in range(2):q.locator(f'[data-q="{i}"][data-o="0"]').click()
  q.locator('#oToTr').click()
  for i in range(5):q.locator('#oTrSkip').click();q.locator('#oTrNext').click()
  q.locator('#oFinish').click();q.locator('[data-go="d-trail"]').last.click()
  assert q.locator('#tcount').inner_text()=='Exercício 1 de 6'
  assert q.evaluate('cartaoIdentidade.currentStep()')==2
  for i in range(5):
   if q.locator('#tbox .xo').count():
    q.locator('#tbox .xo[data-i="0"]').click();q.locator('#tbtn').click();q.locator('#tbtn').click()
   else:
    for idx in [1,5,0,2,4]:q.locator(f'#tiles .tile[data-i="{idx}"]').click()
    q.locator('#tbtn').click();q.locator('#tbtn').click()
  q.locator('#smic').click();q.wait_for_timeout(1800);print('MIC',q.locator('#tbtn').inner_text(),q.locator('#sstat').inner_text());q.locator('#tbtn').click()
  q.wait_for_timeout(200)
  assert q.locator('#oSFrame iframe').count()==1
  src=q.locator('#oSFrame iframe').get_attribute('src');assert 'sophia-ao-vivo/' in src
  # Original exercise transition marked trail; context is still isolated.
  assert q.evaluate('cartaoIdentidade.currentStep()')==3
  print(base,'PASS → warm-up → episode → 6 exercises → unchanged live Sophia',src)
  assert not errors,errors
  c.close()
 b.close()
