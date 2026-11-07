import os
from playwright.sync_api import sync_playwright
ORIGIN=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844});q=c.new_page();q.set_default_timeout(6000);errors=[];bad=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  q.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  q.on('response',lambda r:bad.append(f'{r.status} {r.url}') if r.status>=400 else None)
  u=f'{ORIGIN}/{base}/';q.goto(u+'?novo=1');q.locator('#pa-landing').wait_for()
  assert q.locator('#welcome .foot [data-go="onboard"]').count()==1
  q.locator('#pa-original>summary').click();q.locator('#pa-original .trio img').wait_for();assert q.locator('#pa-original .trio img').evaluate('i=>i.complete && i.naturalWidth>0')
  for route in ['welcome','onboard','placement','turma','plan']:
   q.goto(u+'?novo=1#'+route);q.locator('#'+route+'.on').wait_for()
   assert q.evaluate('document.documentElement.scrollWidth===innerWidth'),(base,route,'page overflow')
  # Completed flags are namespace scoped; legacy settings/data must not leak to the other variant.
  q.evaluate("""()=>{localStorage.setItem('perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-07'}));localStorage.setItem('spla_onboarded_v1',JSON.stringify({completed:true,version:1,plan:{known:true},liga:true}));localStorage.setItem('sophiaCfg',JSON.stringify({sentinel:'not-a-credential'}))}""")
  q.goto(u);q.locator('#practice.on').wait_for()
  assert q.locator('.cpi-nodeitem.is-current').count()==1 and q.locator('.cpi-nodeitem.is-locked').count()==4
  q.goto(u+'#profile');q.locator('#pa-review>summary').click();q.locator('#pa-configure').click();q.locator('#pa-setup.on').wait_for()
  assert q.evaluate('document.documentElement.scrollWidth===innerWidth')
  # Logo validation rejects the sample text before any read or storage.
  q.locator('#pa-logo').set_input_files({'name':'not-an-image.txt','mimeType':'text/plain','buffer':b'not an image'})
  assert 'Escolha PNG' in q.locator('#pa-logo-status').inner_text()
  assert q.locator('#pa-finish').is_disabled()
  q.goto(u+'#practice');q.locator('.cpi-practicebar').wait_for()
  q.emulate_media(reduced_motion='reduce');assert q.locator('.cpi-nodeitem.is-current .cpi-step').evaluate("e=>getComputedStyle(e).animationName")=='none'
  assert q.evaluate("JSON.parse(localStorage.getItem('sophiaCfg')).sentinel")=='not-a-credential'
  assert not errors,errors;assert not bad,bad
  print(base,'PASS preserved intro, assets/errors, overflow, motion, invalid file, config isolation')
  c.close()
 # Same-origin main vs teste actual storage separation (not a presumption about patched keys).
 c=b.new_context();q=c.new_page();q.goto(f'{ORIGIN}/v6/?novo=1');q.evaluate("localStorage.setItem('spla_onboarded_v1',JSON.stringify({completed:true}))")
 q.goto(f'{ORIGIN}/teste/?novo=1');assert q.evaluate("localStorage.getItem('spla_onboarded_v1')") is None
 q.evaluate("localStorage.setItem('spla_onboarded_v1',JSON.stringify({completed:false}))")
 q.goto(f'{ORIGIN}/v6/');assert q.evaluate("JSON.parse(localStorage.getItem('spla_onboarded_v1')).completed")
 print('PASS shared-origin v6/teste flag isolation')
 b.close()
