import math, os, sys
OUT = sys.argv[1]
BG, ACC, TXT = "#F3E8E1", "#B77F80", "#302522"

FONTS = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500;1,600&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">'

BASE_CSS = f"""
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:1080px;height:1920px;overflow:hidden}}
body{{font-family:Manrope,sans-serif;color:{TXT};background:{BG};position:relative}}
.glow{{position:absolute;inset:0;background:
 radial-gradient(circle at 8% 18%, rgba(183,127,128,.26), transparent 38%),
 radial-gradient(circle at 95% 52%, rgba(183,127,128,.20), transparent 36%),
 radial-gradient(circle at 50% 98%, rgba(205,160,140,.22), transparent 40%);}}
.ring{{position:absolute;border:2px solid rgba(183,127,128,.16);border-radius:50%}}
.bars{{position:absolute;top:96px;left:60px;right:60px;display:flex;gap:10px}}
.bars i{{flex:1;height:5px;border-radius:3px;background:rgba(48,37,34,.13)}}
.bars i.on{{background:{TXT}}}
.pill{{position:absolute;top:136px;height:74px;padding:0 30px;border-radius:40px;background:{BG};
 box-shadow:0 10px 30px rgba(48,37,34,.07), inset 0 1px 0 rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.55);
 display:flex;align-items:center;font-size:30px;font-weight:500;gap:14px}}
.pill.l{{left:60px}} .pill.r{{right:60px}}
.dot{{width:16px;height:16px;border-radius:50%;background:{ACC}}}
.serif{{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;color:{ACC}}}
.center{{position:absolute;left:0;right:0;text-align:center}}
"""

def page(body, extra_css="", bars_on=1, glow=True):
    bars = "".join(f'<i class="{"on" if i<bars_on else ""}"></i>' for i in range(9))
    return f"""<!doctype html><html><head><meta charset="utf-8">{FONTS}<style>{BASE_CSS}{extra_css}</style></head>
<body>{'<div class="glow"></div>' if glow else ''}
<div class="ring" style="left:-200px;top:260px;width:1480px;height:1480px"></div>
<div class="ring" style="left:90px;top:560px;width:900px;height:900px"></div>
<div class="bars">{bars}</div>
<div class="pill l"><span class="dot"></span>nadush_beauty</div><div class="pill r">Иерусалим</div>
{body}</body></html>"""

def save(name, html):
    open(os.path.join(OUT, name + ".html"), "w").write(html)

# ---------- lash geometry ----------
def qb(P0, P1, P2, t):
    x = (1-t)**2*P0[0] + 2*(1-t)*t*P1[0] + t*t*P2[0]
    y = (1-t)**2*P0[1] + 2*(1-t)*t*P1[1] + t*t*P2[1]
    tx = 2*(1-t)*(P1[0]-P0[0]) + 2*t*(P2[0]-P1[0])
    ty = 2*(1-t)*(P1[1]-P0[1]) + 2*t*(P2[1]-P1[1])
    l = math.hypot(tx, ty); return (x, y), (tx/l, ty/l)

def lashes(P0, P1, P2, n, down=False, filled=True, lmin=34, lmax=96, w=6, t0=.08, t1=.97, a0=8, a1=58, color=TXT, sw=3):
    out = []
    for i in range(n):
        t = t0 + (t1-t0)*i/(n-1)
        (x, y), (tx, ty) = qb(P0, P1, P2, t)
        nx, ny = ((-ty, tx) if down else (ty, -tx))
        a = math.radians(a0 + (a1-a0)*t)
        dx, dy = nx*math.cos(a) + tx*math.sin(a), ny*math.cos(a) + ty*math.sin(a)
        L = lmin + (lmax-lmin)*(t**1.3)
        tip = (x+dx*L, y+dy*L)
        c = (x+nx*L*.62, y+ny*L*.62)
        if filled:
            rl = (x-tx*w/2, y-ty*w/2); rr = (x+tx*w/2, y+ty*w/2)
            c2 = (c[0]+tx*w*.5, c[1]+ty*w*.5)
            out.append(f'<path d="M{rl[0]:.1f},{rl[1]:.1f} Q{c[0]:.1f},{c[1]:.1f} {tip[0]:.1f},{tip[1]:.1f} Q{c2[0]:.1f},{c2[1]:.1f} {rr[0]:.1f},{rr[1]:.1f}Z" fill="{color}"/>')
        else:
            out.append(f'<path d="M{x:.1f},{y:.1f} Q{c[0]:.1f},{c[1]:.1f} {tip[0]:.1f},{tip[1]:.1f}" stroke="{color}" stroke-width="{sw}" fill="none" stroke-linecap="round"/>')
    return "".join(out)

# Eye A — thin line art
def eye_a():
    P0, P1, P2 = (70,190), (300,20), (540,170)
    L0, L1, L2 = (70,190), (300,330), (540,170)
    return f"""<svg viewBox="0 0 620 340" width="760">
<defs><radialGradient id="ia" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#D9AFA9"/><stop offset=".7" stop-color="{ACC}"/><stop offset="1" stop-color="#8E5E5E"/></radialGradient>
<clipPath id="ca"><path d="M{P0[0]},{P0[1]} Q{P1[0]},{P1[1]} {P2[0]},{P2[1]} Q{L1[0]},{L1[1]} {L0[0]},{L0[1]}Z"/></clipPath></defs>
<path d="M150,70 Q330,-10 520,70" stroke="{ACC}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>
<g clip-path="url(#ca)"><circle cx="300" cy="182" r="70" fill="url(#ia)" opacity=".9"/><circle cx="300" cy="182" r="30" fill="{TXT}"/><circle cx="318" cy="166" r="9" fill="#fff" opacity=".9"/></g>
<path d="M{P0[0]},{P0[1]} Q{P1[0]},{P1[1]} {P2[0]},{P2[1]}" stroke="{TXT}" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M{L0[0]},{L0[1]} Q{L1[0]},{L1[1]} {L2[0]},{L2[1]}" stroke="{TXT}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>
{lashes(P0,P1,P2,26,filled=False,lmin=26,lmax=80,sw=2.6)}
</svg>"""

# Eye B — closed eye, long fanned lashes
def eye_b():
    P0, P1, P2 = (60,110), (300,250), (560,100)
    return f"""<svg viewBox="0 0 620 360" width="760">
<path d="M150,40 Q330,-25 520,35" stroke="{ACC}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>
<path d="M{P0[0]},{P0[1]} Q{P1[0]},{P1[1]} {P2[0]},{P2[1]}" stroke="{TXT}" stroke-width="5" fill="none" stroke-linecap="round"/>
{lashes(P0,P1,P2,30,down=True,lmin=40,lmax=120,w=6.5,a0=-25,a1=45)}
<g fill="{ACC}" opacity=".8"><path d="M560,250 l6,16 16,6 -16,6 -6,16 -6,-16 -16,-6 16,-6z"/><path d="M95,250 l4,10 10,4 -10,4 -4,10 -4,-10 -10,-4 10,-4z" opacity=".7"/></g>
</svg>"""

# Eye C — soft filled almond, tapered lashes, glow
def eye_c():
    P0, P1, P2 = (70,195), (300,25), (545,170)
    L0, L1 = (70,195), (300,320)
    return f"""<svg viewBox="0 0 620 340" width="760">
<defs><radialGradient id="ic" cx=".42" cy=".38" r=".75"><stop offset="0" stop-color="#C99A92"/><stop offset=".55" stop-color="#8E5F5B"/><stop offset="1" stop-color="{TXT}"/></radialGradient>
<linearGradient id="wc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EBD9D0"/><stop offset=".5" stop-color="#FBF5F1"/></linearGradient>
<clipPath id="cc"><path d="M{P0[0]},{P0[1]} Q{P1[0]},{P1[1]} {P2[0]},{P2[1]} Q{L1[0]},{L1[1]} {L0[0]},{L0[1]}Z"/></clipPath></defs>
<path d="M{P0[0]},{P0[1]} Q{P1[0]},{P1[1]} {P2[0]},{P2[1]} Q{L1[0]},{L1[1]} {L0[0]},{L0[1]}Z" fill="url(#wc)"/>
<g clip-path="url(#cc)"><circle cx="305" cy="180" r="74" fill="url(#ic)"/><circle cx="305" cy="180" r="74" fill="none" stroke="{TXT}" stroke-width="3" opacity=".5"/><circle cx="305" cy="180" r="30" fill="{TXT}"/><circle cx="326" cy="160" r="11" fill="#fff" opacity=".9"/><circle cx="288" cy="198" r="4" fill="#fff" opacity=".6"/></g>
<path d="M{P0[0]},{P0[1]} Q{P1[0]},{P1[1]} {P2[0]},{P2[1]}" stroke="{TXT}" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M{L0[0]},{L0[1]} Q{L1[0]},{L1[1]} {P2[0]},{P2[1]}" stroke="{ACC}" stroke-width="3" fill="none" stroke-linecap="round"/>
{lashes(P0,P1,P2,34,lmin=30,lmax=105,w=6)}
</svg>"""

HOOK_CSS = """
.eye{position:absolute;left:0;right:0;top:330px;display:flex;justify-content:center}
.h1{top:830px;font-weight:700;font-size:112px;line-height:1.08;letter-spacing:-3px}
.h1 .serif{font-size:150px;letter-spacing:-1px;line-height:1}
.cta{position:absolute;left:50%;transform:translateX(-50%);top:1420px;height:76px;padding:0 32px;border-radius:40px;background:#F3E8E1;
 box-shadow:0 10px 30px rgba(48,37,34,.08), inset 0 1px 0 rgba(255,255,255,.8);display:flex;align-items:center;font-size:30px;font-weight:500;white-space:nowrap}
"""
def hook(eye_svg, glowhalo=False):
    halo = f'<div style="position:absolute;left:290px;top:300px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(183,127,128,.28),transparent 65%)"></div>' if glowhalo else ""
    return page(f"""{halo}<div class="eye">{eye_svg}</div>
<div class="center h1">Портятся ли<br><span class="serif">свои ресницы</span><br>после<br>наращивания?</div>
<div class="cta">Честный ответ мастера ↓</div>""", HOOK_CSS)

save("eye_A", hook(eye_a()))
save("eye_B", hook(eye_b()))
save("eye_C", hook(eye_c(), glowhalo=True))

# ---------- colour variants on checklist scene ----------
def checklist(variant):
    if variant == "A":   # flat milky, hairline plates
        css = f"""body{{background:{BG}}}
.card{{background:{BG};border:1.5px solid rgba(183,127,128,.35);box-shadow:none}}
.chk{{background:none;border:2.5px solid {ACC};color:{ACC}}}
.tag{{background:{TXT};color:{BG}}}"""
        glow = False
    elif variant == "B": # milky + powder glow, soft raised plates
        css = f""".card{{background:{BG};border:1px solid rgba(255,255,255,.7);box-shadow:0 30px 60px rgba(48,37,34,.09), inset 0 2px 0 rgba(255,255,255,.8)}}
.chk{{background:{ACC};color:{BG}}}
.tag{{background:{TXT};color:{BG}}}"""
        glow = True
    else:                # accent: rose details, stripe
        css = f"""body{{background:{BG}}}
.card{{background:{BG};border-left:8px solid {ACC};box-shadow:0 24px 50px rgba(183,127,128,.18)}}
.chk{{background:{ACC};color:{BG}}}
.row+.row{{border-top:1.5px dashed rgba(183,127,128,.35)}}
.tag{{background:{ACC};color:{BG}}}
.underline{{text-decoration:underline;text-decoration-color:{ACC};text-decoration-thickness:4px;text-underline-offset:14px}}"""
        glow = False
    common = f"""
.tag{{position:absolute;left:50%;transform:translateX(-50%);top:330px;padding:12px 26px;border-radius:30px;font-size:24px;font-weight:700;letter-spacing:3px}}
.t{{top:410px;font-size:84px;font-weight:700;letter-spacing:-2px;line-height:1.05}}
.t .serif{{font-size:104px;font-weight:500;letter-spacing:0}}
.card{{position:absolute;left:90px;right:90px;top:720px;border-radius:44px;padding:20px 50px}}
.row{{display:flex;align-items:center;gap:30px;padding:38px 0;font-size:40px;font-weight:600}}
.chk{{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;flex:none}}
.note{{top:1360px;font-size:36px;line-height:1.4;color:{TXT};opacity:.8;padding:0 120px}}
"""
    rows = "".join(f'<div class="row"><span class="chk">✓</span>{s}</div>' for s in ["Контроль чистоты работы","Отсутствие склеек","Каждая ресница свободна"])
    return page(f"""<div class="tag">03 ЧИСТОТА РАБОТЫ</div>
<div class="center t"><span class="underline">Контроль</span><br><span class="serif">каждой детали</span></div>
<div class="card">{rows}</div>
<div class="center note">Внимание к каждой мелочи — <span class="serif" style="font-size:44px">ради здоровья</span> ваших ресниц</div>""",
        common + css, bars_on=5, glow=glow)

for v in "ABC": save("color_" + v, checklist(v))

# ---------- end card text variants ----------
def logo():
    txt = "NADUSH BEAUTY • РЕСНИЦЫ • NADUSH BEAUTY • РЕСНИЦЫ • "
    return f"""<svg viewBox="0 0 440 440" width="440" height="440">
<defs><path id="cp" d="M220,220 m-185,0 a185,185 0 1,1 370,0 a185,185 0 1,1 -370,0"/>
<radialGradient id="lg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C9979A"/><stop offset="1" stop-color="#8F5B5C"/></radialGradient></defs>
<text font-family="Manrope" font-size="26" font-weight="600" letter-spacing="5" fill="{TXT}"><textPath href="#cp">{txt}</textPath></text>
<circle cx="220" cy="220" r="130" fill="url(#lg)" style="filter:drop-shadow(0 20px 30px rgba(48,37,34,.2))"/>
<text x="220" y="272" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-size="170" fill="{BG}">N</text></svg>"""

END_CSS = f"""
.logo{{position:absolute;left:320px;top:290px}}
.name{{top:820px;font-size:76px;font-weight:700;letter-spacing:-2px}}
.sub{{top:930px;font-size:36px;font-weight:500;opacity:.85}}
.btn{{position:absolute;left:100px;right:100px;height:150px;border-radius:80px;background:{TXT};color:{BG};display:flex;align-items:center;justify-content:center;font-size:46px;font-weight:700;box-shadow:0 30px 50px rgba(48,37,34,.25)}}
.handle{{position:absolute;left:0;right:0;text-align:center;font-size:40px;font-weight:600;opacity:.85}}
"""
def endcard(variant):
    if variant == "A":
        msg = f"""<div class="center" style="top:1040px">
<div class="serif" style="font-size:78px;line-height:1.05">Твои ресницы заслуживают<br>бережного отношения</div>
<div style="margin-top:34px;font-size:38px;font-weight:500;opacity:.85">Красота, созданная с заботой о тебе</div></div>"""
        btn_top = 1390
    elif variant == "B":
        msg = f"""<div class="center" style="top:1035px">
<div style="font-size:52px;font-weight:700;letter-spacing:-1px">Твои ресницы заслуживают</div>
<div class="serif" style="font-size:104px;line-height:1;margin-top:4px">бережного отношения</div>
<div style="display:flex;align-items:center;justify-content:center;gap:20px;margin:30px 0 22px"><i style="width:90px;height:2px;background:{ACC};opacity:.6"></i><span class="dot"></span><i style="width:90px;height:2px;background:{ACC};opacity:.6"></i></div>
<div class="serif" style="font-size:56px;color:{TXT}">Красота, созданная с заботой о тебе</div></div>"""
        btn_top = 1440
    else:
        msg = f"""<div style="position:absolute;left:110px;right:110px;top:1030px;padding:44px 50px 46px;border-radius:44px;background:{BG};text-align:center;
 border:1px solid rgba(255,255,255,.7);box-shadow:0 30px 60px rgba(48,37,34,.09), inset 0 2px 0 rgba(255,255,255,.8)">
<div class="serif" style="font-size:120px;line-height:.5;height:50px">“</div>
<div style="font-size:50px;font-weight:700;line-height:1.2;letter-spacing:-1px">Твои ресницы заслуживают<br><span class="serif" style="font-size:66px;font-weight:600">бережного отношения</span></div>
<div style="margin-top:22px;font-size:34px;font-weight:500;color:{ACC}">Красота, созданная с заботой о тебе ♡</div></div>"""
        btn_top = 1480
    return page(f"""<div class="logo">{logo()}</div>
<div class="center name">Надежда Дидковская</div>
<div class="center sub">Наращивание и ламинирование ресниц</div>
{msg}
<div class="btn" style="top:{btn_top}px">Запись в Direct или WhatsApp →</div>
<div class="handle" style="top:{btn_top+190}px">@nadush_beauty</div>""", END_CSS, bars_on=9)

for v in "ABC": save("text_" + v, endcard(v))
