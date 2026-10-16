// Renders the KSP winter promo collages to PNG (1080×1350).
// Usage: node ksp-winter-promo/render.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const dir = __dirname;
const img = (f) => 'file://' + path.join(dir, 'src', f);

const P = {
  antonia: { name: 'Vardinon Antonia', size: '150×200 см', note: 'Текстура под овчину, подкладка из шерпы', img: 'antonia-blanket.jpg', fit: 'cover', now: '149', was: '219' },
  unique: { name: 'Homestyle UNIQUE', size: '150×200 см', note: '100% микрофланель + сумка из фетра в подарок', img: 'unique-blanket.jpg', fit: 'cover', pos: '50% 60%', now: '58', was: '99,90' },
  vardinon: { name: 'Vardinon двуспальное одеяло', size: '200×220 см', note: '88% гусиное перо, 12% пух, хлопок перкаль', img: 'vardinon-down.jpg', fit: 'cover', pos: '50% 40%', now: '436', was: '499' },
  wind: { name: 'Homestyle Wind', size: '150×200 см', note: 'Перо и пух в дышащем чехле из перкаля', img: 'wind-down.jpg', fit: 'contain', now: '163', was: '249' },
  hudson: { name: 'Homestyle Hudson', size: '4 полотенца 70×130 см', note: '100% хлопок, отлично впитывают', img: 'hudson-towels.jpg', fit: 'contain', now: '199', was: '249' },
  popcorn: { name: 'Homestyle Popcorn', size: 'Халат из микрофланели', note: 'Тёплый, в разных цветах', img: 'popcorn-robe.jpg', fit: 'contain', now: '51', was: '89,90' },
  amore: { name: 'Little Amore детский махровый халат', size: 'Детский махровый халат', note: 'В разных цветах', img: 'little-amore-robe.jpg', fit: 'contain', now: '110', was: '155' },
};
const num = (s) => parseFloat(s.replace(',', '.'));
const pct = (p) => Math.round((1 - num(p.now) / num(p.was)) * 100);

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; font-family: 'Inter', sans-serif; color: #1d2a44;
  background: radial-gradient(circle at 15% 0%, #ffffff 0%, #eef3f9 45%, #dfe8f3 100%); overflow: hidden; position: relative; }
.flakes span { position: absolute; color: #b9cbe2; font-family: 'DejaVu Sans'; }
.wrap { position: relative; padding: 48px 52px 0; height: 100%; display: flex; flex-direction: column; }
.kicker { font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 22px; color: #4f6b96; }
h1 { font-family: 'Inter Display'; font-weight: 900; font-size: 74px; line-height: 1.02; letter-spacing: -.02em; margin-top: 10px; }
h1 em { font-style: normal; color: #c8102e; }
.brands { margin-top: 14px; font-size: 26px; font-weight: 600; color: #3c4d6b; }
.promo { position: absolute; top: 44px; right: 52px; width: 200px; height: 200px; border-radius: 50%;
  background: #c8102e; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 14px 30px rgba(200,16,46,.35); transform: rotate(8deg); text-align: center; }
.promo b { font-family: 'Inter Display'; font-weight: 900; font-size: 72px; line-height: 1; }
.promo small { font-size: 19px; font-weight: 700; line-height: 1.15; margin-top: 4px; }
.grid { flex: 1; min-height: 0; display: grid; gap: 18px; margin-top: 30px; }
.card { min-height: 0; min-width: 0; position: relative; background: #fff; border-radius: 26px; overflow: hidden; box-shadow: 0 10px 28px rgba(29,42,68,.12); display: flex; flex-direction: column; }
.card .ph { flex: 1; min-height: 0; position: relative; }
.card .ph img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.card .ph img.contain { object-fit: contain; padding: 10px; }
.card .ph img.cover { object-fit: cover; }
.off { position: absolute; top: 14px; left: 14px; background: #c8102e; color: #fff; font-weight: 800; font-size: 24px; padding: 6px 14px; border-radius: 999px; }
.info { padding: 14px 20px 18px; }
.card.row { flex-direction: row; align-items: stretch; }
.card.row .ph { flex: 0 0 50%; }
.card.row .info { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px 24px 20px 4px; }
.head { min-height: 250px; }
.info .n { font-weight: 800; font-size: 25px; line-height: 1.15; }
.info .s { font-size: 19px; color: #5b6b86; margin-top: 3px; }
.info .d { font-size: 19px; color: #5b6b86; margin-top: 6px; line-height: 1.3; }
.price { display: flex; align-items: baseline; gap: 12px; margin-top: 8px; }
.price .now { font-family: 'Inter Display'; font-weight: 900; font-size: 40px; color: #c8102e; }
.price .was { font-size: 22px; color: #8a97ad; text-decoration: line-through; }
.foot { height: 112px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.foot .ksp { background: #fff; padding: 8px 20px; border-radius: 16px; box-shadow: 0 6px 18px rgba(29,42,68,.12); flex: none; }
.foot .ksp img { height: 54px; display: block; }
.foot p { font-size: 19px; color: #3c4d6b; line-height: 1.35; }
`;

const flakes = () => {
  let s = '', seed = 7;
  const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 26; i++) s += `<span style="left:${(r() * 1060) | 0}px;top:${(r() * 1330) | 0}px;font-size:${(14 + r() * 26) | 0}px;opacity:${(0.35 + r() * 0.5).toFixed(2)}">❄</span>`;
  return `<div class="flakes">${s}</div>`;
};

const card = (p, { area, details = true, row = false } = {}) => `
<div class="card${row ? ' row' : ''}" style="grid-area:${area}">
  <div class="ph"><img class="${p.fit}" style="object-position:${p.pos || '50% 50%'}" src="${img(p.img)}"><div class="off">−${pct(p)}%</div></div>
  <div class="info">
    <div class="n">${p.name}</div>
    <div class="price"><span class="now">${p.now} ₪</span><span class="was">${p.was} ₪</span></div>
  </div>
</div>`;

const foot = `<div class="foot"><div class="ksp"><img src="${img('ksp-logo.png')}"></div><p>Доп. скидка 5% — по ссылкам в посте, суммируется с акцией.<br>До 31.10.2026 или до окончания запасов.</p></div>`;

const page = ({ kicker, title, brands, badge, grid, cards }) => `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${css}</style></head>
<body>${flakes()}<div class="wrap">
  <div class="head"><div class="kicker">${kicker}</div>
  <h1>${title}</h1>
  <div class="brands">${brands}</div></div>
  <div class="promo"><b>−5%</b><small>${badge}</small></div>
  <div class="grid" style="${grid}">${cards}</div>
  ${foot}
</div></body></html>`;

const pages = {
  '01-cover': page({
    kicker: '❄ Зимняя распродажа в KSP',
    title: 'Готовимся<br>к <em>зиме</em>',
    brands: 'Vardinon · Homestyle · Little Amore',
    badge: 'дополнительно<br>на всё',
    grid: `grid-template-columns: repeat(6, 1fr); grid-template-rows: 1.2fr 1.1fr 0.9fr; grid-template-areas: 'a a a b b b' 'c c d d e e' 'f f f g g g';`,
    cards: [
      card(P.antonia, { area: 'a', details: false }), card(P.unique, { area: 'b', details: false }),
      card(P.vardinon, { area: 'c', details: false }), card(P.wind, { area: 'd', details: false }), card(P.hudson, { area: 'e', details: false }),
      card(P.popcorn, { area: 'f', details: false, row: true }), card(P.amore, { area: 'g', details: false, row: true }),
    ].join(''),
  }),
  '02-winter-blankets': page({
    kicker: '🧸 Зимние одеяла',
    title: 'Тепло и уют<br>в <em>холодные</em> вечера',
    brands: 'Vardinon · Homestyle',
    badge: 'суммируется<br>с акцией',
    grid: `grid-template-columns: 1fr 1fr; grid-template-areas: 'a b';`,
    cards: card(P.antonia, { area: 'a' }) + card(P.unique, { area: 'b' }),
  }),
  '03-down-blankets': page({
    kicker: '🪶 Пуховые одеяла',
    title: 'Лёгкие, как <em>облако</em>',
    brands: 'Vardinon · Homestyle — натуральные перо и пух',
    badge: 'суммируется<br>с акцией',
    grid: `grid-template-columns: 1fr 1fr; grid-template-areas: 'a b';`,
    cards: card(P.vardinon, { area: 'a' }) + card(P.wind, { area: 'b' }),
  }),
  '04-towels-robes': page({
    kicker: '🛁 Полотенца и халаты',
    title: 'Мягкость<br>после <em>душа</em>',
    brands: 'Vardinon · Homestyle · Little Amore',
    badge: 'суммируется<br>с акцией',
    grid: `grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; grid-template-areas: 'a a' 'b c';`,
    cards: card(P.hudson, { area: 'a', row: true }) + card(P.popcorn, { area: 'b' }) + card(P.amore, { area: 'c' }),
  }),
};

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  for (const [name, html] of Object.entries(pages)) {
    const f = path.join(dir, 'out', name + '.html');
    fs.writeFileSync(f, html);
    await pg.goto('file://' + f);
    await pg.waitForLoadState('networkidle');
    await pg.screenshot({ path: path.join(dir, 'out', name + '.png') });
    fs.unlinkSync(f);
    console.log('wrote', name + '.png');
  }
  await browser.close();
})();
