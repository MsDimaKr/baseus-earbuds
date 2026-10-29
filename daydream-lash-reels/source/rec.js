const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [html,out,fps,total,list]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+html);await p.waitForSelector('body[data-ready]',{timeout:60000});await p.waitForTimeout(500);
const times=list?list.split(',').map(Number):[...Array(Math.round(total*fps)).keys()].map(i=>i/fps);
for(let i=0;i<times.length;i++){await p.evaluate(t=>window.setTime(t),times[i]);
 await p.screenshot({path:`${out}/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:95});}
await b.close()})();
