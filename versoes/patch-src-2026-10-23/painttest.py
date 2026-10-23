import asyncio,sys,json,collections
from playwright.async_api import async_playwright
URL=sys.argv[1]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
        ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=2,is_mobile=True,has_touch=True,permissions=['microphone'],
            user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
        await ctx.add_init_script("class FakeSR{start(){setTimeout(()=>this.onstart&&this.onstart(),10)}stop(){setTimeout(()=>this.onend&&this.onend(),10)}abort(){}};window.webkitSpeechRecognition=window.SpeechRecognition=FakeSR")
        pg=await ctx.new_page(); await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(800)
        cdp=await ctx.new_cdp_session(pg)
        async def touch(t,x=0,y=0): await cdp.send('Input.dispatchTouchEvent',{'type':t,'touchPoints':[] if t=='touchEnd' else [{'x':x,'y':y}]})
        hb=await pg.locator('#cbHang').bounding_box(); await touch('touchStart',hb['x']+30,hb['y']+28); await touch('touchEnd')
        await pg.wait_for_function("()=>sophiaTest.state()==='ATTENDING'",timeout=30000); await pg.wait_for_timeout(500)
        bb=await pg.locator('#cbMic').bounding_box(); x,y=bb['x']+28,bb['y']+28
        res={}
        for phase in ['solto','segurando']:
            if phase=='segurando': await touch('touchStart',x,y); await pg.wait_for_timeout(300)
            await b.start_tracing(page=pg,categories=['devtools.timeline','disabled-by-default-devtools.timeline','cc','viz'])
            await pg.wait_for_timeout(2000)
            tr=json.loads(await b.stop_tracing())
            c=collections.Counter(e['name'] for e in tr['traceEvents'] if e.get('ph') in ('X','B','I','i'))
            res[phase]={k:c.get(k,0) for k in ['Paint','RasterTask','UpdateLayoutTree','Layout','PaintImage','Decode Image','ImageDecodeTask','UpdateLayer','PrePaint','Commit']}
            if phase=='segurando': await touch('touchEnd')
        print(json.dumps(res))
        await b.close()
asyncio.run(main())
