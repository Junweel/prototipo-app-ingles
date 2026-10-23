s=open('sophia-ao-vivo/index.html').read()
a=s.index('const EAR_EXP=');b=s.index('/* ---- escolha das frases',a)
score=s[a:b].rstrip()
css=open('patch/rotina/style.css').read();data=open('patch/rotina/data.js').read();app=open('patch/rotina/app.js').read()
assert '/*@@SCORING@@*/' in app
app=app.replace('/*@@SCORING@@*/',score)
html=f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0b0d12">
<meta name="rotina-version" content="rotina 2026.10.20">
<title>Rotina de hoje · Inglês para o trabalho</title>
<link rel="preload" as="image" href="img/erick-capa.webp">
<style>
{css}
</style>
</head>
<body>
<main id="app" aria-live="polite"></main>
<div id="sheet" hidden></div>
<div id="toast" role="status" hidden></div>
<script>
{data}
{app}
</script>
</body>
</html>
'''
open('rotina/index.html','w').write(html);print(len(html))
