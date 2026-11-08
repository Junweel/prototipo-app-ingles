"""Chromium integration of the additive Bônus Paulista, without altering recorded media."""
import os,json,time
from pathlib import Path
from playwright.sync_api import sync_playwright
ORIGIN=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
VARIANTS=os.environ.get('BONUS_VARIANTS','teste').split(',')
OUT=Path('/workspace/bonus-paulista/capturas');OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 for base in VARIANTS:
  c=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');q=c.new_page();errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(f'{ORIGIN}/{base}/?bonus-verificacao={int(time.time())}#practice');q.wait_for_function('window.SplaBonus && document.querySelector("[data-bp-activity]")')
  if base=='teste':
   q.evaluate("localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-08'}))")
  assert q.evaluate('SplaBonus.muted') is False
  assert q.locator('[data-bp-activity]').count()==37
  original=q.evaluate('JSON.stringify(SplaBonus.state)')
  oldMP3=q.evaluate('JSON.stringify(mergeTest.EPS.map(e=>e.audio))')
  for level in ['P','M','G','GG','lili']:
   q.evaluate('(l)=>SplaBonus.celebrate(l)',level);q.locator(f'.bp-overlay[data-bonus-level="{level}"]').wait_for()
   assert q.evaluate('JSON.stringify(SplaBonus.state)')==original
   d=q.locator('.bp-dialog');assert d.bounding_box()['width']<=390
   assert q.evaluate('document.querySelector(".bp-dialog").scrollWidth<=document.querySelector(".bp-dialog").clientWidth+1')
   assert q.locator('.bp-tag').inner_text().startswith('DEMONSTRAÇÃO')
   assert q.locator('.bp-characters img').count()==(3 if level in ['G','GG'] else 1)
   assert q.locator('.bp-dialog').evaluate('e=>e.contains(document.activeElement)')
   assert q.locator('.bp-dialog').evaluate('e=>getComputedStyle(e).animationName')=='none'
   q.screenshot(path=str(OUT/f'{base}-{level}.png'))
   if level=='GG':
    q.locator('#bp-share-preview').click();assert 'PRÉVIA LOCAL' in q.locator('#bp-share-box').inner_text();assert q.evaluate('JSON.stringify(SplaBonus.state)')==original
   if level=='lili':
    q.locator('#bp-repair-input').fill('Could you help me?');q.locator('#bp-repair-check').click();q.locator('.bp-overlay[data-bonus-level="P"]').wait_for();assert q.evaluate('JSON.stringify(SplaBonus.state)')==original
   q.keyboard.press('Escape');q.locator('.bp-overlay').wait_for(state='detached')
  # Persistent mute is only for new effects, never the approved conversation audio.
  q.goto(f'{ORIGIN}/{base}/#profile');q.locator('#bp-settings').wait_for();q.locator('#bp-settings [data-bp-sound]').click();assert q.evaluate('SplaBonus.muted')
  q.reload();q.wait_for_function('window.SplaBonus');assert q.evaluate('SplaBonus.muted')
  assert q.evaluate('JSON.stringify(mergeTest.EPS.map(e=>e.audio))')==oldMP3
  # Native progress adapter: trigger existing checkpoint control (no adapter-internal API).
  q.goto(f'{ORIGIN}/{base}/#m-checkpoint');q.locator('#oWeekDone').click();q.wait_for_function('Object.keys(SplaBonus.state.seen).length>0')
  assert q.evaluate('Object.values(SplaBonus.state.sessions).some(s=>s.major==="M")')
  q.evaluate('SplaBonus.close()');q.wait_for_timeout(180);q.evaluate('SplaBonus.close()');q.wait_for_timeout(180)
  # A real DOM click through the old card controls completes warm-up, no direct stepDone.
  q.goto(f'{ORIGIN}/{base}/#d-warm')
  for _ in range(3):q.locator('#wshow').click();q.locator('.wr').nth(2).click()
  q.locator('#wnext').click();q.wait_for_function('Object.keys(SplaBonus.state.seen).some(k=>k.endsWith(":step:aquec"))')
  assert q.evaluate('mergeTest.today().steps.aquec.done')
  assert not errors,errors
  print(base,'PASS: 37 components, five previews/no rewards, repair, original audio URLs, native completion, default sound/mute, reduced motion, focus, 390px')
  c.close()
 b.close()
