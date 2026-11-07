"""Measure pYIN F0 from the actual concatenated MP3, using its line offsets.
F0 corroborates casting; it is not a biometric identity/gender classifier.
"""
import json,csv,hashlib
from pathlib import Path
from collections import defaultdict
import numpy as np
import librosa
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT/'audio/dialogues/20261107-neural-v1';OUT=ROOT/'docs/vozes-neurais';OUT.mkdir(parents=True,exist_ok=True)
m=json.loads((BASE/'manifest.json').read_text());rows=[];allf=defaultdict(list);summary=[]
for id,d in m['dialogues'].items():
 file=BASE/d['file'];assert hashlib.sha256(file.read_bytes()).hexdigest()==d['sha256'];y,sr=librosa.load(str(file),sr=16000)
 for i,line in enumerate(d['lines']):
  clip=y[round(line['start']*sr):round(line['end']*sr)]
  f0,voiced,p=librosa.pyin(clip,fmin=65,fmax=450,sr=sr,frame_length=1024,hop_length=160)
  rms=librosa.feature.rms(y=clip,frame_length=1024,hop_length=160)[0];mask=voiced&(p>.5)&(rms>.007)&np.isfinite(f0);vals=f0[mask]
  if len(vals)<5:vals=f0[voiced&(p>.2)&(rms>.004)&np.isfinite(f0)]
  if len(vals)==0:raise RuntimeError('No voiced F0 '+id+' '+str(i))
  allf[line['speaker']].extend(vals.tolist());r={'dialogue':id,'line':i,'speaker':line['speaker'],'voice':line['voice'],'start':line['start'],'end':line['end'],'voiced_frames':len(vals),'median_hz':round(float(np.median(vals)),1),'p10_hz':round(float(np.percentile(vals,10)),1),'p90_hz':round(float(np.percentile(vals,90)),1)};rows.append(r)
 med={speaker:round(float(np.median([r['median_hz'] for r in rows if r['dialogue']==id and r['speaker']==speaker])),1) for speaker in set(l['speaker'] for l in d['lines'])}
 summary.append({'dialogue':id,'file':d['file'],'sha256':d['sha256'],'duration_seconds':d['duration'],'voices':list(dict.fromkeys(l['voice'] for l in d['lines'])),'median_of_line_medians_hz':med});print(id,med,flush=True)
 report={}
# Aggregate voiced frames, rather than treating a long and short line as equal evidence.
report={'method':'librosa pYIN, actual final MP3 line crops, 16 kHz, F0 65–450 Hz, 64 ms frame / 10 ms hop; voiced probability + RMS filtering. No artificial pitch shift.','note':'Pitch ranges overlap naturally and F0 alone does not establish speaker identity. Verify with provider voice IDs, different source recordings and listening.','version':m['version'],'speaker_frame_median_hz':{s:round(float(np.median(v)),1) for s,v in allf.items()},'dialogues':summary,'segments':rows}
ep0=[r for r in rows if r['dialogue']=='ep0'];erick=float(np.median([r['median_hz'] for r in ep0 if r['speaker']=='erick']));ana=float(np.median([r['median_hz'] for r in ep0 if r['speaker']=='ana']));assert erick<160 and ana>165 and ana/erick>1.3,(erick,ana)
(OUT/'pitch-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));
with (OUT/'pitch-segments.csv').open('w') as f:w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
print('VERIFIED EP0:',round(erick,1),'Hz male /',round(ana,1),'Hz female;',len(rows),'actual MP3 segments',flush=True)
