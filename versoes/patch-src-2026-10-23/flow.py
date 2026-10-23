import asyncio,sys,json
from playwright.async_api import async_playwright
URL=sys.argv[1]; OUT=sys.argv[2]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--autoplay-policy=no-user-gesture-required'])
        ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=2,is_mobile=True,has_touch=True,
            user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
        pg=await ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(f'{m.type}: {m.text}') if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERROR: '+str(e)))
        await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(1200)
        print('load errors:',errs)
        async def idle(t=40000):
            await pg.wait_for_function("()=>window.sophiaTest&&(sophiaTest.state()==='ATTENDING'||!document.getElementById('review').hidden)",timeout=t)
            await pg.wait_for_timeout(300)
        async def say(txt):
            await pg.fill('#typeIn',txt); await pg.press('#typeIn','Enter'); await idle()
        await pg.click('#btnStart'); await idle()
        await pg.click('#btnKbd')
        await say('My name is Joel')
        await say('I work as engineer, I have 35 years')
        await say('Yes, people is always speaking English in the meetings')
        await pg.click('#btnKbd')  # esconde o teclado para a captura
        await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'{OUT}/02-conversa-legendas.png')
        await pg.click('#btnKbd')
        await say('Speaking, it depends of the person')
        await say('I go on park in the weekend with my family')
        await pg.click('#btnKbd'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{OUT}/03-conversa-legendas-2.png')
        await pg.click('#btnKbd')
        await pg.click('#btnEnd')
        await idle(60000)
        await pg.screenshot(path=f'{OUT}/04-revisao-A-repita-comigo.png')
        tgt=await pg.evaluate("()=>sophiaTest.S.prac.list[0].target")
        await say(tgt)       # passo A ok
        await pg.screenshot(path=f'{OUT}/05-revisao-B-de-memoria.png')
        await say('I am thirty five')   # passo B errado → nova tentativa
        await pg.screenshot(path=f'{OUT}/06-revisao-B-dica.png')
        await say(tgt)       # acerta de memória
        n=await pg.evaluate("()=>sophiaTest.S.prac?sophiaTest.S.prac.list.length:0")
        for i in range(1,n):
            t=await pg.evaluate("()=>sophiaTest.S.prac.list[sophiaTest.S.prac.i].target")
            await say(t)
            await say('hmm I forgot' if i==1 else t)
            if i==1: await say('no idea sorry')
        await pg.wait_for_selector('#review:not([hidden])',timeout=60000)
        await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'{OUT}/07-aba-revisao-conversa.png')
        await pg.click('.rvtabs button[data-t=er]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{OUT}/08-aba-revisao-erros.png')
        await pg.click('.rvtabs button[data-t=cd]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{OUT}/09-aba-revisao-cartoes.png')
        info=await pg.evaluate("()=>({cards:sophiaTest.cards().length,turns:sophiaTest.CV.turns.length,errs:sophiaTest.CV.turns.filter(t=>t.isError&&!t.practice).map(t=>[t.text,t.corrected]),picks:(sophiaTest.CV.picks||[]).map(p=>[p.target,p.ok,p.attempts.length])})")
        print(json.dumps(info,ensure_ascii=False,indent=1))
        print('all errors/warnings:',errs)
        await b.close()
asyncio.run(main())
