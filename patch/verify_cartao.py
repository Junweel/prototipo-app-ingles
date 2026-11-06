from playwright.sync_api import sync_playwright
import json
BASE='http://127.0.0.1:8765/v6/index.html'
DAY=__import__('datetime').date.today().isoformat()
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    page=b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2)
    errors=[]; page.on('pageerror',lambda e: errors.append(str(e)))
    page.goto(BASE+'#home');page.wait_for_timeout(1300)
    # The approved home's actual warm-up banner renders through prior onShowMerge.
    assert page.locator('#home .blocks div').count()>0, 'Legacy renderHome is not called: onShowMerge was overwritten'
    # Approved route reaction: a reminder preview is rendered by the original onShow handler.
    page.goto(BASE+'#profile');page.wait_for_timeout(400);page.locator('#oLembPrev').click();page.wait_for_timeout(400)
    assert page.locator('#home .o-lemb').count()>0, 'Regression: original onShow hook was replaced; reminder missing'
    imgs=page.locator('#home img.pt').evaluate_all('(a)=>a.map(x=>x.src)'); assert imgs and all('/assets/' in x and not '-3d.webp' in x for x in imgs), 'Approved character renderer changed'
    for cp in ['cartao-paulista','cp-status-picker','cp-divisions','cp-liga','cp-edit']:
        page.goto(BASE+'#'+cp);page.wait_for_timeout(400)
        assert page.locator('#'+cp+'.on').count()==1, cp+' not visible'
    assert not errors, str(errors)
    print('PASS: legacy home render + all Cartão Paulista screens')
    b.close()
