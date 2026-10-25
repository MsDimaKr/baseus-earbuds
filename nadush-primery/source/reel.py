import sys, math
import json
sys.argv=['v2.py']; exec(open('v2.py').read())
EYE = eye_ref("fill", "#8F5B5C", "#9C6B5E", "#E2B9AE", TXT)
NG = "background:linear-gradient(135deg,#C9979A 0%,#A86F72 45%,#8F5B5C 100%);-webkit-background-clip:text;background-clip:text;color:transparent;display:inline-block"
SCENES = [(0,4.5),(4.5,9),(9,14.5),(14.5,19.5),(19.5,24),(24,29.5),(29.5,33.5),(33.5,38),(38,43.5)]
TOTAL = 43.5

CSS = BASE_CSS + f"""
.glow{{position:absolute;inset:0;background:
 radial-gradient(circle at 10% 15%, rgba(183,127,128,.32), transparent 40%),
 radial-gradient(circle at 92% 50%, rgba(183,127,128,.26), transparent 38%),
 radial-gradient(circle at 30% 92%, rgba(183,127,128,.20), transparent 40%),
 radial-gradient(circle at 60% 35%, rgba(255,255,255,.55), transparent 35%)}}
.bars i{{position:relative;overflow:hidden}} .bars i b{{position:absolute;left:0;top:0;bottom:0;background:{TXT};width:0}}
.scene{{position:absolute;inset:0;opacity:0}}
.a{{opacity:0}}
.tag{{position:absolute;left:50%;transform:translateX(-50%);top:330px;padding:12px 26px;border-radius:30px;font-size:24px;font-weight:700;letter-spacing:3px;background:{TXT};color:{BG};white-space:nowrap}}
.t{{top:410px;font-size:84px;font-weight:700;letter-spacing:-2px;line-height:1.08}}
.t .serif{{font-size:104px;font-weight:500;letter-spacing:0}}
.card{{position:absolute;left:90px;right:90px;border-radius:44px;background:{BG};border:1px solid rgba(255,255,255,.7);
 box-shadow:0 30px 60px rgba(48,37,34,.09), inset 0 2px 0 rgba(255,255,255,.8)}}
.chk{{width:58px;height:58px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;flex:none;background:{ACC};color:{BG}}}
.chip{{display:inline-flex;align-items:center;gap:12px;padding:18px 34px;border-radius:40px;background:{BG};font-size:34px;font-weight:600;
 box-shadow:0 14px 34px rgba(48,37,34,.08), inset 0 1px 0 rgba(255,255,255,.8)}}
.cap{{font-size:36px;line-height:1.4;opacity:.8}}
""" + HOOK2.replace(".eye{", ".eyew{") + END_CSS

def A(html, d, k="up", extra="", cls="", tag="div"):
    return f'<{tag} class="a {cls}" data-d="{d}" data-k="{k}" style="{extra}">{html}</{tag}>'

S = []
# 1 hook
S.append(f"""{A(EYE,0.1,'pop',cls='eyew')}
<div class="center h1">{A('Портятся ли',0.6,tag='span',extra='display:inline-block')}<br>{A('свои ресницы',1.0,tag='span',cls='serif',extra='display:inline-block')}<br>{A('после',1.4,tag='span',extra='display:inline-block')}<br>{A('наращивания?',1.6,tag='span',extra='display:inline-block')}</div>
{A('Честный ответ мастера ↓',2.3,cls='cta')}""")
# 2 short answer
rows = "".join(A(f'<span class="chk" style="font-size:30px">{i+1}</span>{s}', 1.6+i*0.35, cls='card', extra=f'top:{900+i*170}px;height:140px;display:flex;align-items:center;gap:30px;padding:0 44px;font-size:42px;font-weight:600') for i,s in enumerate(["Техника","Правильная нагрузка","Бережное снятие"]))
S.append(f"""{A('КОРОТКИЙ ОТВЕТ',0,cls='tag')}
{A('Не<br>обязательно.',0.2,cls='center serif',extra='top:400px;font-size:150px;line-height:1')}
{A('Само по себе наращивание не означает, что натуральные ресницы испортятся. Важны:',0.9,cls='center cap',extra='top:740px;padding:0 120px')}{rows}""")
# 3 isolation
iso = ""; glue = ""
for i in range(14):
    x = 90 + i*52; h = 230 + 20*math.sin(i)
    iso += f'<path d="M{x},480 Q{x-6},{480-h*0.6} {x+40+i*2},{480-h}" stroke="{TXT}" stroke-width="7" fill="none" stroke-linecap="round"/>'
    j = i - (i % 2); tx = 90 + j*52 + 60 + j*2
    glue += f'<path d="M{x},480 Q{x-4 + (10 if i%2==0 else -10)},{480-h*0.6} {tx},{480-h}" stroke="#9E5F60" stroke-width="7" fill="none" stroke-linecap="round"/>'
skin = f'<path d="M0,480 Q450,440 900,480 L900,620 L0,620Z" fill="url(#sk)"/><path d="M0,480 Q450,440 900,480" stroke="{TXT}" stroke-width="5" fill="none"/><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9B8AA"/><stop offset="1" stop-color="#C49A8C"/></linearGradient></defs>'
chipcss = f"position:absolute;left:50%;transform:translateX(-50%);top:40px;color:{BG};box-shadow:none;white-space:nowrap"
S.append(f"""{A('01 ИЗОЛЯЦИЯ',0,cls='tag')}
<div class="center t">{A('Каждая ресница —',0.2)}{A('отдельно',0.5,cls='serif')}</div>
{A(f'''<div id="glue" style="position:absolute;inset:0"><svg viewBox="0 0 900 620" width="900">{glue}{skin}</svg><div class="chip" style="{chipcss};background:#9E5F60">✕ Склейка</div></div>
<div id="iso" style="position:absolute;inset:0;opacity:0"><svg viewBox="0 0 900 620" width="900">{iso}{skin}</svg><div class="chip" style="{chipcss};background:{ACC}">✓ Изоляция</div></div>''',0.9,cls='card',extra='top:720px;height:620px;overflow:hidden')}
{A('Каждая ресница остаётся свободной — без склеек с соседними',3.4,cls='center cap',extra='top:1400px;padding:0 140px')}""")
# 4 length & volume
S.append(f"""{A('02 ДЛИНА И ОБЪЁМ',0,cls='tag')}
<div class="center t">{A('Под <span class="serif">ваши</span>',0.2)}{A('натуральные ресницы',0.45)}</div>
{A(f'''<div style="font-size:32px;font-weight:600;opacity:.85">Нагрузка на натуральную ресницу</div>
 <div style="position:relative;height:90px;margin-top:40px">
  <div style="position:absolute;left:0;right:0;top:36px;height:18px;border-radius:9px;background:linear-gradient(90deg,#E9D9CF,#D9B5AE 45%,{ACC} 75%,#8F5B5C)"></div>
  <div style="position:absolute;left:31%;width:28%;top:20px;height:50px;border-radius:26px;border:4px solid {TXT}"></div>
  <div id="knob" style="position:absolute;left:calc(88% - 26px);top:19px;width:52px;height:52px;border-radius:50%;background:{BG};border:6px solid {TXT};box-shadow:0 6px 14px rgba(48,37,34,.2)"></div></div>
 <div style="display:flex;justify-content:space-between;font-size:26px;opacity:.75;margin-top:6px"><span>лёгкая</span><b>оптимальная</b><span>перегруз</span></div>
 <div style="position:relative;height:50px;margin-top:34px;font-size:38px;font-weight:700;text-align:center">
  <div id="heavy" style="position:absolute;left:0;right:0;color:#8F5B5C">Слишком тяжело ✕</div>
  <div id="ok" style="position:absolute;left:0;right:0;color:{ACC};opacity:0">В самый раз ✓</div></div>''',0.8,cls='card',extra='top:720px;padding:50px 54px 46px')}
<div class="center" style="top:1220px">{A('Длина ✓',3.2,tag='span',cls='chip')} &nbsp; {A('Объём ✓',3.45,tag='span',cls='chip')}</div>""")
# 5 clean
rows = "".join(A(f'<span class="chk">✓</span>{s}',1.0+i*0.6,extra='display:flex;align-items:center;gap:30px;padding:38px 0;font-size:40px;font-weight:600') for i,s in enumerate(["Контроль чистоты работы","Отсутствие склеек","Каждая ресница свободна"]))
S.append(f"""{A('03 ЧИСТОТА РАБОТЫ',0,cls='tag')}
<div class="center t">{A('Контроль',0.2)}{A('каждой детали',0.45,cls='serif')}</div>
{A(rows,0.7,cls='card',extra='top:720px;padding:20px 50px',k='fade')}""")
# 6 removal
S.append(f"""{A('04 СНЯТИЕ',0,cls='tag')}
<div class="center t">{A('Только <span class="serif">бережно</span>',0.2)}</div>
{A(f'''<div style="font-size:30px;font-weight:800;letter-spacing:3px;color:{ACC}">⚠ НЕЛЬЗЯ</div>
 <div style="font-size:44px;font-weight:700;line-height:1.3;margin-top:16px">выдёргивать наращённые ресницы самостоятельно или тянуть их</div>''',0.6,cls='card',extra='top:620px;padding:46px 54px')}
{A(f'''<svg viewBox="0 0 600 340" width="600">
 <path d="M60,250 Q300,220 540,250" stroke="{TXT}" stroke-width="6" fill="none" stroke-linecap="round"/>
 <path d="M290,240 Q280,160 320,70" stroke="{TXT}" stroke-width="8" fill="none" stroke-linecap="round"/>
 <path d="M345,180 L345,60 M320,90 L345,60 L370,90" stroke="{ACC}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>''',1.3,extra='position:absolute;left:240px;top:1000px')}
{A(f'''<svg viewBox="0 0 600 340" width="600"><circle cx="315" cy="160" r="115" stroke="{ACC}" stroke-width="10" fill="none"/><path d="M233,78 L397,242" stroke="{ACC}" stroke-width="10" stroke-linecap="round"/></svg>''',2.2,'pop',extra='position:absolute;left:240px;top:1000px')}
{A('<span class="chk">✓</span>Аккуратное снятие у мастера — без выдёргивания',3.0,cls='card',extra='top:1400px;padding:36px 44px;display:flex;align-items:center;gap:28px;font-size:38px;font-weight:600')}""")
# 7 honest
S.append(f"""{A(f'''<div class="serif" style="font-size:84px;line-height:1;margin-bottom:34px">Честно:</div>
<p style="font-size:44px;line-height:1.4;font-weight:500">При правильной технике риск повреждения <b style="text-decoration:underline;text-decoration-color:{ACC};text-decoration-thickness:4px;text-underline-offset:8px">снижается</b>, но полностью исключить индивидуальные реакции и осложнения нельзя.</p>''',0.2,cls='card',extra='top:620px;padding:70px 64px')}""")
# 8 professionalism
S.append(f"""<div style="position:absolute;left:90px;right:90px;top:640px">
{A('Профессионализм —',0.1,extra='font-size:84px;font-weight:700;letter-spacing:-2px')}
{A('это не только<br>красивый эффект.',0.5,cls='serif',extra='font-size:96px;line-height:1.05;margin-top:6px')}
{A('Это внимание к каждой детали, которую клиентка не всегда может увидеть сама.',1.2,cls='cap',extra='margin-top:44px;font-size:42px')}</div>
<div class="center" style="top:1380px;font-size:40px;color:{ACC};font-weight:700">{A('Красота',2.0,tag='span',cls='chip')} &nbsp;{A('+',2.2,tag='span',extra='display:inline-block')}&nbsp; {A('Качество',2.4,tag='span',cls='chip')}</div>""")
# 9 final
S.append(f"""{A(f'<div id="logo">{logo()}</div>',0.1,'pop',cls='logo')}
{A('Надежда Дидковская',0.6,cls='center name')}
{A('Наращивание и ламинирование ресниц',0.8,cls='center sub')}
<div class="center" style="top:1030px">
{A('Твои ресницы заслуживают',1.2,extra='font-size:56px;font-weight:800;letter-spacing:-1px;'+NG)}<br>
{A('бережного отношения',1.5,extra='font-size:84px;font-weight:800;letter-spacing:-2px;line-height:1.05;'+NG)}
{A(f'<i style="width:90px;height:2px;background:{ACC};opacity:.6"></i><span class="dot"></span><i style="width:90px;height:2px;background:{ACC};opacity:.6"></i>',1.9,extra='display:flex;align-items:center;justify-content:center;gap:20px;margin:28px 0 20px')}
{A('Красота, созданная с заботой о тебе',2.1,extra='font-size:44px;font-weight:800;'+NG)}</div>
{A('Запись в Direct или WhatsApp →',2.7,'pop',cls='btn',extra='top:1440px')}
{A('@nadush_beauty',3.0,cls='handle',extra='top:1630px')}""")

scenes_html = "".join(f'<div class="scene" data-s="{s}" data-e="{e}">{h}</div>' for (s,e),h in zip(SCENES,S))
bars = "".join('<i><b></b></i>' for _ in range(9))
JS = f"""
const SC={json.dumps(SCENES)}; const T={TOTAL};
const ease=x=>1-Math.pow(1-Math.min(Math.max(x,0),1),3);
const cl=x=>Math.min(Math.max(x,0),1);
window.setTime=function(t){{
 document.querySelectorAll('.bars b').forEach((b,i)=>{{const[s,e]=SC[i];b.style.width=(cl((t-s)/(e-s))*100)+'%';}});
 document.querySelectorAll('.scene').forEach(sc=>{{
  const s=+sc.dataset.s,e=+sc.dataset.e; const last=e>=T;
  const vis = t>=s-0.01 && t<e+0.4;
  sc.style.display=vis?'block':'none'; if(!vis) return;
  const out = last?0:cl((t-(e-0.35))/0.35);
  sc.style.opacity=1-out; sc.style.filter=out>0?`blur(${{out*14}}px)`:'none';
  const lt=t-s;
  sc.querySelectorAll('.a').forEach(el=>{{
   const p=ease((lt-(+el.dataset.d))/0.7); const k=el.dataset.k;
   el.style.opacity=p;
   if(k==='up'){{el.style.translate=`0 ${{(1-p)*40}}px`; el.style.filter=p<1?`blur(${{(1-p)*14}}px)`:'none';}}
   else if(k==='pop'){{el.style.scale=0.85+0.15*p; el.style.filter=p<1?`blur(${{(1-p)*10}}px)`:'none';}}
  }});
  if(sc.querySelector('#iso')){{const q=ease((lt-2.6)/0.8); sc.querySelector('#iso').style.opacity=q; sc.querySelector('#glue').style.opacity=1-q;}}
  if(sc.querySelector('#knob')){{const q=ease((lt-1.8)/1.0); sc.querySelector('#knob').style.left=`calc(${{88-43*q}}% - 26px)`;
    sc.querySelector('#ok').style.opacity=q; sc.querySelector('#heavy').style.opacity=1-q;}}
  if(sc.querySelector('#logo')){{const tp=sc.querySelector('#logo textPath'); if(tp) tp.setAttribute('startOffset', (lt*1.5)+'%');}}
 }});
}};
"""
html = f"""<!doctype html><html><head><meta charset="utf-8">{FONTS}<style>{CSS}</style></head><body>
<div class="glow"></div><div class="bars">{bars}</div>
<div class="pill l"><span class="dot"></span>nadush_beauty</div><div class="pill r">Иерусалим</div>
{scenes_html}<script>{JS}</script></body></html>"""
open("reel.html","w").write(html)
