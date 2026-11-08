// Renders the KSP Bosch accessories promo (green & blue series) to PNG (1080×1350).
// Usage: node ksp-bosch-promo/render.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const dir = __dirname;
const has = (f) => fs.existsSync(path.join(dir, 'src', f));
const img = (f) => 'file://' + path.join(dir, 'src', f);

const ROWS = [
  {
    brand: 'Зелёная серия', cls: 'green', note: 'для дома и DIY',
    items: [
      { name: 'Набор X-Line', size: '173 предмета: свёрла, биты, дюбели', img: 'bosch-xline-173.jpg', now: '35', was: '59' },
      { name: 'Ящик с инструментами', size: '73 предмета', img: 'bosch-toolbox-73.jpg', now: '89', was: '99' },
      { name: 'Набор V-Line', size: '103 свёрла и биты', img: 'bosch-vline-103.jpg', now: '89', was: '115' },
    ],
  },
  {
    brand: 'Синяя серия', cls: 'blue', note: 'профессиональная',
    items: [
      { name: 'Биты Extra Hard', size: '43 предмета, с держателем', img: 'bosch-extra-hard-43.jpg', now: '107', was: '149' },
      { name: 'Свёрла SDS Plus-1', size: '5 шт. для перфоратора', img: 'bosch-sds-plus-1.jpg', now: '35', was: '50' },
      { name: 'Губки Expert', size: '3 шлифовальные губки', img: 'bosch-expert-sponges.jpg', now: '22', was: '29' },
    ],
  },
];
ROWS.forEach((r) => (r.items = r.items.filter((p) => has(p.img))));
const pct = (p) => Math.round((1 - p.now / p.was) * 100);
const maxOff = Math.max(...ROWS.flatMap((r) => r.items.map(pct)));

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; font-family: 'Inter', sans-serif; color: #14202b;
  background: radial-gradient(circle at 15% 0%, #ffffff 0%, #eef1f3 45%, #dde3e8 100%); overflow: hidden; position: relative; }
.deco span { position: absolute; color: #c9d2da; font-family: 'DejaVu Sans'; }
.wrap { position: relative; padding: 48px 52px 0; height: 100%; display: flex; flex-direction: column; }
.kicker { font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 22px; color: #3c5566; }
h1 { font-family: 'Inter Display'; font-weight: 900; font-size: 74px; line-height: 1.02; letter-spacing: -.02em; margin-top: 10px; }
h1 em { font-style: normal; color: #c8102e; }
.bosch { font-family: 'Inter Display'; font-weight: 900; color: #e20015; letter-spacing: .04em; }
.brands { margin-top: 14px; font-size: 26px; font-weight: 600; color: #3a4a56; }
.promo { position: absolute; top: 44px; right: 52px; width: 200px; height: 200px; border-radius: 50%;
  background: #c8102e; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 14px 30px rgba(200,16,46,.35); transform: rotate(8deg); text-align: center; }
.promo small { font-size: 21px; font-weight: 700; line-height: 1.1; }
.promo b { font-family: 'Inter Display'; font-weight: 900; font-size: 54px; line-height: 1; }
.head { min-height: 250px; }
.rows { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 18px; margin-top: 24px; }
.sec { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.sec .lbl { display: flex; align-items: baseline; gap: 14px; margin: 0 0 8px 4px; }
.sec .lbl img { height: 40px; width: auto; display: block; align-self: flex-end; }
.sec .lbl b { font-family: 'Inter Display'; font-weight: 900; font-size: 30px; }
.sec .lbl span { font-size: 18px; font-weight: 600; color: #566470; }
.green .lbl b { color: #007a5e; }
.blue .lbl b { color: #00539b; }
.cards { flex: 1; min-height: 0; display: flex; gap: 16px; }
.card { flex: 1; min-width: 0; position: relative; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 28px rgba(26,35,64,.12); display: flex; flex-direction: column; }
.green .card { border-top: 6px solid #00a37a; }
.blue .card { border-top: 6px solid #1a6fc4; }
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
.foot p { font-size: 19px; color: #3a4a56; line-height: 1.35; text-align: right; }
`;

const deco = () => {
  let s = '', seed = 31;
  const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 22; i++) s += `<span style="left:${(r() * 1060) | 0}px;top:${(r() * 1330) | 0}px;font-size:${(14 + r() * 24) | 0}px;opacity:${(0.35 + r() * 0.5).toFixed(2)}">⚙</span>`;
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
  <div class="lbl">${r.logo ? `<img src="${img(r.logo)}" alt="${r.brand}">` : `<b>${r.brand}</b>`}<span>${r.note}</span></div>
  <div class="cards">${r.items.map(card).join('')}</div>
</div>`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${css}</style></head>
<body>${deco()}<div class="wrap">
  <div class="head"><div class="kicker">🔧 Аксессуары Bosch в KSP</div>
  <h1>Инструменты<br>по <em>выгодной</em> цене</h1>
  <div class="brands"><span class="bosch">BOSCH</span> · +10% поверх акций</div></div>
  <div class="promo"><small>скидки<br>до</small><b>−${maxOff}%</b></div>
  <div class="rows">${ROWS.map(section).join('')}</div>
  <div class="foot"><div class="ksp"><img src="${img('ksp-logo.png')}"></div><p>Скидки применяются в корзине при переходе по ссылкам.<br>До 30.11.2026 или до окончания запасов.</p></div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  const f = path.join(dir, 'out', 'ksp-bosch.html');
  fs.writeFileSync(f, html);
  await pg.goto('file://' + f);
  await pg.waitForLoadState('networkidle');
  await pg.screenshot({ path: path.join(dir, 'out', 'ksp-bosch.png') });
  fs.unlinkSync(f);
  console.log('wrote ksp-bosch.png');
  await browser.close();
})();
