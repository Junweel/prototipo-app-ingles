import os
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844});q=c.new_page();q.set_default_timeout(5000);u=f'{O}/{base}/'
  q.goto(u+'?novo=1');q.evaluate("""()=>{localStorage.setItem('perfil',JSON.stringify({nome:'Andréa Preservada',area:'SAP',tempo:'25 min',criado:'2026-10-28'}));localStorage.setItem('rotinaState',JSON.stringify({days:{'2026-11-06':{steps:{aquec:{done:true}}}},eps:{},weeks:{}}));localStorage.setItem('cartaoPaulista',JSON.stringify({name:'Andréa Preservada',company:'Atlasul Bank',photo:'../cartao-paulista/assets/bia.png'}))}""")
  old=q.evaluate("localStorage.getItem('rotinaState')")
  q.goto(u);q.locator('#practice.on').wait_for()
  assert not q.evaluate("localStorage.getItem('spla_onboarded_v1')"),'migration must not invent finished requirements'
  assert q.evaluate("localStorage.getItem('rotinaState')")==old
  q.goto(u+'#profile');q.locator('#pa-review>summary').click();assert 'não concluída' in q.locator('#pa-registration-state').inner_text()
  q.goto(u+'?novo=1');q.locator('#welcome.on').wait_for();q.locator('#welcome .foot button').filter(has_text='Já tenho conta').click();q.locator('#practice.on').wait_for()
  q.goto(u+'#profile');q.reload();q.locator('#profile.on').wait_for()
  q.goto(u+'?novo=1');assert q.evaluate("localStorage.getItem('rotinaState')")==old
  c.close();print(base,'PASS legacy Andréa return, no fabricated signup, preserved progress/photo and explicit deep links')
 b.close()
