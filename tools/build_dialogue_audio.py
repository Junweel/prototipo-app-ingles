"""Generate real neural recordings from the preserved prototype corpus. No user keys.
Run with /workspace/.venv-dialogue-tts/bin/python tools/build_dialogue_audio.py.
"""
import asyncio,hashlib,json,re,subprocess,wave
from pathlib import Path
import numpy as np
import edge_tts
ROOT=Path(__file__).resolve().parents[1];VERSION='20261107-neural-v1';OUT=ROOT/'audio/dialogues'/VERSION;CACHE=Path('/workspace/dialogue-build');SR=24000
CAST={'erick':'en-US-GuyNeural','ana':'en-US-JennyNeural','kate':'en-US-AvaNeural','priya':'en-US-AriaNeural','marcus':'en-US-BrianNeural','laura':'en-US-EmmaNeural','tom':'en-US-EricNeural','sophia':'en-US-AriaNeural','lili':'en-US-AvaNeural','learner':'en-US-GuyNeural','mark':'en-US-ChristopherNeural'}
def run(*args):subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
def text(s):return re.sub('<[^>]*>','',s).strip()
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
S=json.loads((ROOT/'audio/dialogues/source.json').read_text());dialogs={};utterances={}
def add(role,s):
 s=text(s);k=role+'|'+s;utterances.setdefault(k,{'speaker':role,'text':s,'voice':CAST[role]});return k
def dialogue(id,title,lines):
 keys=[add(role,s) for role,s in lines];dialogs[id]={'id':id,'title':title,'keys':keys}
for ep in S['episodes']:
 roles={'E':'erick','G':ep['guest']['name'].lower() if ep.get('guest') else 'erick'}
 dialogue(ep['id'],ep['t'],[(roles[sp],s) for sp,s in ep['lines']])
 for tr in ep['tr']:
  for chunk in tr[2]:add(roles[ep['lines'][tr[0]][0]],chunk[0])
 for item in ep['foco']['items']:add('erick',item['en'])
dialogue('room512','Room 512 · hóspede e recepcionista',[(('learner' if i==0 else 'sophia'),s.split(': ',1)[1]) for i,s in enumerate(S['legacy']['room'])])
dialogue('hotel-chat','Sophia e aluno · quarto errado',[(x['speaker'],x['text']) for x in S['legacy']['chat']])
dialogue('daily-call-example','Sophia e aluno · status do projeto (exemplo)',[('sophia' if x['w']=='s' else 'learner',x['t']) for x in S['call']])
dialogue('daily-transcript-example','Sophia e aluno · transcrição demonstrativa',[(x['speaker'],x['text']) for x in S['transcript']])
dialogue('mark-roleplay','Mark e aluno · atraso na entrega (exemplo)',[('mark' if x[0]=='tutor' else 'learner',x[1]) for x in S['T'] if x[0]!='stuck'])
for sample in S['legacy']['samples']:add(sample['speaker'],sample['text'])
for ex in S['exercises']:
 if ex.get('audio'):add('erick',ex['audio'])
for card in S['CARDS']:add('erick',card['en'])
for role in ['erick','sophia','lili']:add(role,'Hello, I am '+role.capitalize()+'. Let us practice together.')
OUT.mkdir(parents=True,exist_ok=True);(OUT/'lines').mkdir(exist_ok=True);CACHE.mkdir(exist_ok=True)
sem=asyncio.Semaphore(3)
async def generate(k,u):
 async with sem:
  h=hashlib.sha256((u['voice']+'|'+u['text']).encode()).hexdigest()[:16];raw=CACHE/(h+'.raw.mp3');wav=CACHE/(h+'.wav');file=OUT/'lines'/(u['speaker']+'-'+h+'.mp3')
  if not raw.exists():
   for attempt in range(3):
    try:
     temp=raw.with_suffix('.partial');await edge_tts.Communicate(u['text'],u['voice'],rate='+0%',pitch='+0Hz').save(str(temp));temp.replace(raw);break
    except Exception:
     if attempt==2:raise
     await asyncio.sleep(2+attempt*2)
  if not wav.exists():
   decoded=CACHE/(h+'.decoded.wav');run('ffmpeg','-y','-v','error','-i',str(raw),'-ar',str(SR),'-ac','1','-c:a','pcm_s16le',str(decoded))
   with wave.open(str(decoded)) as w:pcm=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').copy()
   n=240;rms=np.array([np.sqrt(np.mean(pcm[i:i+n].astype(float)**2)) for i in range(0,len(pcm),n)]);idx=np.where(rms>90)[0]
   if len(idx):pcm=pcm[max(0,int(idx[0]*n)-960):min(len(pcm),int((idx[-1]+1)*n)+1920)]
   with wave.open(str(wav),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes())
  if not file.exists():run('ffmpeg','-y','-v','error','-i',str(wav),'-c:a','libmp3lame','-b:a','64k','-ar',str(SR),'-ac','1',str(file))
  with wave.open(str(wav)) as w:u['duration']=w.getnframes()/SR
  u.update(file='lines/'+file.name,sha256=sha(file),wav=str(wav));print('RECORDED',u['speaker'],u['voice'],round(u['duration'],2),u['text'][:65],flush=True)
def silence(seconds):
 path=CACHE/('pause-'+str(seconds)+'.wav')
 if not path.exists():
  with wave.open(str(path),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(b'\0\0'*round(SR*seconds))
 return path
async def main():
 await asyncio.gather(*(generate(k,u) for k,u in utterances.items()))
 for id,d in dialogs.items():
  files=[silence(.2)];t=.2;lines=[];last=None
  for k in d.pop('keys'):
   u=utterances[k]
   if last:
    gap=.16 if last==u['speaker'] else .26;files.append(silence(gap));t+=gap
   lines.append({key:u[key] for key in ['speaker','text','voice','file','sha256']}|{'start':round(t,5),'end':round(t+u['duration'],5)})
   files.append(Path(u['wav']));t+=u['duration'];last=u['speaker']
  files.append(silence(.35));t+=.35;concat=CACHE/(id+'-concat.txt');concat.write_text('\n'.join("file '"+str(f)+"'" for f in files))
  target=OUT/(id+'.mp3');run('ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(concat),'-c:a','libmp3lame','-b:a','64k','-ar',str(SR),'-ac','1',str(target))
  d.update(file=id+'.mp3',duration=round(t,5),sha256=sha(target),lines=lines)
 for u in utterances.values():u.pop('wav')
 manifest={'schema':1,'version':VERSION,'engine':'edge-tts 7.3.1; natural Neural voices; no pitch transformation','sampleRate':SR,'cast':CAST,'dialogues':dialogs,'utterances':utterances}
 (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2));print('COMPLETE',len(dialogs),'dialogues,',len(utterances),'utterances',flush=True)
asyncio.run(main())
