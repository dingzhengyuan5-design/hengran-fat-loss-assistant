import {spawn} from "node:child_process";
import {rm} from "node:fs/promises";
import {fileURLToPath,pathToFileURL} from "node:url";

const direct=process.env.QA_DIRECT==="1",port=9400+Math.floor(Math.random()*300),serverPort=8500+Math.floor(Math.random()*300),siteDir=fileURLToPath(new URL("../",import.meta.url)),chrome="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",profile=fileURLToPath(new URL(`../.qa-chrome-${process.pid}`,import.meta.url)),url=direct?pathToFileURL(`${siteDir}index.html`).href:`http://127.0.0.1:${serverPort}/`;
await rm(profile,{recursive:true,force:true});
const server=direct?null:spawn("python",["-m","http.server",String(serverPort),"--bind","127.0.0.1"],{cwd:siteDir,stdio:"ignore"});
if(server)await new Promise(r=>setTimeout(r,700));
const proc=spawn(chrome,["--headless=new","--disable-gpu","--no-first-run",`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,url],{stdio:"ignore"});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let targets;
for(let i=0;i<30;i++){try{targets=await (await fetch(`http://127.0.0.1:${port}/json`)).json();if(targets.length)break}catch{}await wait(200)}
if(!targets?.length)throw new Error("无法连接 Chrome DevTools");
const page=targets.find(x=>x.type==="page"&&x.url.includes("127.0.0.1"))||targets.find(x=>x.type==="page"),ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
let id=0;const pending=new Map(),errors=[];ws.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.id&&pending.has(msg.id)){const {resolve,reject}=pending.get(msg.id);pending.delete(msg.id);msg.error?reject(new Error(msg.error.message)):resolve(msg.result)}if(msg.method==="Runtime.exceptionThrown"){const d=msg.params.exceptionDetails;errors.push(`${d.exception?.description||d.text} @ ${d.url||"未知文件"}:${d.lineNumber||0}`)}};
const call=(method,params={})=>new Promise((resolve,reject)=>{const requestId=++id;pending.set(requestId,{resolve,reject});ws.send(JSON.stringify({id:requestId,method,params}))});
const evaluate=async expression=>{const response=await call("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(response.exceptionDetails)throw new Error(response.exceptionDetails.exception?.description||response.exceptionDetails.text);return response.result.value};
await call("Page.enable");await call("Runtime.enable");await call("Page.navigate",{url});let loaded=false;for(let i=0;i<40;i++){try{if(await evaluate("Boolean(document.querySelector('#foodCount'))")){loaded=true;break}}catch{}await wait(150)}if(!loaded)throw new Error("页面主体未在预期时间加载");await wait(300);
const initial=await evaluate(`({title:document.title,pages:document.querySelectorAll('.nav-item').length,foods:document.querySelector('#foodCount').textContent,errors:document.querySelector('#formErrors').textContent})`);
const result=await evaluate(`(async()=>{
  document.querySelector('[data-page="profile"]').click();await new Promise(r=>setTimeout(r,50));
  const form=document.querySelector('#profileForm');
  const values={age:30,sex:'male',height:175,weight:85,goal:'steady',activity:'1.375',experience:'some',days:'4',minutes:'60',equipment:'gym',diet:'normal',waist:96,restingHr:65};
  for(const [key,value] of Object.entries(values))form.elements[key].value=value;
  form.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-page="plan"]').click();
  await new Promise(r=>setTimeout(r,100));const unsavedPrompt=document.querySelector('#unsavedDialog').open;document.querySelector('#cancelLeave').click();
  form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  await new Promise(r=>setTimeout(r,500));
  return {unsavedPrompt,saveState:document.querySelector('#saveState').textContent,planVisible:!document.querySelector('#planContent').hidden,version:document.querySelector('#overviewVersion').textContent,headline:document.querySelector('#planHeadline').textContent,planHero:Boolean(document.querySelector('.plan-hero')),logoLoaded:document.querySelector('.brand-mark img').naturalWidth>0,summary:document.querySelector('#summaryPanel').innerText.slice(0,120),days:document.querySelectorAll('#mealsPanel [data-day]').length,weeks:document.querySelectorAll('#trainingPanel [data-week]').length,profileSaved:Boolean(localStorage.getItem('hengran_profile_v2'))};
})()`);
await evaluate(`localStorage.setItem('hengran_plans_v2','[]')`);await call("Page.reload",{ignoreCache:true});let recoveredReady=false;for(let i=0;i<40;i++){try{if(await evaluate("Boolean(document.querySelector('.plan-hero'))")){recoveredReady=true;break}}catch{}await wait(150)}const recovered=recoveredReady?await evaluate(`({visible:!document.querySelector('#planContent').hidden,version:document.querySelector('#overviewVersion').textContent,plans:JSON.parse(localStorage.getItem('hengran_plans_v2')).length})`):{visible:false,version:"—",plans:0};
await call("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true,screenWidth:390,screenHeight:844});await wait(300);const mobile=await evaluate(`({innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth})`);
const output={mode:direct?"直接打开文件":"HTTP服务器",target:{url:page.url,title:page.title},initial,result,recovered,mobile,consoleErrors:errors};console.log(JSON.stringify(output,null,2));
ws.close();proc.kill();server?.kill();await Promise.race([new Promise(r=>proc.once("exit",r)),wait(1500)]);await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:300}).catch(()=>{});
if(!initial||initial.pages!==7||initial.foods!=="300"||!result.unsavedPrompt||result.saveState!=="已保存"||!result.planVisible||!result.planHero||!result.logoLoaded||result.days!==7||result.weeks!==4||!recovered.visible||recovered.plans!==1||mobile.overflow||errors.length)process.exitCode=1;
