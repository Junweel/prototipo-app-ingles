"""Test-only fixtures, then the native closing control; no real learner data is touched."""
import os
from playwright.sync_api import sync_playwright
O=os.getenv('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  for score in [80,40]:
   c=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
   q.goto(f'{O}/{base}/#practice');q.wait_for_function('window.SplaBonus')
   q.evaluate('''score=>{const k=mergeTest.dk();localStorage.setItem('perfil',JSON.stringify({nome:'Pessoa de teste · fixture',criado:k}));localStorage.setItem('rotinaState',JSON.stringify({days:{[k]:{steps:{aquec:{done:true,n:3,ok:2,real:true},ep:{done:true,id:'ep0',gist:1,pct:score},trail:{done:true},call:{done:true,demo:true}}}},eps:{ep0:{done:true}},weeks:{}}));}''',score)
   q.goto(f'{O}/{base}/?fixture={score}#d-close');q.locator('#oClose').click();q.wait_for_function('Object.keys(SplaBonus.state.seen).some(k=>k.endsWith(":step:lili"))')
   if score==80:
    q.wait_for_function('SplaBonus.state.pins===1');assert q.evaluate('Object.values(SplaBonus.state.sessions).some(s=>s.major==="G")')
    q.locator('.bp-overlay').wait_for();q.evaluate('SplaBonus.close()');q.locator('.bp-overlay[data-bonus-level="G"]').wait_for();assert q.locator('.bp-metrics').inner_text().startswith('4/4')
    total=q.evaluate('mergeTest.capitalOf().total');assert total in [120,140],total
    bonus=q.evaluate('SplaBonus.state.bonuses');assert all(x['amount']<=20 for x in bonus.values())
    q.evaluate('SplaBonus.close()');q.goto(f'{O}/{base}/#home');q.locator('.bp-lanyard-pin').wait_for();assert q.locator('[data-company-state="on"]').count()>0
    q.goto(f'{O}/{base}/#d-close');q.locator('#oClose').click();q.wait_for_timeout(250);assert q.evaluate('SplaBonus.state.pins')==1;assert q.locator('.bp-overlay').count()==0
   else:
    q.locator('.bp-overlay[data-bonus-level="lili"]').wait_for();assert q.evaluate('mergeTest.capitalOf().total')==120
    assert '1 de 2' in q.locator('.bp-repair-card').inner_text();q.locator('#bp-repair-input').fill('bad');q.locator('#bp-repair-check').click();assert q.locator('.bp-overlay[data-bonus-level="lili"]').count()==1
    q.locator('#bp-repair-hint').click();q.locator('#bp-repair-check').click();q.locator('.bp-overlay[data-bonus-level="P"]').wait_for();assert 'com o modelo' in q.locator('#bp-description').inner_text();assert q.evaluate('mergeTest.capitalOf().total')>=120
   assert not errors,errors;print(base,score,'PASS native session close, one unit pin/no duplicates, capped shared Capital, honest repair; test fixtures only');c.close()
 b.close()
