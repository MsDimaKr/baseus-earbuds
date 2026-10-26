// Renders the KSP sound promo (JBL, HyperX, Logitech G, Logitech) to PNG (1080×1350).
// Usage: node ksp-sound-promo/render.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const dir = __dirname;
const img = (f) => 'file://' + path.join(dir, 'src', f);

const P = {
  jbl: { logo: 'jbl-logo.png', logoH: 44, name: 'JBL Tune Beam Ghost', size: 'TWS-наушники с шумоподавлением', imgs: ['jbl-tune-beam-black.jpg', 'jbl-tune-beam-white.jpg'], now: '179', was: '189' },
  hyperx: { logo: 'hyperx-logo.png', name: 'HyperX Cloud III', size: 'Игровая гарнитура', imgs: ['hyperx-cloud-iii.jpg'], now: '319', was: '395' },
  g535: { logo: 'logitech-g-logo.png', name: 'Logitech G535 Lightspeed', size: 'Беспроводная, PS4/PS5, PC, Mac', imgs: ['logitech-g535.jpg'], now: '279', was: '499' },
  z150: { logo: 'logitech-logo.png', name: 'Logitech Z150', size: 'Колонки 2.0, разные цвета', imgs: ['logitech-z150-black.jpg', 'logitech-z150-white.jpg'], now: '69', was: '79', note: 'цена за первую единицу' },
  z313: { logo: 'logitech-logo.png', name: 'Logitech Z313', size: 'Акустика 2.1 с сабвуфером', imgs: ['logitech-z313.jpg'], now: '139', was: '155' },
  brio: { wm: 'SPEEDLINK', name: 'SpeedLink Brio', size: 'Стерео-саундбар для ПК', imgs: ['speedlink-brio.jpg'], now: '45', was: '94' },
  energizer: { wm: 'Energizer', name: 'Energizer Max BTS206', size: 'Bluetooth-колонка с RGB', imgs: ['energizer-bts206.jpg'], now: '139', was: '169' },
  microlab: { wm: 'microlab', name: 'Microlab B19', size: 'Пара колонок для ПК', imgs: ['microlab-b19.jpg'], now: '59', was: '89' },
};
const pct = (p) => Math.round((1 - p.now / p.was) * 100);
const maxOff = Math.max(...Object.values(P).map(pct));

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; font-family: 'Inter', sans-serif; color: #1a1f2e;
  background: radial-gradient(circle at 15% 0%, #ffffff 0%, #eef0f6 45%, #dde1ee 100%); overflow: hidden; position: relative; }
.deco span { position: absolute; color: #c5cbe0; font-family: 'DejaVu Sans'; }
.wrap { position: relative; padding: 48px 52px 0; height: 100%; display: flex; flex-direction: column; }
.kicker { font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 22px; color: #4b5a8a; }
h1 { font-family: 'Inter Display'; font-weight: 900; font-size: 74px; line-height: 1.02; letter-spacing: -.02em; margin-top: 10px; }
h1 em { font-style: normal; color: #c8102e; }
.brands { margin-top: 14px; font-size: 26px; font-weight: 600; color: #3c4560; }
.promo { position: absolute; top: 44px; right: 52px; width: 200px; height: 200px; border-radius: 50%;
  background: #c8102e; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 14px 30px rgba(200,16,46,.35); transform: rotate(8deg); text-align: center; }
.promo small { font-size: 21px; font-weight: 700; line-height: 1.1; }
.promo b { font-family: 'Inter Display'; font-weight: 900; font-size: 54px; line-height: 1; }
.head { min-height: 250px; }
.grid { flex: 1; min-height: 0; display: grid; gap: 14px; margin-top: 24px;
  grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; grid-template-areas: 'a b c' 'd d e' 'f g h'; }
.card { min-height: 0; min-width: 0; position: relative; background: #fff; border-radius: 26px; overflow: hidden; box-shadow: 0 10px 28px rgba(26,31,46,.12); display: flex; flex-direction: column; }
.card .ph { flex: 1; min-height: 0; position: relative; display: flex; gap: 6px; padding: 10px 12px 2px 70px; }
.card .ph img { flex: 1; min-width: 0; width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
.off { position: absolute; top: 12px; left: 12px; background: #c8102e; color: #fff; font-weight: 800; font-size: 19px; padding: 5px 11px; border-radius: 999px; z-index: 1; }
.info { padding: 0 16px 12px; }
.wm { font-family: 'Inter Display'; font-weight: 900; font-size: 20px; line-height: 26px; color: #2b3150; }
.logo { height: 26px; width: auto; max-width: 150px; object-fit: contain; display: block; }
.info .n { font-weight: 800; font-size: 18px; line-height: 1.15; margin-top: 3px; }
.info .s { font-size: 15px; color: #5b6380; margin-top: 2px; }
.info .d { font-size: 14px; color: #4b5a8a; font-weight: 700; margin-top: 2px; }
.price { display: flex; align-items: baseline; gap: 10px; margin-top: 0; }
.price .now { font-family: 'Inter Display'; font-weight: 900; font-size: 34px; color: #c8102e; }
.price .was { font-size: 20px; color: #8a90a8; text-decoration: line-through; }
.card.row { flex-direction: row; }
.card.row .ph { flex: 0 0 58%; padding-left: 12px; padding-top: 50px; }
.card.row .info { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 16px 24px 16px 4px; }
.card.row .info .n { font-size: 22px; }
.card.row .price .now { font-size: 42px; }
.foot { height: 112px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.foot .ksp { background: #fff; padding: 8px 20px; border-radius: 16px; box-shadow: 0 6px 18px rgba(26,31,46,.12); flex: none; }
.foot .ksp img { height: 54px; display: block; }
.foot p { font-size: 19px; color: #3c4560; line-height: 1.35; text-align: right; }
`;

const deco = () => {
  let s = '', seed = 13;
  const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 22; i++) s += `<span style="left:${(r() * 1060) | 0}px;top:${(r() * 1330) | 0}px;font-size:${(16 + r() * 24) | 0}px;opacity:${(0.35 + r() * 0.5).toFixed(2)}">♪</span>`;
  return `<div class="deco">${s}</div>`;
};

const card = (p, area, row = false) => `
<div class="card${row ? ' row' : ''}" style="grid-area:${area}">
  <div class="ph">${p.imgs.map((f) => `<img src="${img(f)}">`).join('')}<div class="off">−${pct(p)}%</div></div>
  <div class="info">
    ${p.logo ? `<img class="logo" src="${img(p.logo)}"${p.logoH ? ` style="height:${p.logoH}px"` : ''}>` : `<div class="wm">${p.wm}</div>`}
    <div class="n">${p.name}</div><div class="s">${p.size}</div>
    ${p.note ? `<div class="d">${p.note}</div>` : ''}
    <div class="price"><span class="now">${p.now} ₪</span><span class="was">${p.was} ₪</span></div>
  </div>
</div>`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${css}</style></head>
<body>${deco()}<div class="wrap">
  <div class="head"><div class="kicker">🎧 Хиты продаж: звук в KSP</div>
  <h1>Слушай громче —<br>плати <em>меньше</em></h1>
  <div class="brands">JBL · HyperX · Logitech · SpeedLink · Energizer · Microlab</div></div>
  <div class="promo"><small>скидки<br>до</small><b>−${maxOff}%</b></div>
  <div class="grid">${card(P.jbl, 'a')}${card(P.hyperx, 'b')}${card(P.g535, 'c')}${card(P.z150, 'd', true)}${card(P.z313, 'e')}${card(P.brio, 'f')}${card(P.energizer, 'g')}${card(P.microlab, 'h')}</div>
  <div class="foot"><div class="ksp"><img src="${img('ksp-logo.png')}"></div><p>Скидки применяются в корзине при переходе по ссылкам.<br>До 31.10.2026 или до окончания запасов.</p></div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  const f = path.join(dir, 'out', 'ksp-sound.html');
  fs.writeFileSync(f, html);
  await pg.goto('file://' + f);
  await pg.waitForLoadState('networkidle');
  await pg.screenshot({ path: path.join(dir, 'out', 'ksp-sound.png') });
  fs.unlinkSync(f);
  console.log('wrote ksp-sound.png');
  await browser.close();
})();
