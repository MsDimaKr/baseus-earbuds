import sys, math
sys.argv=['gen.py','mock']; exec(open('gen.py').read())
NORING = ".ring{display:none}"

def brow(style, fill):
    # filled tapered brow: inner (95,175) -> tail (650,205), peak around x=470
    top = "M95,175 C150,120 330,85 470,72 C560,66 620,120 655,205"
    bot = "C610,150 560,120 470,118 C340,122 190,165 110,215 Z"
    if style == "fill":
        hairs = "".join(f'<path d="M{78+i*9},{225-i*2} q{2-i*0.3},-28 {6+i},-52" stroke="{TXT}" stroke-width="3" fill="none" stroke-linecap="round"/>' for i in range(5))
        return f'''<path d="{top} {bot}" fill="{fill}"/>
<path d="M85,165 C145,105 330,70 470,57 C570,50 635,110 668,200" stroke="{TXT}" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="{top} {bot}" fill="none" stroke="{TXT}" stroke-width="3" opacity=".55"/>{hairs}'''
    # hair strokes brow
    out = []
    for i in range(70):
        t = i/69
        x = 100 + t*545
        ytop = 175 - 105*math.sin(min(t/0.68,1)*math.pi/2) + (0 if t<0.68 else 135*((t-0.68)/0.32)**1.4)
        ybot = 215 - 95*math.sin(min(t/0.68,1)*math.pi/2) + (0 if t<0.68 else 85*((t-0.68)/0.32)**1.2)
        if ytop > ybot: ytop, ybot = ybot-6, ytop
        lean = 10 + 28*t
        out.append(f'<path d="M{x-lean*0.3:.1f},{ybot:.1f} Q{x:.1f},{(ytop+ybot)/2:.1f} {x+lean:.1f},{ytop+4:.1f}" stroke="{fill if i%3 else TXT}" stroke-width="{3.4-1.6*t:.1f}" fill="none" stroke-linecap="round" opacity=".9"/>')
    return "".join(out)

def iris(cx, cy, r, rays, ringc, inner):
    s = [f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{inner}"/>']
    for i in range(56):
        a = 2*math.pi*i/56
        r1, r2 = r*0.42, r*(0.88 if i%2 else 0.96)
        s.append(f'<line x1="{cx+r1*math.cos(a):.1f}" y1="{cy+r1*math.sin(a):.1f}" x2="{cx+r2*math.cos(a):.1f}" y2="{cy+r2*math.sin(a):.1f}" stroke="{rays}" stroke-width="3" stroke-linecap="round"/>')
    s.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{ringc}" stroke-width="5"/>')
    s.append(f'<circle cx="{cx}" cy="{cy}" r="{r*0.38}" fill="{TXT}"/>')
    s.append(f'<circle cx="{cx+22}" cy="{cy-24}" r="17" fill="#fff"/><circle cx="{cx-30}" cy="{cy+10}" r="9" fill="#fff"/>')
    return "".join(s)

def eye_ref(browstyle, browfill, inner, rays, ringc):
    U0, U1, U2 = (140,345), (360,170), (610,300)
    D1 = (380,455)
    eyepath = f"M{U0[0]},{U0[1]} Q{U1[0]},{U1[1]} {U2[0]},{U2[1]} Q{D1[0]},{D1[1]} {U0[0]},{U0[1]}Z"
    lower = lambda n, **k: lashes((U0[0],U0[1]), D1, U2, n, down=True, **k)
    small = "".join(f'<path d="M{x},{y} q{d},12 {d*1.4},24" stroke="{TXT}" stroke-width="3.2" fill="none" stroke-linecap="round"/>' for x,y,d in [(262,428,-5),(292,436,-3),(325,440,-1)])
    return f"""<svg viewBox="0 0 720 480" width="800">
<defs><clipPath id="ce"><path d="{eyepath}"/></clipPath><clipPath id="rb"><rect id="rbr" x="0" y="0" width="720" height="480"/></clipPath><clipPath id="rl"><rect id="rlr" x="0" y="0" width="720" height="480"/></clipPath></defs>
<g clip-path="url(#rb)">{brow(browstyle, browfill)}</g>
<path d="{eyepath}" fill="#FBF6F2"/>
<g clip-path="url(#ce)">
 <path d="M{U0[0]},{U0[1]} Q{U1[0]},{U1[1]} {U2[0]},{U2[1]} L{U2[0]},{U2[1]+40} Q{U1[0]},{U1[1]+70} {U0[0]},{U0[1]+30}Z" fill="#E6D3CA"/>
 <g id="eiris" style="transform-origin:372px 325px">{iris(372, 325, 84, rays, ringc, inner)}</g>
</g>
<path d="M{U0[0]},{U0[1]} Q{U1[0]},{U1[1]} {U2[0]},{U2[1]}" stroke="{TXT}" stroke-width="9" fill="none" stroke-linecap="round"/>
<path d="M{U2[0]-40},{U2[1]-22} L672,258 L{U2[0]+2},{U2[1]+6} Z" fill="{TXT}" stroke="{TXT}" stroke-width="4" stroke-linejoin="round"/>
<path d="M{U0[0]},{U0[1]} Q{D1[0]},{D1[1]} {U2[0]},{U2[1]}" stroke="{TXT}" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M118,372 q10,-14 30,-22" stroke="{TXT}" stroke-width="3" fill="none" stroke-linecap="round"/>
<g clip-path="url(#rl)">{lashes(U0,U1,U2,56,lmin=50,lmax=74,w=5,t0=.06,t1=.97,a0=-4,a1=50)}
{lashes(U0,U1,U2,55,lmin=42,lmax=64,w=4.4,t0=.075,t1=.96,a0=2,a1=56)}
{lashes(U0,D1,U2,30,down=True,filled=False,lmin=18,lmax=24,t0=.32,t1=.96,a0=0,a1=38,sw=2.6)}
{small}</g>
</svg>"""

HOOK2 = HOOK_CSS.replace("top:330px", "top:270px").replace("top:830px", "top:880px").replace("top:1420px", "top:1470px")
def hook2(svg):
    return page(f"""<div class="eye">{svg}</div>
<div class="center h1">Портятся ли<br><span class="serif">свои ресницы</span><br>после<br>наращивания?</div>
<div class="cta">Честный ответ мастера ↓</div>""", HOOK2 + NORING)

save("v2_eye_A", hook2(eye_ref("fill", "#6E4A3E", "#C58B6A", "#8E5A3E", TXT)))        # closest to reference, honey iris
save("v2_eye_B", hook2(eye_ref("hair", "#7A5546", "#D4A7A3", ACC, "#8F5B5C")))         # hair-stroke brow, powder-rose iris
save("v2_eye_C", hook2(eye_ref("fill", "#8F5B5C", "#9C6B5E", "#E2B9AE", TXT)))         # rose-brown brow, chocolate iris

# final card: variant B, text bold in the N-circle colour
NGRAD = "background:linear-gradient(135deg,#C9979A 0%,#A86F72 45%,#8F5B5C 100%);-webkit-background-clip:text;background-clip:text;color:transparent"
msg = f"""<div class="center" style="top:1030px">
<div style="font-size:56px;font-weight:800;letter-spacing:-1px;{NGRAD};display:inline-block">Твои ресницы заслуживают</div><br>
<div style="font-size:84px;font-weight:800;letter-spacing:-2px;line-height:1.05;{NGRAD};display:inline-block">бережного отношения</div>
<div style="display:flex;align-items:center;justify-content:center;gap:20px;margin:28px 0 20px"><i style="width:90px;height:2px;background:{ACC};opacity:.6"></i><span class="dot"></span><i style="width:90px;height:2px;background:{ACC};opacity:.6"></i></div>
<div style="font-size:44px;font-weight:800;{NGRAD};display:inline-block">Красота, созданная с заботой о тебе</div></div>"""
save("v2_end", page(f"""<div class="logo">{logo()}</div>
<div class="center name">Надежда Дидковская</div>
<div class="center sub">Наращивание и ламинирование ресниц</div>
{msg}
<div class="btn" style="top:1440px">Запись в Direct или WhatsApp →</div>
<div class="handle" style="top:1630px">@nadush_beauty</div>""", END_CSS + NORING, bars_on=9))
