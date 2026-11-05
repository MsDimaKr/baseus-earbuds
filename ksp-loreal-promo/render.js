// Renders the KSP L'Oréal group promo (L'Oréal Paris, Elvive, Garnier, Essie, Maybelline) to PNG (1080×1350).
// Usage: node ksp-loreal-promo/render.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const dir = __dirname;
const has = (f) => fs.existsSync(path.join(dir, 'src', f));
const img = (f) => 'file://' + path.join(dir, 'src', f);

const P = [
  { wm: "L'Oréal Paris", name: 'Тушь Telescopic', size: 'Удлинение и объём', img: 'loreal-telescopic.jpg', now: '43', was: '49' },
  { wm: "L'Oréal Elvive", name: 'Шампунь Hydra Pure', size: 'Свежесть до 72 часов', img: 'elvive-hydra-pure.jpg', now: '14', was: '17' },
  { wm: 'Garnier', name: 'Мицеллярная вода', size: 'Skin Naturals, 700 мл', img: 'garnier-micellar-700.jpg', now: '32', was: '41' },
  { wm: 'essie', name: 'Топ Gel Couture', size: 'Верхнее покрытие, 13.5 мл', img: 'essie-gel-couture-top.jpg', now: '34', was: '44' },
  { wm: 'Maybelline', name: 'Гель для бровей', size: 'Super Lock, 7 мл', img: 'maybelline-superlock.jpg', now: '37', was: '49', note: '+7% к акции' },
].filter((p) => has(p.img));
const pct = (p) => Math.round((1 - p.now / p.was) * 100);
const maxOff = Math.max(...P.map(pct));

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; font-family: 'Inter', sans-serif; color: #3a2230;
  background: radial-gradient(circle at 15% 0%, #ffffff 0%, #fbeff2 45%, #f3dce3 100%); overflow: hidden; position: relative; }
.deco span { position: absolute; color: #ecc6d2; font-family: 'DejaVu Sans'; }
.wrap { position: relative; padding: 48px 52px 0; height: 100%; display: flex; flex-direction: column; }
.kicker { font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 22px; color: #a2476a; }
h1 { font-family: 'Inter Display'; font-weight: 900; font-size: 74px; line-height: 1.02; letter-spacing: -.02em; margin-top: 10px; }
h1 em { font-style: normal; color: #c8102e; }
.brands { margin-top: 14px; font-size: 26px; font-weight: 600; color: #6b4558; }
.promo { position: absolute; top: 44px; right: 52px; width: 200px; height: 200px; border-radius: 50%;
  background: #c8102e; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 14px 30px rgba(200,16,46,.35); transform: rotate(8deg); text-align: center; }
.promo small { font-size: 21px; font-weight: 700; line-height: 1.1; }
.promo b { font-family: 'Inter Display'; font-weight: 900; font-size: 54px; line-height: 1; }
.head { min-height: 250px; }
.grid { flex: 1; min-height: 0; display: grid; gap: 16px; margin-top: 30px;
  grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; }
.card { min-height: 0; min-width: 0; position: relative; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 28px rgba(80,30,50,.12); display: flex; flex-direction: column; }
.card .ph { flex: 1; min-height: 0; position: relative; }
.card .ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 16px 16px 6px; mix-blend-mode: multiply; }
.off { position: absolute; top: 12px; left: 12px; background: #c8102e; color: #fff; font-weight: 800; font-size: 20px; padding: 5px 12px; border-radius: 999px; z-index: 1; }
.info { padding: 2px 18px 14px; }
.wm { font-family: 'Inter Display'; font-weight: 900; font-size: 19px; color: #a2476a; letter-spacing: .01em; }
.info .n { font-weight: 800; font-size: 20px; line-height: 1.15; margin-top: 1px; }
.info .s { font-size: 16px; color: #7a5c69; margin-top: 2px; }
.price { display: flex; align-items: baseline; gap: 10px; margin-top: 2px; }
.price .now { font-family: 'Inter Display'; font-weight: 900; font-size: 38px; color: #c8102e; }
.price .was { font-size: 20px; color: #a891a0; text-decoration: line-through; }
.info .s .x { color: #c8102e; }
.gift { background: #fff3f6; border: 2px dashed #e07a98; border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 16px 18px 18px; gap: 8px; }
.gift .gph { flex: 1; min-height: 0; width: 100%; position: relative; }
.gift .gph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
.gift b { font-family: 'Inter Display'; font-weight: 900; font-size: 30px; color: #c8102e; text-transform: uppercase; letter-spacing: .04em; }
.gift p { font-size: 20px; line-height: 1.3; font-weight: 600; color: #5b3a4a; }
.gift p strong { color: #3a2230; }
.foot { height: 112px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.foot .ksp { background: #fff; padding: 8px 20px; border-radius: 16px; box-shadow: 0 6px 18px rgba(80,30,50,.12); flex: none; }
.foot .ksp img { height: 54px; display: block; }
.foot p { font-size: 19px; color: #6b4558; line-height: 1.35; text-align: right; }
`;

const deco = () => {
  let s = '', seed = 23;
  const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 22; i++) s += `<span style="left:${(r() * 1060) | 0}px;top:${(r() * 1330) | 0}px;font-size:${(14 + r() * 24) | 0}px;opacity:${(0.35 + r() * 0.5).toFixed(2)}">✿</span>`;
  return `<div class="deco">${s}</div>`;
};

const card = (p) => `
<div class="card">
  <div class="ph"><img src="${img(p.img)}"><div class="off">−${pct(p)}%</div></div>
  <div class="info">
    <div class="wm">${p.wm}</div>
    <div class="n">${p.name}</div><div class="s">${p.size}${p.note ? ` · <b class="x">${p.note}</b>` : ''}</div>
    <div class="price"><span class="now">${p.now} ₪</span><span class="was">${p.was} ₪</span></div>
  </div>
</div>`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${css}</style></head>
<body>${deco()}<div class="wrap">
  <div class="head"><div class="kicker">💄 Косметика L’Oréal в KSP</div>
  <h1>Красота<br>по <em>выгодной</em> цене</h1>
  <div class="brands">L'Oréal · Garnier · Essie · Maybelline</div></div>
  <div class="promo"><small>скидки<br>до</small><b>−${maxOff}%</b></div>
  <div class="grid">${P.map(card).join('')}<div class="gift"><b>🎁 Подарок</b><div class="gph"><img src="${img('maybelline-matte-ink.jpg')}"></div><p>Помада <strong>Maybelline Matte&nbsp;Ink</strong> в&nbsp;специальном размере при&nbsp;покупке от&nbsp;<strong>99&nbsp;₪</strong></p></div></div>
  <div class="foot"><div class="ksp"><img src="${img('ksp-logo.png')}"></div><p>Скидки применяются в корзине при переходе по ссылкам.<br>До 30.11.2026 или до окончания запасов.</p></div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  const f = path.join(dir, 'out', 'ksp-loreal.html');
  fs.writeFileSync(f, html);
  await pg.goto('file://' + f);
  await pg.waitForLoadState('networkidle');
  await pg.screenshot({ path: path.join(dir, 'out', 'ksp-loreal.png') });
  fs.unlinkSync(f);
  console.log('wrote ksp-loreal.png');
  await browser.close();
})();
