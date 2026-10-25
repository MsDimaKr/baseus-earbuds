import sys, math, json
sys.argv=['v2.py']; exec(open('v2.py').read())
EYE = eye_ref("fill", "#8F5B5C", "#9C6B5E", "#E2B9AE", TXT)
RED, GREEN, GCHK, GTXT = "#B84840", "#789078", "#8AA88A", "#4E6C54"
NG = "background:linear-gradient(135deg,#C9979A 0%,#A86F72 45%,#8F5B5C 100%);-webkit-background-clip:text;background-clip:text;color:transparent;display:inline-block"
SCENES = [(0,4.1),(4.1,8.6),(8.6,14.6),(14.6,19.6),(19.6,23.6),(23.6,29.6),(29.6,33.6),(33.6,38.6),(38.6,43.0)]
TOTAL = 43.0

def logo2():
    txt = "NADUSH BEAUTY • РЕСНИЦЫ • NADUSH BEAUTY • РЕСНИЦЫ • "
    return f"""<svg viewBox="0 0 480 480" width="480" height="480">
<defs><path id="cp" d="M240,240 m-196,0 a196,196 0 1,1 392,0 a196,196 0 1,1 -392,0"/>
<radialGradient id="lg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C9979A"/><stop offset="1" stop-color="#8F5B5C"/></radialGradient></defs>
<text id="ring" font-family="Manrope" font-size="30" font-weight="600" letter-spacing="6" fill="{TXT}"><textPath href="#cp">{txt}</textPath></text>
<circle cx="240" cy="240" r="130" fill="url(#lg)" style="filter:drop-shadow(0 20px 30px rgba(48,37,34,.2))"/>
<text x="240" y="292" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-size="170" fill="{BG}">N</text></svg>"""

CSS = BASE_CSS + f"""
.glow{{position:absolute;inset:-80px;background:
 radial-gradient(circle at 12% 17%, rgba(183,127,128,.32), transparent 38%),
 radial-gradient(circle at 90% 50%, rgba(183,127,128,.26), transparent 36%),
 radial-gradient(circle at 32% 90%, rgba(183,127,128,.20), transparent 38%),
 radial-gradient(circle at 60% 35%, rgba(255,255,255,.55), transparent 33%)}}
.bars i{{position:relative;overflow:hidden}} .bars i b{{position:absolute;left:0;top:0;bottom:0;background:{TXT};width:0}}
.scene{{position:absolute;inset:0;opacity:0}} .a{{opacity:0}}
.L{{position:absolute;left:0;right:0;text-align:center;white-space:nowrap}}
.tag{{position:absolute;left:50%;transform:translateX(-50%);top:280px;height:66px;padding:0 32px;border-radius:34px;font-size:28px;font-weight:700;letter-spacing:2px;background:{TXT};color:{BG};white-space:nowrap;display:flex;align-items:center;gap:14px}}
.tag em{{font-style:normal;color:#D9A39A}}
.sans{{font-weight:700;letter-spacing:-2px}}
.card{{position:absolute;left:70px;right:70px;border-radius:44px;background:{BG};border:1px solid rgba(255,255,255,.7);
 box-shadow:0 30px 60px rgba(48,37,34,.09), inset 0 2px 0 rgba(255,255,255,.8)}}
.sph{{width:90px;height:90px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;color:#fff;font-size:34px;font-weight:700;
 background:radial-gradient(circle at 35% 30%,#EBC6BE,#B97B78 60%,#8F5B5C);box-shadow:0 8px 16px rgba(143,91,92,.3)}}
.chip{{display:inline-flex;align-items:center;justify-content:center;border-radius:60px;background:{BG};font-weight:600;
 box-shadow:0 14px 34px rgba(48,37,34,.08), inset 0 1px 0 rgba(255,255,255,.8)}}
.pk{{position:relative;width:78px;height:78px;border-radius:50%;flex:none;display:inline-flex;align-items:center;justify-content:center;border:3px solid rgba(138,168,138,.5)}}
.pf{{position:absolute;inset:-3px;border-radius:50%;background:{GCHK};transform:scale(0)}}
.pc{{position:relative;width:34px;height:34px;opacity:0}}
.gsph{{width:90px;height:90px;border-radius:50%;flex:none;position:relative;display:inline-flex;align-items:center;justify-content:center;
 background:radial-gradient(circle at 35% 30%,#C7D6C3,#8AA88A 60%,#5E7E62);box-shadow:0 8px 16px rgba(78,108,84,.3)}}
#shine{{position:absolute;top:-20px;bottom:-20px;width:120px;left:-200px;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg)}}
.cta{{position:absolute;left:50%;transform:translateX(-50%);top:1424px;height:76px;padding:0 32px;border-radius:40px;background:{BG};
 box-shadow:0 10px 30px rgba(48,37,34,.08), inset 0 1px 0 rgba(255,255,255,.8);display:flex;align-items:center;font-size:30px;font-weight:500;white-space:nowrap}}
"""
CHECK = '<svg class="pc" viewBox="0 0 34 34"><path d="M7,18 L14,25 L27,10" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def A(html, d, k="up", style="", cls="", tag="div"):
    return f'<{tag} class="a {cls}" data-d="{d}" data-k="{k}" style="{style}">{html}</{tag}>'
def line(txt, center, size, d, cls="sans", extra=""):
    return A(txt, d, cls="L "+cls, style=f"top:{center-size*0.6:.0f}px;height:{size*1.2:.0f}px;line-height:{size*1.2:.0f}px;font-size:{size}px;{extra}")
def TAG(n, s): return A(f'<em>{n}</em>{s}' if n else s, 0.1, cls='tag')
def TITLE(a, b, d=0.15):
    return line(a, 436, 84, d) + (line(b, 540, 104, d+0.15, cls="serif") if b else "")

S = []
# 1 hook
S.append(f"""{A(EYE,0.0,'fade',style='position:absolute;left:140px;top:250px;width:800px')}
{line('Портятся ли',890,111,0.4)}{line('свои ресницы',1058,192,0.5,'serif','line-height:1;')}{line('после',1199,111,0.6)}{line('наращивания?',1307,111,0.7)}
{A('Честный ответ мастера <span id="bob" style="display:inline-block;margin-left:10px">↓</span>',1.3,cls='cta')}""")
# 2 short
items = "".join(A(f'<span class="sph">{i+1}</span>{s}', 1.4+i*0.3, cls='card', style=f'top:{1112+i*177}px;height:147px;display:flex;align-items:center;gap:31px;padding:0 40px;font-size:48px;font-weight:600') for i,s in enumerate(["Техника","Правильная нагрузка","Бережное снятие"]))
S.append(f"""{A('КОРОТКИЙ ОТВЕТ',0.1,cls='tag',style='top:330px')}
{line('Не',512,160,0.15,'serif')}{line('обязательно.',641,160,0.25,'serif')}
{A('Само по себе наращивание не означает,<br>что натуральные ресницы испортятся.<br>Важны:',0.6,cls='L',style='top:737px;font-size:42px;line-height:60px;color:#4a3d39')}{items}""")
# 3 isolation
LASHES=[]
for i in range(15):
    x = 81 + i*61; base = 542 + 48*((x-470)/470)**2; h = 290 + 40*(i/14)
    j = i - (i % 2); tx = 81 + j*61 + 60
    LASHES.append(dict(x=round(x), by=round(base), gy=round(base-h), gtx=round(tx), gcx=round(x+(16 if i%2==0 else -16)), itx=round(x+26+i*3.5), icx=round(x-8), cy=round(base-h*0.6)))
lsvg = "".join('<path class="ls" stroke-width="8" fill="none" stroke-linecap="round"/>' for _ in LASHES)
ticks = "".join(f'<path d="M{L["x"]+10},{L["by"]-60} l6,-30" stroke="rgba(140,120,110,.55)" stroke-width="4" stroke-linecap="round"/>' for L in LASHES)
skin = f'<path d="M0,590 Q470,494 940,590 L940,715 L0,715Z" fill="url(#sk)"/><path d="M0,590 Q470,494 940,590" stroke="{TXT}" stroke-width="5" fill="none"/><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9B8AA"/><stop offset="1" stop-color="#C49A8C"/></linearGradient></defs>'
chip = "position:absolute;left:50%;transform:translateX(-50%);top:41px;height:86px;padding:0 36px;border-radius:44px;color:#fff;font-size:40px;font-weight:700;display:flex;align-items:center;white-space:nowrap"
S.append(f"""{TAG('01','ИЗОЛЯЦИЯ')}{TITLE('Каждая ресница —','отдельно')}
{A(f'''<svg id="isosvg" viewBox="0 0 940 715" width="940" style="position:absolute;left:0;top:0">{lsvg}<g id="ticks" opacity="0">{ticks}</g>{skin}<circle id="mag" cx="-200" cy="380" r="108" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-width="5"/></svg>
<div id="glue" style="{chip};background:{RED}">✕ Склейка</div><div id="iso" style="{chip};background:{GREEN};opacity:0">✓ Изоляция</div>''',0.4,cls='card',style='top:642px;height:715px;overflow:hidden')}
{A('Каждая ресница остаётся свободной —<br>без склеек с соседними',2.0,cls='L',style='top:1422px;font-size:46px;line-height:60px;color:#4a3d39')}""")
# 4 length
S.append(f"""{TAG('02','ДЛИНА И ОБЪЁМ')}{TITLE('Под <span class="serif" style="font-size:104px;letter-spacing:0">ваши</span>','натуральные ресницы')}""".replace(line('натуральные ресницы',540,104,0.3,'serif'), line('натуральные ресницы',540,84,0.3)) + f"""
{A(f'''<div style="position:absolute;left:60px;top:67px;font-size:36px;font-weight:500;color:#4a3d39">Нагрузка на натуральную ресницу</div>
<div style="position:absolute;left:60px;right:60px;top:166px;height:39px;border-radius:20px;background:linear-gradient(90deg,#AEC0A8,#D8B890 50%,#C06058)"></div>
<div style="position:absolute;left:291px;width:244px;top:153px;height:65px;border-radius:34px;border:4px solid {TXT};background:rgba(138,168,138,.22)"></div>
<div id="knob" style="position:absolute;left:60px;top:149px;width:73px;height:73px;margin-left:-36px;border-radius:50%;background:#fff;box-shadow:0 8px 18px rgba(48,37,34,.25);display:flex;align-items:center;justify-content:center"><i style="width:30px;height:30px;border-radius:50%;background:{TXT}" id="kdot"></i></div>
<div style="position:absolute;left:60px;right:60px;top:252px;display:flex;justify-content:space-between;font-size:32px;color:#5a4d49"><span>лёгкая</span><b style="color:{TXT}">оптимальная</b><span>перегруз</span></div>
<div id="heavy" style="position:absolute;left:0;right:0;top:350px;text-align:center;font-size:44px;font-weight:700;color:{RED};opacity:0">Слишком тяжело ✕</div>
<div id="ok" style="position:absolute;left:0;right:0;top:350px;text-align:center;font-size:44px;font-weight:700;color:{GTXT};opacity:0">В самый раз ✓</div>''',0.4,cls='card',style='top:702px;height:464px')}
<div class="L" style="top:1302px;display:flex;justify-content:center;gap:22px">{A('Длина ✓',3.15,tag='span',cls='chip',style='height:100px;padding:0 40px;font-size:40px')}{A('Объём ✓',3.3,tag='span',cls='chip',style='height:100px;padding:0 40px;font-size:40px')}</div>""")
# 5 clean
rows = "".join(A(f'<span class="pk" data-d="{0.7+i*0.35}"><b class="pf"></b>{CHECK}</span>{s}', 0.5+i*0.35, style=f'position:absolute;left:55px;right:40px;top:{30+i*155}px;height:155px;display:flex;align-items:center;gap:37px;font-size:50px;font-weight:600;'+('border-top:2px solid rgba(48,37,34,.07);' if i else '')) for i,s in enumerate(["Контроль чистоты работы","Отсутствие склеек","Каждая ресница свободна"]))
S.append(f"""{TAG('03','ЧИСТОТА РАБОТЫ')}{TITLE('Контроль','каждой детали')}
{A(rows,0.4,'fade',cls='card',style='top:760px;height:523px')}""")
# 6 removal
S.append(f"""{TAG('04','СНЯТИЕ')}{line('Только <span class="serif" style="font-size:104px;letter-spacing:0">бережно</span>',454,84,0.15)}
{A(f'''<div style="position:absolute;left:60px;top:52px;font-size:32px;font-weight:800;letter-spacing:4px;color:{RED}">⚠ НЕЛЬЗЯ</div>
<div style="position:absolute;left:60px;right:50px;top:128px;font-size:47px;line-height:65px;font-weight:700">выдёргивать наращённые<br>ресницы самостоятельно или<br>тянуть их</div>''',0.4,cls='card',style='top:642px;height:369px;background:linear-gradient(160deg,#F7E4E0,#F3E8E1)')}
{A(f'''<svg viewBox="0 0 1080 400" width="1080"><path d="M313,350 Q540,320 767,350" stroke="{TXT}" stroke-width="6" fill="none" stroke-linecap="round"/>
 <g id="pull"><path d="M535,337 Q528,250 575,180" stroke="{TXT}" stroke-width="8" fill="none" stroke-linecap="round"/>
 <path d="M640,300 L640,170 M615,197 L640,170 L665,197" stroke="{RED}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
 <circle id="nc" cx="540" cy="253" r="123" stroke="{RED}" stroke-width="12" fill="none" stroke-dasharray="773" stroke-dashoffset="773" transform="rotate(-90 540 253)"/>
 <path id="nl" d="M455,342 L625,164" stroke="{RED}" stroke-width="12" stroke-linecap="round" stroke-dasharray="246" stroke-dashoffset="246"/></svg>''',0.9,'fade',style='position:absolute;left:0;top:1000px')}
{A(f'<span class="gsph pk2" data-d="3.4">{CHECK.replace("class=\"pc\"","class=\"pc\" style=\"opacity:1\"")}</span><span>Аккуратное снятие у мастера —<br>без выдёргивания</span>',3.1,cls='card',style='top:1473px;height:177px;display:flex;align-items:center;gap:31px;padding:0 40px;font-size:46px;line-height:54px;font-weight:600')}""")
# 7 honest
S.append(A(f'''<div class="serif" style="position:absolute;left:68px;top:76px;font-size:92px;line-height:1">Честно:</div>
<div style="position:absolute;left:68px;right:60px;top:212px;font-size:56px;line-height:73px;font-weight:500">При правильной технике<br>риск повреждения<br><b style="background:linear-gradient(transparent 58%,#EBC9C1 58%)">снижается</b>, но полностью<br>исключить индивидуальные<br>реакции и осложнения<br>нельзя.</div>''',0.3,cls='card',style='left:68px;right:68px;top:562px;height:718px'))
# 8 prof
S.append(f"""{A('Профессионализм —',0.25,cls='sans',style='position:absolute;left:70px;top:405px;font-size:86px;line-height:108px;white-space:nowrap')}
{A('это не только<br>красивый эффект.',0.5,cls='serif',style='position:absolute;left:70px;top:527px;font-size:104px;line-height:104px')}
{A('Это внимание к каждой детали,<br>которую клиентка не всегда может<br>увидеть сама.',1.1,style='position:absolute;left:70px;top:790px;font-size:49px;line-height:69px;font-weight:500;color:#3d322f')}
{A('Красота',2.45,cls='chip',style='position:absolute;left:158px;top:1346px;width:313px;height:124px;font-size:50px;font-weight:700')}
{A('<span id="plus" style="display:inline-block">+</span>',2.7,style=f'position:absolute;left:500px;top:1372px;width:50px;text-align:center;font-size:56px;color:{ACC};line-height:60px')}
{A('Качество',2.85,cls='chip',style='position:absolute;left:577px;top:1346px;width:345px;height:124px;font-size:50px;font-weight:700')}""")
# 9 final
S.append(f"""{A(logo2(),0.0,'pop',style='position:absolute;left:300px;top:300px;width:480px')}
{line('Надежда Дидковская',877,76,0.35)}{line('Наращивание и ламинирование ресниц',970,36,0.45,'','font-weight:500;color:#4a3d39')}
{line(f'<span style="{NG}">Твои ресницы заслуживают</span>',1068,54,0.6,'','font-weight:800;letter-spacing:-1px')}
{line(f'<span style="{NG}">бережного отношения</span>',1150,82,0.7,'','font-weight:800;letter-spacing:-2px')}
{A(f'<i style="width:90px;height:2px;background:{ACC};opacity:.6"></i><span class="dot"></span><i style="width:90px;height:2px;background:{ACC};opacity:.6"></i>',0.8,style='position:absolute;left:0;right:0;top:1212px;display:flex;align-items:center;justify-content:center;gap:20px')}
{line(f'<span style="{NG}">Красота, созданная с заботой о тебе</span>',1272,42,0.85,'','font-weight:800')}
{A('<span style="position:relative;z-index:1">Запись в Direct или WhatsApp →</span><i id="shine"></i>',0.95,'pop',style=f'position:absolute;left:100px;right:100px;top:1335px;height:150px;border-radius:80px;background:{TXT};color:{BG};display:flex;align-items:center;justify-content:center;font-size:46px;font-weight:700;box-shadow:0 30px 50px rgba(48,37,34,.25);overflow:hidden')}
{line('@nadush_beauty',1552,40,1.2,'','font-weight:600;color:#4a3d39')}""")

scenes_html = "".join(f'<div class="scene" data-s="{s}" data-e="{e}">{h}</div>' for (s,e),h in zip(SCENES,S))
bars = "".join('<i><b></b></i>' for _ in range(9))
JS = """
const SC=@SC, LS=@LS, T=@T;
const cl=x=>Math.min(Math.max(x,0),1); const ease=x=>1-Math.pow(1-cl(x),3);
window.setTime=function(t){
 const g=document.querySelector('.glow'); g.style.transform=`translate(${Math.sin(t*0.35)*60}px,${Math.cos(t*0.27)*50}px)`;
 document.querySelectorAll('.bars b').forEach((b,i)=>{const[s,e]=SC[i];b.style.width=(cl((t-s)/(e-s))*100)+'%';});
 document.querySelectorAll('.scene').forEach(sc=>{
  const s=+sc.dataset.s,e=+sc.dataset.e, last=e>=T;
  const vis=t>=s && t<e; sc.style.display=vis?'block':'none'; if(!vis) return;
  const out=last?0:cl((t-(e-0.3))/0.3); sc.style.opacity=1-out; sc.style.filter=out>0?`blur(${out*14}px)`:'none';
  const lt=t-s;
  sc.querySelectorAll('.a').forEach(el=>{const p=ease((lt-(+el.dataset.d))/0.4), k=el.dataset.k; el.style.opacity=p;
   if(k==='up'){el.style.translate=`0 ${(1-p)*24}px`; el.style.filter=p<1?`blur(${(1-p)*14}px)`:'none';}
   else if(k==='pop'){el.style.scale=0.88+0.12*p; el.style.filter=p<1?`blur(${(1-p)*10}px)`:'none';}});
  const svg=sc.querySelector('#isosvg'); if(svg){
   const mx=-100+1150*cl((lt-1.25)/1.45), mg=svg.querySelector('#mag'); mg.setAttribute('cx',mx); mg.style.opacity=(lt>1.2&&lt<3.0)?1:0;
   svg.querySelectorAll('.ls').forEach((p,i)=>{const L=LS[i], q=ease((mx-L.x+20)/90);
    p.setAttribute('d',`M${L.x},${L.by} Q${L.gcx+(L.icx-L.gcx)*q},${L.cy} ${L.gtx+(L.itx-L.gtx)*q},${L.gy}`);
    const c0=[184,80,72],c1=[48,37,34]; p.setAttribute('stroke',`rgb(${c0.map((v,k)=>Math.round(v+(c1[k]-v)*q)).join(',')})`);});
   svg.querySelector('#ticks').style.opacity=ease((lt-2.9)/0.4);
   const q=ease((lt-2.95)/0.35); sc.querySelector('#iso').style.opacity=q; sc.querySelector('#glue').style.opacity=1-q; sc.querySelector('#iso').style.scale=0.85+0.15*q;}
  const kn=sc.querySelector('#knob'); if(kn){const a=ease((lt-1.1)/0.65), b=ease((lt-2.55)/0.45); const pos=0.02+0.96*a-0.53*b;
   kn.style.left=(60+820*pos)+'px'; const dot=sc.querySelector('#kdot');
   const gr=b; dot.style.background=`rgb(${Math.round(48+(78-48)*gr)},${Math.round(37+(108-37)*gr)},${Math.round(34+(84-34)*gr)})`;
   sc.querySelector('#heavy').style.opacity=ease((lt-1.65)/0.2)*(1-ease((lt-2.6)/0.2)); sc.querySelector('#ok').style.opacity=ease((lt-2.9)/0.25);}
  sc.querySelectorAll('.pk').forEach(k=>{const q=cl((lt-(+k.dataset.d))/0.3); const s=q<0.8?q*1.25:1+(1-q)*0.25*1.25-0.0;
   k.querySelector('.pf').style.transform=`scale(${q>=1?1:s})`; k.querySelector('.pc').style.opacity=cl((lt-(+k.dataset.d)-0.15)/0.2);});
  const pk2=sc.querySelector('.pk2'); if(pk2){const q=ease((lt-3.4)/0.3); pk2.style.scale=0.6+0.4*q;}
  const pull=sc.querySelector('#pull'); if(pull){pull.style.transform=`translateY(${-Math.abs(Math.sin(lt*4))*14}px)`;
   sc.querySelector('#nc').setAttribute('stroke-dashoffset',773*(1-ease((lt-2.1)/0.25))); sc.querySelector('#nl').setAttribute('stroke-dashoffset',246*(1-ease((lt-2.25)/0.2)));}
  const pl=sc.querySelector('#plus'); if(pl) pl.style.transform=`rotate(${180*ease((lt-3.5)/0.5)}deg)`;
  const sh=sc.querySelector('#shine'); if(sh){const c=((lt-3.3)%2.6+2.6)%2.6; sh.style.left=(lt<3.3?-200:(-200+1100*cl(c/0.9)))+'px';}
  const bob=sc.querySelector('#bob'); if(bob) bob.style.transform=`translateY(${Math.sin(lt*5)*6}px)`;
  const eb=sc.querySelector('#rbr'); if(eb){eb.setAttribute('width',720*ease((lt-0.2)/0.4)); sc.querySelector('#rlr').setAttribute('width',720*ease((lt-0.2)/0.4));
   sc.querySelector('#eiris').style.transform=`scale(${0.3+0.7*ease((lt-0.1)/0.25)})`;
   const bl=x=>{const d=Math.abs(lt-x);return d<0.12?1-d/0.12:0;}; sc.querySelector('#eball').style.transform=`scaleY(${1-0.8*Math.max(bl(1.32),bl(3.02))})`;}
  const rg=sc.querySelector('#ring'); if(rg) rg.setAttribute('transform',`rotate(${lt*14} 240 240)`);
 });
};""".replace("@SC",json.dumps(SCENES)).replace("@LS",json.dumps(LASHES)).replace("@T",str(TOTAL))
html = f"""<!doctype html><html><head><meta charset="utf-8">{FONTS}<style>{CSS}</style></head><body>
<div class="glow"></div><div class="bars">{bars}</div>
<div class="pill l"><span class="dot"></span>nadush_beauty</div><div class="pill r">Иерусалим</div>
{scenes_html}<script>{JS}</script></body></html>"""
open("reel.html","w").write(html)
