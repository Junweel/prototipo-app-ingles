import os
ORIGIN=os.environ.get("VERIFY_ORIGIN","http://127.0.0.1:8765")
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);q=b.new_page(viewport={'width':390,'height':844})
 for base,test in [('v6',False),('teste',True)]:
  errs=[];missing=[];track=[]
  q.on('pageerror',lambda e:errs.append(str(e)))
  q.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  q.goto(f'{ORIGIN}/{base}/index.html?fullpass=1#welcome')
  if test:q.evaluate("localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-06'}))")
  q.reload();q.wait_for_timeout(400)
  q.evaluate('''()=>{window.rcalled=[];const f=window.onShowMerge;window.onShowMerge=(...a)=>{window.rcalled.push(a);return f(...a)}}''')
  for ident in ['d-call','m-talk']:
   q.evaluate("id=>location.hash=id",ident);q.wait_for_timeout(500)
   assert q.locator('#oSFrame iframe').count()==1,(base,ident)
   src=q.locator('#oSFrame iframe').get_attribute('src'); print('CALL OK',base,src)
   assert 'sophia-ao-vivo/' in src and (('/teste/') in src if base=='xteste' else src.split('sophia-ao-vivo/')[0] in ['../',''])
  q.goto(f'{ORIGIN}/{base}/index.html?routes=2#welcome');q.wait_for_timeout(100)
  if test:
   q.evaluate("localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-06'}))");q.reload();q.wait_for_timeout(400)
  ids=q.locator('section.screen').evaluate_all('(els)=>els.map(e=>e.id)');ids=[i for i in ids if i not in ['chat','d-call','m-talk']]
  assert len(ids)==54,len(ids)
  for ident in ids:
   q.evaluate('(u)=>history.pushState(null,"",u)',f'#{ident}')
   q.evaluate("id=>onShowMerge(id)",ident)
   q.evaluate('(id)=>show(id)',ident)
   assert q.locator(f'#{ident}.on').count()==1,(base,ident)
  print(base,'PASS',len(ids),'direct screens + 2 live calls')
  assert not errs,errs
  assert not missing,missing
 b.close()
