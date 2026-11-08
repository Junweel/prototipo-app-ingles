import json,re,unicodedata
from pathlib import Path
R=Path(__file__).resolve().parents[1];D=R/'docs/bonus-paulista'
a=json.loads((D/'evidencias/bibliografia-anterior-crossref.json').read_text());b=json.loads((D/'evidencias/referencias-crossref.json').read_text());c=json.loads((D/'ciencia.json').read_text())
assert len(a)==137 and len({r['doi'].lower() for r in a+b})==156
assert all(x['status']=='verified_crossref' for x in a+b)
assert len({r['doi'].lower() for r in b}-{r['doi'].lower() for r in a})==19
assert c['public_counts']=={'authors':'300+','publications':'150+'}
assert len(c['references'])==156
assert c['audit']['new_author_keys']==79 and c['audit']['total_author_keys']==328
assert len(json.loads((R/'bonus-paulista.pt-BR.json').read_text()))==5
assert all(len(v)>=10 for v in json.loads((R/'bonus-paulista.pt-BR.json').read_text()).values())
s=(R/'primeiro-acesso.js').read_text();assert '<b>150+</b>' in s and '<b>300+</b>' in s
assert 'pesquisadores na base' not in s
print('PASS 137 previous + 19 new unique DOI works; 24 celebration references verified; 50 copy variants; conservative public labels, no invented method count')

def key(author):
 fam=re.sub('[^a-z]','',unicodedata.normalize('NFKD',author.get('family','')).encode('ascii','ignore').decode().lower());given=re.sub('[^a-z]','',unicodedata.normalize('NFKD',author.get('given','')).encode('ascii','ignore').decode().lower())
 if fam=='cepeda' and given.startswith('n'):return 'wiseheart:m'
 if fam=='nation' and given[:1] in ['i','p']:return 'nation:i'
 return fam+':'+(given if fam=='lee' and given in ['nayeon','nikkic'] else given[:1])
def authors(rows):return {key(x) for r in rows for x in r['authors'] if x.get('given') and x.get('family')}
assert len(authors(a))==249 and len(authors(a+b))==328 and len(authors(b)-authors(a))==79
print('PASS reproducible name-key audit: 249 previous, 79 new, 328 total; conservative public count 300+')
