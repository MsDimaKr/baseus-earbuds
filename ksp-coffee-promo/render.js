// Renders the KSP coffee promo (Salvador, San Martino, Biancaffe) to PNG (1080×1350).
// Usage: node ksp-coffee-promo/render.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const dir = __dirname;
const has = (f) => fs.existsSync(path.join(dir, 'src', f));
const img = (f) => 'file://' + path.join(dir, 'src', f);

const P = {
  salvador: { logo: 'salvador-logo.jpg', name: 'Salvador Gold', size: 'Кофе в зёрнах, 1 кг', note: '80% арабика, 20% робуста, средняя обжарка', promo: 'Скидка 20% на весь бренд', img: 'salvador-gold.jpg', now: '75', was: '93', badge: 20 },
  martino: { wordmark: 'San Martino', name: 'Top Quality Slow Roast', size: 'Кофе в зёрнах, 1 кг', note: '100% арабика, медленная обжарка, кошерный', promo: 'Скидка 20% на весь бренд', img: 'san-martino-top.jpg', now: '89', was: '111', badge: 20 },
  biancaffe: { logo: 'biancaffe-logo.png', name: 'Biancaffe Intenso', size: 'Кофе в зёрнах, 1 кг', note: 'Итальянский стиль, нотки карамели и кокоса', promo: '59 ₪ на все зёрна бренда', img: 'biancaffe-intenso.jpg', now: '59', was: '79' },
};
const pct = (p) => p.badge || Math.round((1 - p.now / p.was) * 100);

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; font-family: 'Inter', sans-serif; color: #2b1d14;
  background: radial-gradient(circle at 15% 0%, #fffaf2 0%, #f5eadb 45%, #e9d6bc 100%); overflow: hidden; position: relative; }
.beans span { position: absolute; color: #d9bf9c; font-family: 'DejaVu Sans'; }
.wrap { position: relative; padding: 48px 52px 0; height: 100%; display: flex; flex-direction: column; }
.kicker { font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 22px; color: #8a5a2b; }
h1 { font-family: 'Inter Display'; font-weight: 900; font-size: 74px; line-height: 1.02; letter-spacing: -.02em; margin-top: 10px; }
h1 em { font-style: normal; color: #c8102e; }
.brands { margin-top: 14px; font-size: 26px; font-weight: 600; color: #6b4a2e; }
.promo { position: absolute; top: 44px; right: 52px; width: 200px; height: 200px; border-radius: 50%;
  background: #c8102e; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 14px 30px rgba(200,16,46,.35); transform: rotate(8deg); text-align: center; }
.promo small { font-size: 21px; font-weight: 700; line-height: 1.1; }
.promo b { font-family: 'Inter Display'; font-weight: 900; font-size: 54px; line-height: 1; }
.head { min-height: 250px; }
.grid { flex: 1; min-height: 0; display: grid; gap: 18px; margin-top: 30px;
  grid-template-columns: 1fr 1fr; grid-template-rows: 0.82fr 1.18fr; grid-template-areas: 'a a' 'b c'; }
.card { min-height: 0; min-width: 0; position: relative; background: #fff; border-radius: 26px; overflow: hidden; box-shadow: 0 10px 28px rgba(60,35,15,.14); display: flex; flex-direction: column; }
.card .ph { flex: 1; min-height: 0; position: relative; }
.card .ph img.prod { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: contain; padding: 6px; }
.card.row { flex-direction: row; }
.card.row .ph { flex: 0 0 38%; }
.card.row .info { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px 28px 20px 8px; }
.off { position: absolute; top: 14px; left: 14px; background: #c8102e; color: #fff; font-weight: 800; font-size: 24px; padding: 6px 14px; border-radius: 999px; z-index: 1; }
.info { padding: 4px 24px 20px; }
.logo { height: 44px; width: auto; max-width: 200px; object-fit: contain; display: block; align-self: flex-start; }
.card.row .logo { height: 64px; max-width: 260px; }
.wm { font-family: 'DejaVu Serif', serif; font-weight: 700; font-size: 30px; color: #3a2414; line-height: 44px; height: 44px; }
.card.row .wm { height: 64px; line-height: 64px; font-size: 40px; }
.info .n { font-weight: 800; font-size: 25px; line-height: 1.15; margin-top: 4px; }
.info .s { font-size: 19px; color: #6b5a4b; margin-top: 3px; }
.info .d { font-size: 18px; color: #6b5a4b; margin-top: 6px; line-height: 1.3; }
.info .pr { font-size: 18px; color: #8a5a2b; font-weight: 700; margin-top: 6px; }
.price { display: flex; align-items: baseline; gap: 12px; margin-top: 8px; }
.price .now { font-family: 'Inter Display'; font-weight: 900; font-size: 44px; color: #c8102e; }
.card.row .price .now { font-size: 56px; }
.price .was { font-size: 22px; color: #9b8b7c; text-decoration: line-through; }
.gift { display: flex; align-items: center; gap: 14px; margin-top: 12px; background: #fbf1e1; border: 2px dashed #c9a06a; border-radius: 16px; padding: 8px 14px 8px 8px; }
.gift img { height: 70px; width: 100px; object-fit: contain; display: block; }
.gift span { font-size: 17px; line-height: 1.25; font-weight: 700; color: #6b4a2e; }
.foot { height: 112px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.foot .ksp { background: #fff; padding: 8px 20px; border-radius: 16px; box-shadow: 0 6px 18px rgba(60,35,15,.14); flex: none; }
.foot .ksp img { height: 54px; display: block; }
.foot p { font-size: 19px; color: #5a4331; line-height: 1.35; text-align: right; }
`;

const beans = () => {
  let s = '', seed = 5;
  const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 22; i++) s += `<span style="left:${(r() * 1060) | 0}px;top:${(r() * 1330) | 0}px;font-size:${(16 + r() * 26) | 0}px;opacity:${(0.35 + r() * 0.5).toFixed(2)};transform:rotate(${(r() * 180) | 0}deg)">☕</span>`;
  return `<div class="beans">${s}</div>`;
};

const brandMark = (p) => (p.logo ? `<img class="logo" src="${img(p.logo)}">` : `<div class="wm">${p.wordmark}</div>`);

const card = (p, area, { row = false, gift = false } = {}) => `
<div class="card${row ? ' row' : ''}" style="grid-area:${area}">
  <div class="ph"><img class="prod" src="${img(p.img)}"><div class="off">−${pct(p)}%</div></div>
  <div class="info">
    ${brandMark(p)}
    <div class="n">${p.name}</div><div class="s">${p.size}</div>
    <div class="d">${p.note}</div>
    <div class="pr">${p.promo}</div>
    <div class="price"><span class="now">${p.now} ₪</span><span class="was">${p.was} ₪</span></div>
    ${gift ? `<div class="gift">${has('salvador-cup-set.jpg') ? `<img src="${img('salvador-cup-set.jpg')}">` : '<span style="font-size:42px">🎁</span>'}<span>Чашка с блюдцем Caffe Salvador в подарок при покупке 2 упаковок и больше</span></div>` : ''}
  </div>
</div>`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${css}</style></head>
<body>${beans()}<div class="wrap">
  <div class="head"><div class="kicker">☕ Кофе в зёрнах в KSP</div>
  <h1>Бодрое утро<br>по <em>выгодной</em> цене</h1>
  <div class="brands">Salvador · San Martino · Biancaffe</div></div>
  <div class="promo"><small>скидки<br>до</small><b>−25%</b></div>
  <div class="grid">${card(P.salvador, 'a', { row: true, gift: true })}${card(P.martino, 'b')}${card(P.biancaffe, 'c')}</div>
  <div class="foot"><div class="ksp"><img src="${img('ksp-logo.png')}"></div><p>Скидки применяются в корзине при переходе по ссылкам.<br>До 31.10.2026 или до окончания запасов.</p></div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  const f = path.join(dir, 'out', 'ksp-coffee.html');
  fs.writeFileSync(f, html);
  await pg.goto('file://' + f);
  await pg.waitForLoadState('networkidle');
  await pg.screenshot({ path: path.join(dir, 'out', 'ksp-coffee.png') });
  fs.unlinkSync(f);
  console.log('wrote ksp-coffee.png');
  await browser.close();
})();
