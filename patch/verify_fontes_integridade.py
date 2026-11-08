import json,re,subprocess
from pathlib import Path
BASE='before-fontes-aulas-20261107-3c1b5cf'
data=json.loads(Path('docs/fontes-aulas/catalogo.json').read_text())
doc=Path('/workspace/grokia-base/01-dossie-de-evidencias.md').read_text()
s=Path('fontes-aulas.js').read_text();embedded=s.split('const CATALOG=',1)[1].split(';\nconst esc=',1)[0]
assert json.loads(embedded)==data
for k,r in data['references'].items():
 assert r['url'] in doc,(k,'not in evidence dossier')
 assert r['text'] in doc.replace('*',''),(k,'citation changed')
for item in [*data['activities'].values(),data['live'],*data['overlays'].values()]:
 assert item['limit'] and all(k in data['references'] for k in item['refs'])
for f in ['v6/index.html','teste/index.html','sophia-ao-vivo/index.html','teste/sophia-ao-vivo/index.html']:
 old=subprocess.check_output(['git','show',BASE+':'+f]);new=Path(f).read_bytes()
 new=re.sub(rb'<link rel="stylesheet" href="[^"<>]*fontes-aulas.css\?v=20261107-1"><script src="[^"<>]*fontes-aulas.js\?v=20261107-1"></script>\n',b'',new)
 assert old==new,(f,'existing content changed')
assert not subprocess.check_output(['git','diff',BASE,'--','assets','dialogue-audio.js','dialogue-voices.js','transferencia-linguistica.js','transferencia-linguistica.css'])
print('PASS 18 exact bibliographic entries, catalog consistency, 4 original HTML byte-preserved after removing includes, approved audio and Odlin lesson untouched')
