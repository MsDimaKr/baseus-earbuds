// Renders a KSP promo image (1080×1350 PNG) from a JSON config.
// Usage: NODE_PATH=$(npm root -g) node render.js <promo-dir>
//   <promo-dir>/config.json  – content + theme (see SKILL.md / references/config-example.json)
//   <promo-dir>/src/         – product images, ksp-logo.png, optional brand logos
//   output: <promo-dir>/out/<config.out || 'ksp-promo'>.png
// Products whose image file is missing are skipped automatically, so you can render
// before every picture has arrived and re-run when the rest come in.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const dir = path.resolve(process.argv[2] || '.');
const C = JSON.parse(fs.readFileSync(path.join(dir, 'config.json'), 'utf8'));
const has = (f) => f && fs.existsSync(path.join(dir, 'src', f));
const img = (f) => 'file://' + path.join(dir, 'src', f);
const pct = (p) => Math.round((1 - p.now / p.was) * 100);

// Default theme = soft blue-grey (Gillette/Bosch look). Override any key in config.theme.
const T = Object.assign({
  text: '#1a2340', bg1: '#ffffff', bg2: '#edf2f8', bg3: '#dbe4f0', deco: '#c6d3e6', decoChar: '✦',
  kicker: '#3d5a8c', sub: '#3c4a68', muted: '#5b6580', was: '#8a92aa', accent: '#c8102e', shadow: '26,35,64',
}, C.theme || {});

// Layout: "rows" (sections with a label, 2 rows × up to 3 cards) or "grid" (flat 3-column grid).
let rows = (C.rows || []).map((r) => ({ ...r, items: r.items.filter((p) => has(p.img)) })).filter((r) => r.items.length);
let grid = (C.grid || []).filter((p) => has(p.img));
const gift = C.gift && has(C.gift.img) ? C.gift : null;
const all = rows.length ? rows.flatMap((r) => r.items) : grid;
const maxOff = Math.max(...all.map(pct));

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; font-family: 'Inter', sans-serif; color: ${T.text};
  background: radial-gradient(circle at 15% 0%, ${T.bg1} 0%, ${T.bg2} 45%, ${T.bg3} 100%); overflow: hidden; position: relative; }
.deco span { position: absolute; color: ${T.deco}; font-family: 'DejaVu Sans'; }
.wrap { position: relative; padding: 48px 52px 0; height: 100%; display: flex; flex-direction: column; }
.head { min-height: 250px; padding-right: 230px; }
.kicker { font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 22px; color: ${T.kicker}; }
h1 { font-family: 'Inter Display'; font-weight: 900; font-size: 74px; line-height: 1.02; letter-spacing: -.02em; margin-top: 10px; margin-right: -230px; }
h1 em { font-style: normal; color: ${T.accent}; }
.brands { margin-top: 14px; font-size: 26px; font-weight: 600; color: ${T.sub}; }
.brands .logo { font-family: 'Inter Display'; font-weight: 900; color: ${T.logoColor || T.accent}; letter-spacing: .04em; }
.promo { position: absolute; top: 44px; right: 52px; width: 200px; height: 200px; border-radius: 50%;
  background: ${T.accent}; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 14px 30px rgba(200,16,46,.35); transform: rotate(8deg); text-align: center; }
.promo small { font-size: 21px; font-weight: 700; line-height: 1.1; }
.promo b { font-family: 'Inter Display'; font-weight: 900; font-size: 54px; line-height: 1; }
.rows { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 18px; margin-top: 24px; }
.sec { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.sec .lbl { display: flex; align-items: baseline; gap: 14px; margin: 0 0 8px 4px; }
.sec .lbl img { height: 40px; width: auto; display: block; align-self: flex-end; }
.sec .lbl b { font-family: 'Inter Display'; font-weight: 900; font-size: 30px; }
.sec .lbl span { font-size: 18px; font-weight: 600; color: ${T.muted}; }
.cards { flex: 1; min-height: 0; display: flex; gap: 16px; }
.grid { flex: 1; min-height: 0; display: grid; gap: 16px; margin-top: 30px; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; }
.card { flex: 1; min-width: 0; min-height: 0; position: relative; background: #fff; border-radius: 24px; overflow: hidden;
  box-shadow: 0 10px 28px rgba(${T.shadow},.12); display: flex; flex-direction: column; }
.card .ph { flex: 1; min-height: 0; position: relative; }
.card .ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 14px 14px 4px; mix-blend-mode: multiply; }
.off { position: absolute; top: 12px; left: 12px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 20px; padding: 5px 12px; border-radius: 999px; z-index: 1; }
.note { position: absolute; top: 12px; right: 12px; background: ${T.text}; color: #fff; font-weight: 700; font-size: 15px; padding: 5px 10px; border-radius: 999px; z-index: 1; }
.info { padding: 2px 18px 14px; }
.wm { font-family: 'Inter Display'; font-weight: 900; font-size: 19px; color: ${T.kicker}; }
.info .n { font-weight: 800; font-size: 21px; line-height: 1.15; }
.info .s { font-size: 16px; color: ${T.muted}; margin-top: 2px; }
.price { display: flex; align-items: baseline; gap: 10px; margin-top: 2px; }
.price .now { font-family: 'Inter Display'; font-weight: 900; font-size: 38px; color: ${T.accent}; }
.price .was { font-size: 20px; color: ${T.was}; text-decoration: line-through; }
.gift { background: #fff8f0; border: 2px dashed ${T.accent}; border-radius: 24px; display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center; padding: 16px 18px 18px; gap: 8px; min-height: 0; }
.gift .gph { flex: 1; min-height: 0; width: 100%; position: relative; }
.gift .gph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
.gift b { font-family: 'Inter Display'; font-weight: 900; font-size: 30px; color: ${T.accent}; text-transform: uppercase; letter-spacing: .04em; }
.gift p { font-size: 20px; line-height: 1.3; font-weight: 600; color: ${T.sub}; }
.foot { height: 112px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.foot .ksp { background: #fff; padding: 8px 20px; border-radius: 16px; box-shadow: 0 6px 18px rgba(${T.shadow},.12); flex: none; }
.foot .ksp img { height: 54px; display: block; }
.foot p { font-size: 19px; color: ${T.sub}; line-height: 1.35; text-align: right; }
${(C.rows || []).map((r) => r.color ? `.sec.${r.cls} .lbl b { color: ${r.color}; } .sec.${r.cls} .card { border-top: 6px solid ${r.bar || r.color}; }` : '').join('\n')}
`;

const deco = () => {
  let s = '', seed = C.seed || 17;
  const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 22; i++) s += `<span style="left:${(r() * 1060) | 0}px;top:${(r() * 1330) | 0}px;font-size:${(14 + r() * 24) | 0}px;opacity:${(0.35 + r() * 0.5).toFixed(2)}">${T.decoChar}</span>`;
  return `<div class="deco">${s}</div>`;
};

const card = (p) => `
<div class="card">
  <div class="ph"><img src="${img(p.img)}"><div class="off">−${pct(p)}%</div>${p.note ? `<div class="note">${p.note}</div>` : ''}</div>
  <div class="info">
    ${p.wm ? `<div class="wm">${p.wm}</div>` : ''}
    <div class="n">${p.name}</div><div class="s">${p.size || ''}</div>
    <div class="price"><span class="now">${p.now} ₪</span><span class="was">${p.was} ₪</span></div>
  </div>
</div>`;

const giftHtml = () => gift ? `<div class="gift"><b>${gift.title || '🎁 Подарок'}</b><div class="gph"><img src="${img(gift.img)}"></div><p>${gift.text}</p></div>` : '';

const section = (r) => `
<div class="sec ${r.cls || ''}">
  <div class="lbl">${has(r.logo) ? `<img src="${img(r.logo)}" alt="${r.label}">` : `<b>${r.label}</b>`}${r.note ? `<span>${r.note}</span>` : ''}</div>
  <div class="cards">${r.items.map(card).join('')}</div>
</div>`;

const body = rows.length
  ? `<div class="rows">${rows.map(section).join('')}</div>`
  : `<div class="grid">${grid.map(card).join('')}${giftHtml()}</div>`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${css}</style></head>
<body>${deco()}<div class="wrap">
  <div class="head"><div class="kicker">${C.kicker}</div>
  <h1>${C.headline}</h1>
  <div class="brands">${C.brands || ''}</div></div>
  <div class="promo"><small>${C.circleLabel || 'скидки<br>до'}</small><b>${C.circleValue || `−${maxOff}%`}</b></div>
  ${body}
  <div class="foot"><div class="ksp"><img src="${img('ksp-logo.png')}"></div><p>Скидки применяются в корзине при переходе по ссылкам.<br>До ${C.until} или до окончания запасов.</p></div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  const outDir = path.join(dir, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const name = C.out || 'ksp-promo';
  const f = path.join(outDir, name + '.html');
  fs.writeFileSync(f, html);
  await pg.goto('file://' + f);
  await pg.waitForLoadState('networkidle');
  await pg.screenshot({ path: path.join(outDir, name + '.png') });
  fs.unlinkSync(f);
  console.log(`wrote ${path.join(outDir, name + '.png')} — ${all.length} products${gift ? ' + gift' : ''}`);
  await browser.close();
})();
