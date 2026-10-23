// Renders the KSP baby & home promo (Tinoklean, Teddyy, Drobish, Janeke) to PNG (1080×1350).
// Usage: node ksp-baby-promo/render.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const dir = __dirname;
const img = (f) => 'file://' + path.join(dir, 'src', f);

const TINO = [
  { name: 'Кондиционер Fresh & Gentle', size: '1 л', img: 'tinoklean-softener.jpg', now: '21', was: '23' },
  { name: 'Гель для стирки Sensitive & Gentle', size: '2 л', img: 'tinoklean-gel.jpg', now: '36', was: '40' },
  { name: 'Порошок Sensitive & Gentle', size: '1,25 кг / 3 кг', img: 'tinoklean-powder.jpg', now: '25 / 47', was: '27 / 49' },
];

const P = {
  teddyy: { brand: 'Teddyy', name: 'Пелёнки для пеленания', size: '60×60 см, 10 шт.', img: 'teddyy-mats.jpg', now: '12', was: '16', note: 'цена за первую упаковку' },
  drobish: { brand: 'Drobish', name: 'Полотенце для сушки авто', size: 'Микрофибра, 60×90 см', img: 'drobish-towel.jpg', now: '69', was: '99' },
  janeke: { brand: 'Janeke', name: 'Расчёска Superbrush', size: 'Разные цвета', img: 'janeke-superbrush.jpg', now: '55', was: '86', badge: 35, note: '−35% на расчёски и заколки' },
};
const pct = (p) => p.badge || Math.round((1 - p.now / p.was) * 100);

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; font-family: 'Inter', sans-serif; color: #1f2a44;
  background: radial-gradient(circle at 15% 0%, #ffffff 0%, #eef4fb 45%, #dde9f6 100%); overflow: hidden; position: relative; }
.deco span { position: absolute; color: #c3d6ee; font-family: 'DejaVu Sans'; }
.wrap { position: relative; padding: 48px 52px 0; height: 100%; display: flex; flex-direction: column; }
.kicker { font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 22px; color: #4a6fa5; }
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
  grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1.12fr 1fr; grid-template-areas: 'a a a' 'b c d'; }
.card { min-height: 0; min-width: 0; position: relative; background: #fff; border-radius: 26px; overflow: hidden; box-shadow: 0 10px 28px rgba(29,42,68,.12); display: flex; flex-direction: column; }
.card img { mix-blend-mode: multiply; }
.off { position: absolute; top: 14px; left: 14px; background: #c8102e; color: #fff; font-weight: 800; font-size: 22px; padding: 6px 14px; border-radius: 999px; z-index: 1; }
.wm { font-family: 'Inter Display'; font-weight: 900; font-size: 26px; color: #2b4f8a; letter-spacing: -.01em; }

/* Tinoklean wide card */
.tino { padding: 18px 22px 18px; }
.tino .top { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
.tino .top .wm { font-size: 34px; }
.tino .top span { font-size: 18px; color: #5b6b86; font-weight: 600; }
.tino .row { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr 1fr 1.15fr; gap: 14px; margin-top: 10px; }
.tile { min-height: 0; display: flex; flex-direction: column; }
.tile .ph { flex: 1; min-height: 0; position: relative; }
.tile .ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
.tile .n { font-weight: 700; font-size: 16px; line-height: 1.2; margin-top: 6px; min-height: 38px; }
.tile .s { font-size: 15px; color: #5b6b86; }
.tile .p { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 8px; margin-top: 2px; }
.tile .p .now { font-family: 'Inter Display'; font-weight: 900; font-size: 30px; color: #c8102e; white-space: nowrap; }
.tile .p .was { font-size: 16px; color: #8a97ad; text-decoration: line-through; white-space: nowrap; }
.gift { background: #fff4f7; border: 2px dashed #e58aa5; border-radius: 18px; padding: 10px 12px; display: flex; flex-direction: column; }
.gift b { font-size: 17px; color: #c8102e; text-transform: uppercase; letter-spacing: .06em; }
.gift .ph { flex: 1; min-height: 0; position: relative; margin: 6px 0; }
.gift .ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
.gift span { font-size: 15px; line-height: 1.25; font-weight: 600; color: #5b3a4a; }

/* small cards */
.card .ph { flex: 1; min-height: 0; position: relative; }
.card .ph img.prod { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: contain; padding: 14px 14px 4px; }
.info { padding: 2px 18px 16px; }
.info .n { font-weight: 800; font-size: 20px; line-height: 1.15; margin-top: 2px; }
.info .s { font-size: 16px; color: #5b6b86; margin-top: 2px; }
.info .d { font-size: 15px; color: #4a6fa5; font-weight: 700; margin-top: 3px; }
.price { display: flex; align-items: baseline; gap: 10px; margin-top: 4px; }
.price .now { font-family: 'Inter Display'; font-weight: 900; font-size: 40px; color: #c8102e; }
.price .was { font-size: 20px; color: #8a97ad; text-decoration: line-through; }

.foot { height: 112px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.foot .ksp { background: #fff; padding: 8px 20px; border-radius: 16px; box-shadow: 0 6px 18px rgba(29,42,68,.12); flex: none; }
.foot .ksp img { height: 54px; display: block; }
.foot p { font-size: 19px; color: #3c4d6b; line-height: 1.35; text-align: right; }
`;

const deco = () => {
  let s = '', seed = 9;
  const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 22; i++) s += `<span style="left:${(r() * 1060) | 0}px;top:${(r() * 1330) | 0}px;font-size:${(14 + r() * 24) | 0}px;opacity:${(0.35 + r() * 0.5).toFixed(2)}">✦</span>`;
  return `<div class="deco">${s}</div>`;
};

const tile = (t) => `
<div class="tile">
  <div class="ph"><img src="${img(t.img)}"></div>
  <div class="n">${t.name}</div><div class="s">${t.size}</div>
  <div class="p"><span class="now">${t.now} ₪</span><span class="was">${t.was} ₪</span></div>
</div>`;

const tinoCard = `
<div class="card tino" style="grid-area:a">
  <div class="top"><div class="wm">Tinoklean Baby</div><span>Детская бытовая химия от Jacobi</span></div>
  <div class="row">
    ${TINO.map(tile).join('')}
    <div class="gift"><b>🎁 Подарок</b><div class="ph"><img src="${img('kh7-baby.jpg')}"></div>
      <span>Пятновыводитель KH-7 Baby 750 мл при покупке от 2 товаров бренда</span></div>
  </div>
</div>`;

const card = (p, area) => `
<div class="card" style="grid-area:${area}">
  <div class="ph"><img class="prod" src="${img(p.img)}"><div class="off">−${pct(p)}%</div></div>
  <div class="info">
    <div class="wm">${p.brand}</div>
    <div class="n">${p.name}</div><div class="s">${p.size}</div>
    ${p.note ? `<div class="d">${p.note}</div>` : ''}
    <div class="price"><span class="now">${p.now} ₪</span><span class="was">${p.was} ₪</span></div>
  </div>
</div>`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${css}</style></head>
<body>${deco()}<div class="wrap">
  <div class="head"><div class="kicker">👶 Для малышей и дома в KSP</div>
  <h1>Нежная забота<br>по <em>выгодной</em> цене</h1>
  <div class="brands">Tinoklean · Teddyy · Drobish · Janeke</div></div>
  <div class="promo"><small>скидки<br>до</small><b>−35%</b></div>
  <div class="grid">${tinoCard}${card(P.teddyy, 'b')}${card(P.drobish, 'c')}${card(P.janeke, 'd')}</div>
  <div class="foot"><div class="ksp"><img src="${img('ksp-logo.png')}"></div><p>Скидки применяются в корзине при переходе по ссылкам.<br>До 10.11.2026 или до окончания запасов.</p></div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  const f = path.join(dir, 'out', 'ksp-baby.html');
  fs.writeFileSync(f, html);
  await pg.goto('file://' + f);
  await pg.waitForLoadState('networkidle');
  await pg.screenshot({ path: path.join(dir, 'out', 'ksp-baby.png') });
  fs.unlinkSync(f);
  console.log('wrote ksp-baby.png');
  await browser.close();
})();
