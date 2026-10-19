// Renders the KSP batteries promo (GP, NITECORE, Westinghouse) to PNG (1080×1350).
// Usage: node ksp-batteries-promo/render.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const dir = __dirname;
const img = (f) => 'file://' + path.join(dir, 'src', f);

const P = {
  gp: { logo: 'gp-logo.png', note: 'Скидка 15% на весь бренд', name: 'GP Ultra Alkaline', size: '8 батареек AA + 4 AAA', img: 'gp-ultra-8aa-4aaa.jpg', now: '17', was: '20' },
  nitecore: { logo: 'nitecore-logo.png', note: 'Скидка 20% на весь бренд', name: 'NITECORE 21700', size: 'Аккумулятор USB, 5300 mAh', img: 'nitecore-21700.jpg', now: '125', was: '157' },
  westinghouse: { logo: 'westinghouse-logo.png', note: 'Скидка 40% на батарейки бренда', name: 'Westinghouse', size: '8 щелочных батареек AAA', img: 'westinghouse-8aaa.jpg', now: '9', was: '15' },
};

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; font-family: 'Inter', sans-serif; color: #1d2a44;
  background: radial-gradient(circle at 15% 0%, #ffffff 0%, #f2f5ea 45%, #e4ebd6 100%); overflow: hidden; position: relative; }
.bolts span { position: absolute; color: #d6e2b8; font-family: 'DejaVu Sans'; }
.wrap { position: relative; padding: 48px 52px 0; height: 100%; display: flex; flex-direction: column; }
.kicker { font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 22px; color: #5a7a2a; }
h1 { font-family: 'Inter Display'; font-weight: 900; font-size: 74px; line-height: 1.02; letter-spacing: -.02em; margin-top: 10px; }
h1 em { font-style: normal; color: #c8102e; }
.brands { margin-top: 14px; font-size: 26px; font-weight: 600; color: #3c4d6b; }
.promo { position: absolute; top: 44px; right: 52px; width: 200px; height: 200px; border-radius: 50%;
  background: #c8102e; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 14px 30px rgba(200,16,46,.35); transform: rotate(8deg); text-align: center; }
.promo small { font-size: 21px; font-weight: 700; line-height: 1.1; }
.promo b { font-family: 'Inter Display'; font-weight: 900; font-size: 54px; line-height: 1; }
.head { min-height: 250px; }
.grid { flex: 1; min-height: 0; display: grid; gap: 18px; margin-top: 30px;
  grid-template-columns: 1fr 1fr; grid-template-rows: 1.15fr 1fr; grid-template-areas: 'a a' 'b c'; }
.card { min-height: 0; min-width: 0; position: relative; background: #fff; border-radius: 26px; overflow: hidden; box-shadow: 0 10px 28px rgba(29,42,68,.12); display: flex; flex-direction: column; }
.card .ph { flex: 1; min-height: 0; position: relative; }
.card .ph img.prod { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: contain; padding: 14px; }
.card.row { flex-direction: row; }
.card.row .ph { flex: 0 0 56%; }
.card.row .info { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px 28px 20px 4px; }
.off { position: absolute; top: 14px; left: 14px; background: #c8102e; color: #fff; font-weight: 800; font-size: 24px; padding: 6px 14px; border-radius: 999px; z-index: 1; }
.info { padding: 4px 24px 20px; }
.logo { height: 40px; width: auto; max-width: 220px; object-fit: contain; display: block; align-self: flex-start; }
.info .n { font-weight: 800; font-size: 25px; line-height: 1.15; margin-top: 4px; }
.info .s { font-size: 19px; color: #5b6b86; margin-top: 3px; }
.info .d { font-size: 18px; color: #5a7a2a; font-weight: 700; margin-top: 6px; }
.price { display: flex; align-items: baseline; gap: 12px; margin-top: 8px; }
.price .now { font-family: 'Inter Display'; font-weight: 900; font-size: 44px; color: #c8102e; }
.price .was { font-size: 22px; color: #8a97ad; text-decoration: line-through; }
.foot { height: 112px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.foot .ksp { background: #fff; padding: 8px 20px; border-radius: 16px; box-shadow: 0 6px 18px rgba(29,42,68,.12); flex: none; }
.foot .ksp img { height: 54px; display: block; }
.foot p { font-size: 19px; color: #3c4d6b; line-height: 1.35; text-align: right; }
`;

const bolts = () => {
  let s = '', seed = 11;
  const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 22; i++) s += `<span style="left:${(r() * 1060) | 0}px;top:${(r() * 1330) | 0}px;font-size:${(16 + r() * 26) | 0}px;opacity:${(0.35 + r() * 0.5).toFixed(2)}">⚡</span>`;
  return `<div class="bolts">${s}</div>`;
};

const pct = (p) => Math.round((1 - p.now / p.was) * 100);

const card = (p, area, row = false) => `
<div class="card${row ? ' row' : ''}" style="grid-area:${area}">
  <div class="ph"><img class="prod" src="${img(p.img)}"><div class="off">−${pct(p)}%</div></div>
  <div class="info">
    <img class="logo" src="${img(p.logo)}">
    <div class="n">${p.name}</div><div class="s">${p.size}</div>
    <div class="d">${p.note}</div>
    <div class="price"><span class="now">${p.now} ₪</span><span class="was">${p.was} ₪</span></div>
  </div>
</div>`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${css}</style></head>
<body>${bolts()}<div class="wrap">
  <div class="head"><div class="kicker">🔋 Батарейки со скидками в KSP</div>
  <h1>Заряжаемся<br>по <em>выгодной</em> цене</h1>
  <div class="brands">GP · NITECORE · Westinghouse</div></div>
  <div class="promo"><small>скидки<br>до</small><b>−40%</b></div>
  <div class="grid">${card(P.gp, 'a', true)}${card(P.nitecore, 'b')}${card(P.westinghouse, 'c')}</div>
  <div class="foot"><div class="ksp"><img src="${img('ksp-logo.png')}"></div><p>Скидки применяются в корзине при переходе по ссылкам.<br>До 31.10.2026 или до окончания запасов.</p></div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  const f = path.join(dir, 'out', 'ksp-batteries.html');
  fs.writeFileSync(f, html);
  await pg.goto('file://' + f);
  await pg.waitForLoadState('networkidle');
  await pg.screenshot({ path: path.join(dir, 'out', 'ksp-batteries.png') });
  fs.unlinkSync(f);
  console.log('wrote ksp-batteries.png');
  await browser.close();
})();
