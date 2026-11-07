"""Check hashes of all currently referenced recordings over HTTP, including line clips."""
import os,json,hashlib
from concurrent.futures import ThreadPoolExecutor
from urllib.request import urlopen
from pathlib import Path
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765').rstrip('/')
rel='audio/dialogues/20261107-neural-v1/'
local=json.loads((Path(__file__).resolve().parents[1]/rel/'manifest.json').read_text())
with urlopen(O+'/'+rel+'manifest.json?verify=neural-v1',timeout=30) as r:remote=json.load(r)
assert remote==local,'Deployed manifest differs from generated recordings'
files={x['file']:x['sha256'] for x in list(local['dialogues'].values())+list(local['utterances'].values())+list(local.get('samples',{}).values())}
def verify(pair):
 file,digest=pair
 with urlopen(O+'/'+rel+file+'?verify='+digest[:12],timeout=30) as r:data=r.read()
 assert hashlib.sha256(data).hexdigest()==digest,file
 return len(data)
with ThreadPoolExecutor(max_workers=8) as pool:sizes=list(pool.map(verify,files.items()))
print('PASS',len(files),'real MP3 URLs; all SHA-256 match;',sum(sizes),'bytes;',O)
