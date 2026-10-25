const { chromium } = require('playwright'); const fs=require('fs');
(async () => { const [,, html, outdir, fps, total, only] = process.argv;
 fs.mkdirSync(outdir,{recursive:true});
 const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
 await p.goto('file://' + html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
 const times = only ? only.split(',').map(Number) : null;
 const N = times ? times.length : Math.round(+total * +fps);
 for (let i = 0; i < N; i++) { const t = times ? times[i] : i / +fps;
  await p.evaluate(t => setTime(t), t);
  await p.screenshot({ path: `${outdir}/f${String(i).padStart(5,'0')}.jpg`, type: 'jpeg', quality: 95 }); }
 await b.close(); })();
