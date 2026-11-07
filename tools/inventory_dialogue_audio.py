"""Inventory every emitted MP3; clearly distinguish active recordings from retained drafts."""
import json,csv,hashlib,subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[1];B=R/'audio/dialogues/20261107-neural-v1';D=R/'docs/vozes-neurais';D.mkdir(exist_ok=True)
m=json.loads((B/'manifest.json').read_text());used={}
for id,d in m['dialogues'].items():used[d['file']]={'usage':'dialogue:'+id,'voice':';'.join(dict.fromkeys(l['voice'] for l in d['lines']))}
for u in m['utterances'].values():used[u['file']]={'usage':'line:'+u['speaker'],'voice':u['voice']}
for s in m.get('samples',{}).values():used[s['file']]={'usage':'public-sample','voice':'en-US-AndrewNeural;en-US-JennyNeural'}
rows=[]
for p in sorted(B.rglob('*.mp3')):
 rel=str(p.relative_to(B));rows.append({'file':rel,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),**used.get(rel,{'usage':'retained-initial-draft-not-referenced','voice':'see initial checkpoint bcf0fa8; never selected by current manifest'})})
with (D/'audio-inventory.csv').open('w') as f:w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
print(len(rows),'MP3 files inventoried;',len(used),'active URLs;',len(rows)-len(used),'initial drafts retained, not referenced')
