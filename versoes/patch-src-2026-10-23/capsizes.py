import asyncio,sys,json,re
from playwright.async_api import async_playwright
sys.path.insert(0,'patch')
from mockflow import CORR,REPLY
URL=sys.argv[1]; OUT=sys.argv[2]
async def run(b,W,H):
    ctx=await b.new_context(viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=True,has_touch=True,permissions=['microphone','camera'],
        user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
    await ctx.add_init_script("class FakeSR{start(){setTimeout(()=>this.onstart&&this.onstart(),10)}stop(){setTimeout(()=>this.onend&&this.onend(),10)}abort(){}};window.webkitSpeechRecognition=window.SpeechRecognition=FakeSR")
    await ctx.add_init_script("if(!localStorage.getItem('sophiaCfg'))localStorage.setItem('sophiaCfg',JSON.stringify({prov:'xai',key:'xai-MOCK-KEY-for-local-test',mode:'llm'}))")
    async def handle(route):
        body=json.loads(route.request.post_data or '{}'); msgs=body.get('messages',[]); sysm=msgs[0]['content'] if msgs else ''
        if 'You check ONE spoken sentence' in sysm:
            said=re.search(r'Student said: "(.*?)"',msgs[-1]['content']).group(1)
            c=CORR.get(said,dict(said=said,corrected=None,isError=False,important=False,unclear=False,why_pt=None,meaning=False,category=None,corrected_pt=None))
            return await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':json.dumps(c)}}]}))
        last=msgs[-1]['content']; rep=REPLY.get(last,"Oh nice, tell me more! What else do you like to do?")
        meta=json.dumps({'heard':last,'isError':False,'corrected':None,'emph':None,'tip':None,'repeat':None,'pt':'(tradução)'})
        await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':rep+'\n###\n'+meta}}]}))
    await ctx.route('https://api.x.ai/**',handle)
    pg=await ctx.new_page(); errs=[]
    pg.on('console',lambda m: errs.append(m.type+': '+m.text) if m.type in('error','warning') else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERROR: '+str(e)))
    await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(800)
    async def idle(t=40000):
        await pg.wait_for_function("()=>sophiaTest.state()==='ATTENDING'",timeout=t); await pg.wait_for_timeout(300)
    await pg.click('#cbHang'); await idle()
    await pg.evaluate("()=>document.body.classList.add('kbd')")
    for t in ['I go on park in the weekend','Yesterday I go to the cinema with my wife','She like romantic movies','It was very good']:
        await pg.fill('#typeIn',t); await pg.press('#typeIn','Enter'); await idle()
    await pg.evaluate("()=>document.body.classList.remove('kbd')"); await pg.wait_for_timeout(500)
    m=await pg.evaluate("""()=>{const st=document.getElementById('stage'),c=document.getElementById('caps'),cr=c.getBoundingClientRect(),bb=document.getElementById('callBar').getBoundingClientRect(),
      hint=document.getElementById('callHint').getBoundingClientRect(),pad=parseFloat(getComputedStyle(c).paddingTop);
      const caps=[...c.children].map(e=>e.getBoundingClientRect()).filter(r=>r.bottom>cr.top+pad);
      return {H:innerHeight,chin:+st.dataset.chin,chinPct:(+st.dataset.chin/innerHeight*100).toFixed(1),textTop:Math.round(cr.top+pad),fadeTop:Math.round(cr.top),capsBottom:Math.round(cr.bottom),
        hintTop:Math.round(hint.top),barTop:Math.round(bb.top),lines:c.children.length,overflowClipped:getComputedStyle(c).overflow,
        lowestCapBottom:Math.round(Math.max(...[...c.children].map(e=>e.getBoundingClientRect().bottom)))}}""")
    name=f'{OUT}/legendas-{W}x{H}.png'; await pg.screenshot(path=name)
    # cópia anotada (só para conferência): linha vermelha = queixo, verde = início do texto
    from PIL import Image,ImageDraw
    im=Image.open(name); d=ImageDraw.Draw(im); sc=im.width/W
    d.line([(0,m['chin']*sc),(im.width,m['chin']*sc)],fill=(255,0,0),width=3); d.line([(0,m['textTop']*sc),(im.width,m['textTop']*sc)],fill=(0,255,0),width=3)
    im.save(f'/tmp/annot-{W}x{H}.png')
    print(W,H,json.dumps(m),'errs:',errs)
    await ctx.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
        for W,H in [(360,780),(412,915),(390,844)]: await run(b,W,H)
        await b.close()
asyncio.run(main())
