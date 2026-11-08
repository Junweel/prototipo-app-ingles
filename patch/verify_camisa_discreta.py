import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright
O=os.getenv('VERIFY_ORIGIN','http://127.0.0.1:8765');D=Path('/workspace/cracha-paulista');record=os.getenv('RECORD_BASELINE')=='1'
STYLE="""e=>{let s=getComputedStyle(e);return Object.fromEntries(['fontSize','fontWeight','color','backgroundColor','borderTopColor','borderTopWidth','paddingTop','paddingRight','paddingBottom','paddingLeft','minHeight'].map(k=>[k,s[k]]))}"""
values={}
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');pre='teste_' if base=='teste' else ''
  c.add_init_script(f"if(window===window.top) localStorage.setItem('{pre}perfil',JSON.stringify({{nome:'Andréa',criado:'2026-11-07'}}));")
  q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)));q.goto(f'{O}/{base}/?discreto=20261108#home')
  home=q.locator('.cpi-hero button[data-company-edit]');home.wait_for();assert home.inner_text()=='Vestindo a camisa ✓';on=home.evaluate(STYLE)
  if not record:
   assert on['fontSize']=='11px' and on['fontWeight']=='400',on
   assert on['borderTopColor']=='rgba(0, 0, 0, 0)',on
   if base=='v6':q.screenshot(path=str(D/'capturas/camisa-on-discreto.png'))
  home.click();f=q.frame_locator('#cpiProfileFrame');f.locator('.field .val').first.wait_for();f.locator('.right').click();f.locator('.name').wait_for();native=f.locator('[data-company-edit]');native_on=native.evaluate(STYLE)
  if not record:assert native_on['fontSize']=='20px' and native_on['fontWeight']=='400' and native_on['borderTopColor']=='rgba(0, 0, 0, 0)',native_on
  q.evaluate('location.hash="community"');q.locator('#community.on').wait_for();peer=q.locator('.cpi-personbadge button[data-company-edit]').first;peer.wait_for();peer_on=peer.evaluate(STYLE)
  if not record:assert float(peer_on['fontSize'][:-2])<=8 and peer_on['fontWeight']=='400' and peer.bounding_box()['height']>=24,peer_on
  # Explicit missing state, no demo fallback. Capture every plus-state style exactly.
  q.evaluate('(pre)=>localStorage.setItem(pre+"cartaoPaulista",JSON.stringify({company:"",logo:""}))',pre);q.goto(f'{O}/{base}/?discreto=off#home');off=q.locator('.cpi-hero button[data-company-edit]');off.wait_for();assert off.inner_text()=='Vista a camisa +';values[base]={'home':off.evaluate(STYLE)}
  off.click();f.locator('.field .val').first.wait_for();f.locator('.right').click();f.locator('.name').wait_for();assert f.locator('[data-company-edit]').inner_text()=='Vista a camisa +';values[base]['profile']=f.locator('[data-company-edit]').evaluate(STYLE)
  assert q.evaluate('document.documentElement.scrollWidth<=390');assert not errors,errors
  if not record:
   old=json.loads(Path('docs/camisa-cracha/plus-style-baseline.json').read_text());assert values[base]==old[base],('plus CTA styles changed',values[base],old[base])
   print(base,'PASS discreet on in Hoje/Perfil/Comunidade; plus CTA byte-equivalent style snapshot; edit action, 390px, no JS errors')
  c.close()
 b.close()
if record:(D/'camisa-plus-baseline.json').write_text(json.dumps(values,indent=2));print('BASELINE plus states recorded',values)
