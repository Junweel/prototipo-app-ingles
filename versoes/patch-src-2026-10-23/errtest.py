import asyncio,sys,json
from playwright.async_api import async_playwright
URL=sys.argv[1]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
        ctx=await b.new_context(viewport={'width':412,'height':915},is_mobile=True,has_touch=True,permissions=['microphone'],
            user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
        # reconhecedor falso: conta instâncias vivas; o "stop" demora 400 ms para terminar (como no Android)
        await ctx.add_init_script("""window.__live=0;window.__maxLive=0;window.__inst=0;window.__failNext=null;
class FakeSR{constructor(){__inst++}start(){if(this._on)throw new Error('InvalidStateError');this._on=true;__live++;__maxLive=Math.max(__maxLive,__live);
 setTimeout(()=>{this.onstart&&this.onstart();if(__failNext){const e=__failNext;__failNext=null;this.onerror&&this.onerror({error:e});this._end()}},10)}
 _end(){if(!this._on)return;this._on=false;__live--;this.onend&&this.onend()}stop(){setTimeout(()=>this._end(),400)}abort(){setTimeout(()=>this._end(),5)}}
window.webkitSpeechRecognition=window.SpeechRecognition=FakeSR""")
        pg=await ctx.new_page(); errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(600)
        cdp=await ctx.new_cdp_session(pg)
        async def touch(t,x=0,y=0): await cdp.send('Input.dispatchTouchEvent',{'type':t,'touchPoints':[] if t=='touchEnd' else [{'x':x,'y':y}]})
        hb=await pg.locator('#cbHang').bounding_box(); await touch('touchStart',hb['x']+30,hb['y']+28); await touch('touchEnd')
        await pg.wait_for_function("()=>sophiaTest.state()==='ATTENDING'",timeout=30000); await pg.wait_for_timeout(300)
        bb=await pg.locator('#cbMic').bounding_box(); x,y=bb['x']+28,bb['y']+28
        # segura, solta e aperta de novo 300 ms depois (o anterior ainda fechando)
        await touch('touchStart',x,y); await pg.wait_for_timeout(900); await touch('touchEnd'); await pg.wait_for_timeout(300)
        await touch('touchStart',x,y); await pg.wait_for_timeout(1200)
        r1=await pg.evaluate("()=>[__inst,__maxLive,__live,sophiaTest.S.ptt]")
        await touch('touchEnd'); await pg.wait_for_timeout(1500)
        print('reaperto rápido [instâncias, máx. simultâneas, vivas, segurando]:',r1)
        out={}
        for code in ['audio-capture','network','not-allowed']:
            await pg.evaluate(f"()=>{{__failNext='{code}'}}")
            await touch('touchStart',x,y); await pg.wait_for_timeout(700)
            out[code]=await pg.evaluate("()=>{const t=document.getElementById('toast');return t.hidden?null:t.textContent}")
            if code=='audio-capture': await pg.screenshot(path='/workspace/sophia-capturas/chamada2/06-erro-microfone-em-uso.png')
            await touch('touchEnd'); await pg.wait_for_timeout(900)
        print(json.dumps(out,ensure_ascii=False,indent=1))
        # outros modos continuam funcionando
        for ui in ['conversa','treino','chamada']:
            await pg.evaluate(f"()=>{{const s=document.getElementById('cUi');s.value='{ui}';}}")
        opts=await pg.evaluate("()=>[...document.getElementById('cUi').options].map(o=>o.value)")
        print('modos em Ajustes:',opts,'pageerrors:',errs)
        await b.close()
asyncio.run(main())
