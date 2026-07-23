import {spawn} from "node:child_process";
import {rm} from "node:fs/promises";
import {fileURLToPath,pathToFileURL} from "node:url";

const direct=process.env.QA_DIRECT==="1";
const port=9400+Math.floor(Math.random()*300),serverPort=8500+Math.floor(Math.random()*300);
const siteDir=fileURLToPath(new URL("../",import.meta.url));
const chrome="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile=fileURLToPath(new URL(`../.qa-chrome-${process.pid}`,import.meta.url));
const url=direct?pathToFileURL(`${siteDir}index.html`).href:`http://127.0.0.1:${serverPort}/`;
await rm(profile,{recursive:true,force:true});
const server=direct?null:spawn("python",["-m","http.server",String(serverPort),"--bind","127.0.0.1"],{cwd:siteDir,stdio:"ignore"});
if(server)await new Promise(resolve=>setTimeout(resolve,700));
const proc=spawn(chrome,["--headless=new","--disable-gpu","--no-first-run",`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,url],{stdio:"ignore"});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let targets;
for(let index=0;index<30;index++){try{targets=await (await fetch(`http://127.0.0.1:${port}/json`)).json();if(targets.length)break}catch{}await wait(200)}
if(!targets?.length)throw new Error("无法连接 Chrome DevTools");
const page=targets.find(item=>item.type==="page"&&(item.url.includes("127.0.0.1")||item.url.startsWith("file:")))||targets.find(item=>item.type==="page");
const ws=new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
let id=0;
const pending=new Map(),errors=[];
ws.onmessage=event=>{
  const message=JSON.parse(event.data);
  if(message.id&&pending.has(message.id)){const handlers=pending.get(message.id);pending.delete(message.id);message.error?handlers.reject(new Error(message.error.message)):handlers.resolve(message.result)}
  if(message.method==="Runtime.exceptionThrown"){const detail=message.params.exceptionDetails;errors.push(`${detail.exception?.description||detail.text} @ ${detail.url||"未知文件"}:${detail.lineNumber||0}`)}
};
ws.onclose=event=>{for(const {reject} of pending.values())reject(new Error(`Chrome调试连接提前关闭：${event.code} ${event.reason||""}`));pending.clear()};
const call=(method,params={})=>new Promise((resolve,reject)=>{const requestId=++id;pending.set(requestId,{resolve,reject});ws.send(JSON.stringify({id:requestId,method,params}))});
const evaluate=async expression=>{const response=await call("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(response.exceptionDetails)throw new Error(response.exceptionDetails.exception?.description||response.exceptionDetails.text);return response.result.value};
const waitFor=async(expression,attempts=50)=>{for(let index=0;index<attempts;index++){try{if(await evaluate(expression))return true}catch{}await wait(120)}return false};
await call("Page.enable");await call("Runtime.enable");await call("Page.navigate",{url});
if(!await waitFor("Boolean(document.querySelector('#foodCount'))"))throw new Error("页面主体未在预期时间加载");
await wait(250);
console.error("浏览器测试：页面已加载");

const initial=await evaluate(`({
  title:document.title,
  pages:document.querySelectorAll('.nav-item').length,
  foods:document.querySelector('#foodCount').textContent,
  recipes:document.querySelector('#recipeCount').textContent,
  exercises:document.querySelector('#exerciseCount').textContent,
  logoLoaded:document.querySelector('.brand-mark img').naturalWidth>0
})`);

// 模拟旧单人版数据，验证首次加载会迁移为成员资料库，并补齐新版方案。
await evaluate(`(()=>{
  localStorage.clear();
  const profile={age:30,sex:'male',height:175,weight:85,goal:'steady',activity:'1.375',experience:'some',days:4,minutes:60,equipment:'gym',diet:'normal',limits:[],dislikes:[],preferences:[],allergens:[],risks:[],waist:96,restingHr:65};
  localStorage.setItem('hengran_profile_v2',JSON.stringify(profile));
  localStorage.setItem('hengran_plans_v2','[]');
  localStorage.setItem('hengran_records_v2','[]');
})()`);
await call("Page.reload",{ignoreCache:true});
await waitFor("Boolean(document.querySelector('.plan-hero'))");
console.error("浏览器测试：旧数据迁移完成");
const migration=await evaluate(`(()=>{
  const library=JSON.parse(localStorage.getItem('hengran_member_library_v4'));
  return {schema:library.schemaVersion,members:library.members.length,source:library.migration.from,plans:library.members[0].plans.length,planSchema:library.members[0].plans.at(-1).schemaVersion};
})()`);

console.error("浏览器测试：开始交互主链路");
const result=await evaluate(`(async()=>{
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  document.querySelector('[data-page="profile"]').click();await pause(40);
  const form=document.querySelector('#profileForm');
  form.elements.weight.value='84.5';
  form.dispatchEvent(new Event('input',{bubbles:true}));
  document.querySelector('[data-page="plan"]').click();await pause(50);
  const unsavedPrompt=document.querySelector('#unsavedDialog').open;
  document.querySelector('#cancelLeave').click();
  form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await pause(450);
  const week1=document.querySelector('#trainingPanel').innerText;
  document.querySelector('#trainingPanel [data-week="1"]').click();
  const week2=document.querySelector('#trainingPanel').innerText;
  const library=JSON.parse(localStorage.getItem('hengran_member_library_v4'));
  const firstMemberId=library.activeMemberId;

  document.querySelector('#memberButton').click();
  document.querySelector('#newMemberName').value='成员乙';
  document.querySelector('#newMemberForm').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  await pause(120);
  const afterCreate=JSON.parse(localStorage.getItem('hengran_member_library_v4'));
  const secondIsEmpty=document.querySelector('#overviewProfile').textContent==='未填写'&&document.querySelector('#planContent').hidden;
  document.querySelector('#memberButton').click();
  document.querySelector('.member-select[data-member="'+firstMemberId+'"]').click();
  await pause(100);
  const firstRestored=document.querySelector('#overviewProfile').textContent==='已完成'&&!document.querySelector('#planContent').hidden;

  document.querySelector('[data-page="calculator"]').click();await pause(50);
  const oilRow=[...document.querySelectorAll('.recipe-ingredient-row')].find(row=>row.querySelector('select').selectedOptions[0].textContent.includes('油'));
  const nutritionBefore=document.querySelector('#recipeNutrition').innerText;
  const oilInput=oilRow?.querySelector('.recipe-grams-input');
  if(oilInput){oilInput.value=String(Number(oilInput.value)+5);oilInput.dispatchEvent(new Event('input',{bubbles:true}))}
  const nutritionAfter=document.querySelector('#recipeNutrition').innerText;

  document.querySelector('[data-page="exercises"]').click();await pause(50);
  const exerciseCards=document.querySelectorAll('.exercise-library-card').length;
  document.querySelector('.exercise-library-card').click();await pause(30);
  const guideOpen=document.querySelector('#exerciseDialog').open;
  const guideFrames=document.querySelectorAll('#exerciseDialog .exercise-frames figure').length;
  const guideText=document.querySelector('#exerciseDialog').innerText;
  document.querySelector('#closeExerciseDialog').click();

  window.__printed=false;Object.defineProperty(window,'print',{configurable:true,value:()=>{window.__printed=true}});
  document.querySelector('#printButton').click();
  const reportDefault=document.querySelector('#reportRange').value;
  document.querySelector('#generateReport').click();await pause(180);
  const reportText=document.querySelector('#printReport').innerText;
  const reportWeeks=document.querySelectorAll('#printReport .report-week').length;
  const reportDays=document.querySelectorAll('#printReport .report-day').length;
  document.body.classList.remove('printing-report');

  return {
    unsavedPrompt,
    saveState:document.querySelector('#saveState').textContent,
    weekProgressed:week1!==week2&&week2.includes('每组 +1次'),
    members:afterCreate.members.length,
    secondIsEmpty,
    firstRestored,
    recipeChanged:nutritionBefore!==nutritionAfter,
    exerciseCards,
    guideOpen,
    guideFrames,
    guideComplete:guideText.includes('做到位的判断')&&guideText.includes('常见错误')&&guideText.includes('呼吸'),
    reportDefault,
    printed:window.__printed,
    reportWeeks,
    reportDays,
    reportComplete:reportText.includes('个人信息与目标')&&reportText.includes('完整4周训练计划')&&reportText.includes('完整7天饮食计划')&&reportText.includes('测量与进度'),
    activeMember:document.querySelector('#activeMemberName').textContent
  };
})()`);
console.error("浏览器测试：交互主链路完成");

await call("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true,screenWidth:390,screenHeight:844});
await wait(250);
const mobile=await evaluate(`({innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth})`);
const output={mode:direct?"直接打开文件":"HTTP服务器",target:{url:page.url,title:page.title},initial,migration,result,mobile,consoleErrors:errors};
console.log(JSON.stringify(output,null,2));
ws.close();proc.kill();server?.kill();
await Promise.race([new Promise(resolve=>proc.once("exit",resolve)),wait(1500)]);
await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:300}).catch(()=>{});

const failed=
  initial.pages!==9||initial.foods!=="300"||initial.recipes!=="120"||initial.exercises!=="220"||!initial.logoLoaded||
  migration.schema!==4||migration.members!==1||migration.plans<1||migration.planSchema!==4||
  !result.unsavedPrompt||result.saveState!=="已保存"||!result.weekProgressed||
  result.members!==2||!result.secondIsEmpty||!result.firstRestored||
  !result.recipeChanged||result.exerciseCards!==36||!result.guideOpen||result.guideFrames!==3||!result.guideComplete||
  result.reportDefault!=="45"||!result.printed||result.reportWeeks!==4||result.reportDays!==7||!result.reportComplete||
  mobile.overflow||errors.length;
if(failed)process.exitCode=1;
