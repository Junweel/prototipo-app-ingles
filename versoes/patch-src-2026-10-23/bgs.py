import asyncio,sys
from playwright.async_api import async_playwright
URL=sys.argv[1]; OUT=sys.argv[2]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        for bg in ['masp','banespa','theatro','copan']:
            ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=2,is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/129.0 Mobile Safari/537.36')
            await ctx.add_init_script(f"localStorage.setItem('sophiaCfg',JSON.stringify({{bg:'{bg}'}}))")
            pg=await ctx.new_page(); await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(800)
            await pg.screenshot(path=f'{OUT}/fundo-{bg}.png'); await ctx.close()
        # treino (tela anterior) + Ajustes
        ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=2,is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/129.0 Mobile Safari/537.36')
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(500)
        await pg.click('#btnGear'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/ajustes-modo.png')
        await pg.select_option('#cUi','treino'); await pg.click('#cfg button.big'); await pg.wait_for_timeout(800)
        await pg.screenshot(path=f'{OUT}/modo-treino-atual.png')
        await pg.click('#btnStart'); await pg.wait_for_function("()=>sophiaTest.state()==='ATTENDING'",timeout=30000)
        await pg.fill('#typeIn','I have 35 years'); await pg.press('#typeIn','Enter')
        await pg.wait_for_function("()=>sophiaTest.S.rep",timeout=30000); await pg.wait_for_function("()=>sophiaTest.state()==='ATTENDING'",timeout=30000)
        await pg.screenshot(path=f'{OUT}/modo-treino-repita.png')
        print('treino repeat loop active:',await pg.evaluate("()=>!!sophiaTest.S.rep"),'conv class:',await pg.evaluate("()=>document.body.classList.contains('conv')"),'errs',errs)
        await b.close()
asyncio.run(main())
