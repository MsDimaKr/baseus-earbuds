// Renders the KSP shaving promo (Gillette Venus, Gillette) to PNG (1080×1350).
// Usage: node ksp-shave-promo/render.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const dir = __dirname;
const has = (f) => fs.existsSync(path.join(dir, 'src', f));
const img = (f) => 'file://' + path.join(dir, 'src', f);

const ROWS = [
  {
    brand: 'Gillette Venus', cls: 'venus', note: 'для женщин · +5% к акции на весь бренд',
    items: [
      { name: 'Comfort Glide Sensitive', size: '5 лезвий, 6 кассет с алоэ', img: 'venus-comfortglide-sensitive-6.jpg', now: '65', was: '119' },
      { name: 'ComfortGlide Pro', size: '5 лезвий, 10 кассет, кокос', img: 'venus-comfortglide-pro-10.jpg', now: '84', was: '177' },
      { name: 'Deluxe Smooth Sensitive', size: 'Ручка + 3 кассеты', img: 'venus-deluxe-smooth.jpg', now: '39', was: '49' },
    ],
  },
  {
    brand: 'Gillette', cls: 'gillette', note: 'для мужчин · +5% к акции на весь бренд',
    items: [
      { name: 'Fusion5', size: '16 сменных кассет', img: 'gillette-fusion5-16.jpg', now: '133', was: '210' },
      { name: 'Fusion5 Power', size: 'Бритва + 1 кассета', img: 'gillette-fusion5-power.jpg', now: '38', was: '49' },
      { name: 'Гель Cooling', size: 'С эвкалиптом, 200 мл', img: 'gillette-gel-cooling.jpg', now: '11', was: '14' },
    ],
  },
];
ROWS.forEach((r) => (r.items = r.items.filter((p) => has(p.img))));
const pct = (p) => Math.round((1 - p.now / p.was) * 100);
const maxOff = Math.max(...ROWS.flatMap((r) => r.items.map(pct)));

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; font-family: 'Inter', sans-serif; color: #1a2340;
  background: radial-gradient(circle at 15% 0%, #ffffff 0%, #edf2f8 45%, #dbe4f0 100%); overflow: hidden; position: relative; }
.deco span { position: absolute; color: #c6d3e6; font-family: 'DejaVu Sans'; }
.wrap { position: relative; padding: 48px 52px 0; height: 100%; display: flex; flex-direction: column; }
.kicker { font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 22px; color: #3d5a8c; }
h1 { font-family: 'Inter Display'; font-weight: 900; font-size: 74px; line-height: 1.02; letter-spacing: -.02em; margin-top: 10px; }
h1 em { font-style: normal; color: #c8102e; }
.brands { margin-top: 14px; font-size: 26px; font-weight: 600; color: #3c4a68; }
.promo { position: absolute; top: 44px; right: 52px; width: 200px; height: 200px; border-radius: 50%;
  background: #c8102e; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 14px 30px rgba(200,16,46,.35); transform: rotate(8deg); text-align: center; }
.promo small { font-size: 21px; font-weight: 700; line-height: 1.1; }
.promo b { font-family: 'Inter Display'; font-weight: 900; font-size: 54px; line-height: 1; }
.head { min-height: 250px; }
.rows { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 18px; margin-top: 24px; }
.sec { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.sec .lbl { display: flex; align-items: baseline; gap: 14px; margin: 0 0 8px 4px; }
.sec .lbl b { font-family: 'Inter Display'; font-weight: 900; font-size: 30px; }
.sec .lbl span { font-size: 18px; font-weight: 600; color: #56617e; }
.venus .lbl b { color: #2f8f86; }
.gillette .lbl b { color: #1f3f99; }
.cards { flex: 1; min-height: 0; display: flex; gap: 16px; }
.card { flex: 1; min-width: 0; position: relative; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 28px rgba(26,35,64,.12); display: flex; flex-direction: column; }
.venus .card { border-top: 6px solid #6cc1b5; }
.gillette .card { border-top: 6px solid #f08a1c; }
.card .ph { flex: 1; min-height: 0; position: relative; }
.card .ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 12px 12px 4px; mix-blend-mode: multiply; }
.off { position: absolute; top: 12px; left: 12px; background: #c8102e; color: #fff; font-weight: 800; font-size: 20px; padding: 5px 12px; border-radius: 999px; z-index: 1; }
.info { padding: 2px 18px 14px; }
.info .n { font-weight: 800; font-size: 21px; line-height: 1.15; }
.info .s { font-size: 16px; color: #5b6580; margin-top: 2px; }
.price { display: flex; align-items: baseline; gap: 10px; margin-top: 2px; }
.price .now { font-family: 'Inter Display'; font-weight: 900; font-size: 38px; color: #c8102e; }
.price .was { font-size: 20px; color: #8a92aa; text-decoration: line-through; }
.foot { height: 112px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.foot .ksp { background: #fff; padding: 8px 20px; border-radius: 16px; box-shadow: 0 6px 18px rgba(26,35,64,.12); flex: none; }
.foot .ksp img { height: 54px; display: block; }
.foot p { font-size: 19px; color: #3c4a68; line-height: 1.35; text-align: right; }
`;

const deco = () => {
  let s = '', seed = 17;
  const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 22; i++) s += `<span style="left:${(r() * 1060) | 0}px;top:${(r() * 1330) | 0}px;font-size:${(14 + r() * 24) | 0}px;opacity:${(0.35 + r() * 0.5).toFixed(2)}">✦</span>`;
  return `<div class="deco">${s}</div>`;
};

const card = (p) => `
<div class="card">
  <div class="ph"><img src="${img(p.img)}"><div class="off">−${pct(p)}%</div></div>
  <div class="info">
    <div class="n">${p.name}</div><div class="s">${p.size}</div>
    <div class="price"><span class="now">${p.now} ₪</span><span class="was">${p.was} ₪</span></div>
  </div>
</div>`;

const section = (r) => `
<div class="sec ${r.cls}">
  <div class="lbl"><b>${r.brand}</b><span>${r.note}</span></div>
  <div class="cards">${r.items.map(card).join('')}</div>
</div>`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${css}</style></head>
<body>${deco()}<div class="wrap">
  <div class="head"><div class="kicker">🪒 Бритьё со скидкой в KSP</div>
  <h1>Гладко, остро —<br>и <em>выгодно</em></h1>
  <div class="brands">Gillette · Gillette Venus · +5% поверх акций</div></div>
  <div class="promo"><small>скидки<br>до</small><b>−${maxOff}%</b></div>
  <div class="rows">${ROWS.map(section).join('')}</div>
  <div class="foot"><div class="ksp"><img src="${img('ksp-logo.png')}"></div><p>Скидки применяются в корзине при переходе по ссылкам.<br>До 30.11.2026 или до окончания запасов.</p></div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  const f = path.join(dir, 'out', 'ksp-shave.html');
  fs.writeFileSync(f, html);
  await pg.goto('file://' + f);
  await pg.waitForLoadState('networkidle');
  await pg.screenshot({ path: path.join(dir, 'out', 'ksp-shave.png') });
  fs.unlinkSync(f);
  console.log('wrote ksp-shave.png');
  await browser.close();
})();
