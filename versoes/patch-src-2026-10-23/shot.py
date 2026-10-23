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
        await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f'{OUT}/01-inicio.png')
        print('load errors:',errs)
        await b.close()
asyncio.run(main())
