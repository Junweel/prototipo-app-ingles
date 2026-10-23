import asyncio,sys
from playwright.async_api import async_playwright
URL=sys.argv[1]; OUT=sys.argv[2]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=1,is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/129.0 Mobile Safari/537.36')
        await ctx.add_init_script("localStorage.setItem('sophiaCfg',JSON.stringify({bg:'theatro'}))")
        pg=await ctx.new_page(); await pg.goto(URL,wait_until='networkidle')
        await pg.evaluate("()=>{sophiaTest.setState('SPEAKING');sophiaTest.S.running=true}")
        await pg.evaluate("()=>sophiaTest.speak('Oh, how cool! I went to the park this weekend too. It is great for decompressing after a full week of work. What did you do there?')")
        for i in range(4):
            await pg.wait_for_timeout(900); await pg.screenshot(path=f'{OUT}/gesto-{i}.png',clip={'x':0,'y':80,'width':412,'height':760})
        await pg.evaluate("()=>sophiaTest.setState('THINKING')"); await pg.wait_for_timeout(1500); await pg.screenshot(path=f'{OUT}/gesto-pensando.png',clip={'x':0,'y':80,'width':412,'height':760})
        await b.close()
asyncio.run(main())
