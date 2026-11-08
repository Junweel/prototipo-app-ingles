import json,re,subprocess
from pathlib import Path
BASE='before-cracha-paulista-ccf38cb'
data=json.loads(Path('docs/fontes-aulas/catalogo.json').read_text())
doc=Path('/workspace/grokia-base/01-dossie-de-evidencias.md').read_text()
s=Path('fontes-aulas.js').read_text();embedded=s.split('const CATALOG=',1)[1].split(';\nconst esc=',1)[0]
assert json.loads(embedded)==data
for k,r in data['references'].items():
 assert r['url'] in doc,(k,'not in evidence dossier')
 assert r['text'] in doc.replace('*',''),(k,'citation changed')
for item in [*data['activities'].values(),data['live'],*data['overlays'].values()]:
 assert item['limit'] and all(k in data['references'] for k in item['refs'])
def normalized(raw):
 s=raw.decode().replace('Cartão Paulista','Crachá Paulista').replace('CARTÃO PAULISTA','CRACHÁ PAULISTA').replace('cartão paulista','crachá paulista').replace('ver cartão ›','ver crachá ›').replace('O Cartão incorporado','O Crachá incorporado')
 s=re.sub(r'<link rel="stylesheet" href="[^"<>]*cracha-paulista.css\?v=[^"<>]+"><script src="[^"<>]*cracha-paulista.js\?v=[^"<>]+"></script>\n','',s)
 s=re.sub(r'((?:cartao-identidade\.(?:js|css)|primeiro-acesso\.js|transferencia-linguistica\.js|cartao-paulista/[^"<>]*?\.html)\?v=)[^"\s]+',r'\1VERSION',s)
 s=s.replace('title="cartao-paulista"','title="Crachá Paulista"')
 return s
for f in ['v6/index.html','teste/index.html','sophia-ao-vivo/index.html','teste/sophia-ao-vivo/index.html']:
 old=subprocess.check_output(['git','show',BASE+':'+f]);new=Path(f).read_bytes()
 assert normalized(old)==normalized(new),(f,'content changed beyond approved identity naming, cache-bust and additive badge includes')
assert not subprocess.check_output(['git','diff',BASE,'--','assets','audio','dialogue-audio.js','dialogue-voices.js','transferencia-linguistica.css'])
old=subprocess.check_output(['git','show',BASE+':transferencia-linguistica.js'],text=True)
assert old.replace('Cartão Paulista','Crachá Paulista')==Path('transferencia-linguistica.js').read_text()
print('PASS 18 exact bibliographic entries, catalog consistency, 4 HTML preserved after approved badge rename/version/include normalization, approved audio and Odlin lesson untouched')
