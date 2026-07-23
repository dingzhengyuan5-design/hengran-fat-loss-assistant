import {foods,mealTemplates,references,videos,dataMeta} from "./catalog.js";
import {bmi,calculateTargets,generatePlan,assessRisk,assessProgress,calculateMeal,replaceMealItem,replaceWholeMeal,replaceDayMenu,planValidation} from "./engine.js";
import {exerciseLibrary,exerciseLibraryCount,bodyweightExerciseCount,getExerciseByName,exerciseById} from "./exercise-catalog.js";
import {motionExerciseCount,motionExerciseIds,getMotion} from "./motion-catalog.js";
import {standardRecipes,recipeCategories,calculateRecipe,recipeAllowed} from "./recipe-catalog.js";
import {diningItems,diningBrands,diningItemCount,diningBrandCount,calculateDiningItem} from "./external-food-catalog.js";
import {syncConfigured,createRecoveryCode,authToken,encryptPayload,decryptPayload,syncRequest} from "./crypto-sync.js";

const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const KEYS={library:"hengran_member_library_v4",profile:"hengran_profile_v2",plans:"hengran_plans_v2",records:"hengran_records_v2"};
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
const createId=prefix=>`${prefix}-${Date.now().toString(36)}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
function createMember(name="新成员",seed={}){
  return {id:createId("member"),name,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),profile:seed.profile||null,plans:Array.isArray(seed.plans)?seed.plans:[],records:Array.isArray(seed.records)?seed.records:[],customRecipes:Array.isArray(seed.customRecipes)?seed.customRecipes:[]};
}
function loadMemberLibrary(){
  const saved=read(KEYS.library,null);
  if(saved?.schemaVersion>=4&&Array.isArray(saved.members)&&saved.members.length){
    if(!saved.members.some(member=>member.id===saved.activeMemberId))saved.activeMemberId=saved.members[0].id;
    saved.sharedRecipes=Array.isArray(saved.sharedRecipes)?saved.sharedRecipes:[];
    return saved;
  }
  const legacyProfile=read(KEYS.profile,null),legacyPlans=read(KEYS.plans,[]),legacyRecords=read(KEYS.records,[]);
  const member=createMember(legacyProfile?.nickname||legacyProfile?.name||"成员 1",{profile:legacyProfile,plans:legacyPlans,records:legacyRecords});
  return {schemaVersion:4,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),activeMemberId:member.id,members:[member],sharedRecipes:[],migration:{from:legacyProfile||legacyPlans.length||legacyRecords.length?"单人版 v2":"全新资料库",at:new Date().toISOString()}};
}
const state={library:loadMemberLibrary(),week:0,day:0,foodId:foods[0].id,mealVariant:1,recipeId:standardRecipes[0].id,recipeDraft:null,exerciseId:exerciseLibrary[0].id,diningId:diningItems[0].id,diningOptions:{}};
const activeMember=()=>state.library.members.find(member=>member.id===state.library.activeMemberId)||state.library.members[0];
Object.defineProperties(state,{
  profile:{get:()=>activeMember().profile,set:value=>{activeMember().profile=value;activeMember().updatedAt=new Date().toISOString()}},
  plans:{get:()=>activeMember().plans,set:value=>{activeMember().plans=value;activeMember().updatedAt=new Date().toISOString()}},
  records:{get:()=>activeMember().records,set:value=>{activeMember().records=value;activeMember().updatedAt=new Date().toISOString()}},
  customRecipes:{get:()=>activeMember().customRecipes,set:value=>{activeMember().customRecipes=value;activeMember().updatedAt=new Date().toISOString()}}
});
function persistLibrary(){try{state.library.updatedAt=new Date().toISOString();localStorage.setItem(KEYS.library,JSON.stringify(state.library));return true}catch(error){toast("浏览器拒绝保存，请检查隐私模式或存储权限");console.error("保存失败",error);return false}}
function write(key,value){
  if(key===KEYS.profile)state.profile=value;
  else if(key===KEYS.plans)state.plans=value;
  else if(key===KEYS.records)state.records=value;
  else if(key===KEYS.library)state.library=value;
  return persistLibrary();
}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400)}
const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const currentPlan=()=>state.plans.length?state.plans[state.plans.length-1]:null;
function upgradeLegacyPlan(){const old=currentPlan();if(!old||old.schemaVersion>=5||!state.profile)return false;const upgraded=generatePlan(state.profile,state.plans);upgraded.reason=`从旧版 v${old.version} 自动升级：训练日历、逐项动作复核与中国大陆外食数据库`;state.plans.push(upgraded);write(KEYS.plans,state.plans);return true}
let profileDirty=false,progressDirty=false,pendingNavigation=null,pendingMemberId=null;

function renderMemberControls(){
  const member=activeMember();$("#activeMemberName").textContent=member.name;$("#memberAvatar").textContent=member.name.trim().slice(0,1)||"人";
  $("#reportMemberName").textContent=member.name;$("#reportPlanVersion").textContent=currentPlan()?`v${currentPlan().version}`:"尚未生成";
  $("#memberList").innerHTML=state.library.members.map((item,index)=>`<article class="member-row ${item.id===member.id?"active":""}"><button class="member-select" data-member="${item.id}"><span>${escapeHtml(item.name.trim().slice(0,1)||index+1)}</span><div><b>${escapeHtml(item.name)}</b><small>${item.profile?`已建档 · ${item.plans.length}个方案版本 · ${item.records.length}条记录`:"尚未填写档案"}</small></div>${item.id===member.id?"<em>当前</em>":""}</button><div class="member-row-actions"><button class="text-button rename-member" data-member="${item.id}">重命名</button><button class="text-button duplicate-member" data-member="${item.id}">复制</button><button class="text-button delete-member" data-member="${item.id}" ${state.library.members.length===1?"disabled":""}>删除</button></div></article>`).join("");
  $$(".member-select").forEach(button=>button.onclick=()=>requestMemberSwitch(button.dataset.member));
  $$(".rename-member").forEach(button=>button.onclick=()=>{const memberItem=state.library.members.find(item=>item.id===button.dataset.member),name=prompt("输入新的成员名称",memberItem.name)?.trim();if(!name)return;memberItem.name=name.slice(0,20);persistLibrary();renderMemberControls();toast("成员名称已保存")});
  $$(".duplicate-member").forEach(button=>button.onclick=()=>{const source=state.library.members.find(item=>item.id===button.dataset.member),copy=createMember(`${source.name} 副本`,structuredClone(source));copy.id=createId("member");copy.createdAt=new Date().toISOString();copy.updatedAt=copy.createdAt;state.library.members.push(copy);persistLibrary();renderMemberControls();toast("已复制成员及其全部本地数据")});
  $$(".delete-member").forEach(button=>button.onclick=()=>{if(state.library.members.length===1)return;const memberItem=state.library.members.find(item=>item.id===button.dataset.member);if(!confirm(`确定删除“${memberItem.name}”及其方案、记录和个人菜谱？建议先导出备份。`))return;state.library.members=state.library.members.filter(item=>item.id!==memberItem.id);if(state.library.activeMemberId===memberItem.id)state.library.activeMemberId=state.library.members[0].id;persistLibrary();loadActiveMemberIntoUI();renderMemberControls();toast("成员已删除")});
}
function loadActiveMemberIntoUI(){
  $("#profileForm").reset();fillForm(state.profile);renderSpecificDates();setProfileDirty(false);$("#progressForm").reset();$("#progressForm").elements.date.value=new Date().toISOString().slice(0,10);setProgressDirty(false);state.week=0;state.day=0;state.recipeDraft=null;renderAll();
}
function performMemberSwitch(memberId){if(!state.library.members.some(member=>member.id===memberId))return;state.library.activeMemberId=memberId;persistLibrary();pendingMemberId=null;$("#memberDialog").close();loadActiveMemberIntoUI();renderMemberControls();toast(`已切换到 ${activeMember().name}`)}
function requestMemberSwitch(memberId){
  if(memberId===state.library.activeMemberId){$("#memberDialog").close();return}
  const active=$(".page.active")?.id,hasChanges=(active==="profile"&&profileDirty)||(active==="progress"&&progressDirty);
  if(hasChanges){pendingMemberId=memberId;$("#unsavedMessage").textContent=`当前成员“${activeMember().name}”有未保存修改。保存后再切换成员可避免数据丢失。`;$("#unsavedDialog").showModal();return}
  performMemberSwitch(memberId);
}
$("#memberButton").onclick=()=>{renderMemberControls();$("#memberDialog").showModal()};
$("#closeMemberDialog").onclick=()=>$("#memberDialog").close();
$("#newMemberForm").onsubmit=event=>{event.preventDefault();const name=$("#newMemberName").value.trim();if(!name)return;const member=createMember(name.slice(0,20));state.library.members.push(member);persistLibrary();$("#newMemberName").value="";renderMemberControls();performMemberSwitch(member.id)};

function showPage(id){
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===id));$$('.nav-item').forEach(n=>n.classList.toggle("active",n.dataset.page===id));
  const page=$(`#${id}`);$("#pageTitle").textContent=page.dataset.title;$("#pageEyebrow").textContent=page.dataset.eyebrow;$("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});history.replaceState(null,"",`#${id}`);
}
function ensurePlan(){if(currentPlan()||!state.profile||completion(state.profile)<100||assessRisk(state.profile).length)return Boolean(currentPlan());const plan=generatePlan(state.profile,state.plans);plan.validation=planValidation(plan);state.plans.push(plan);write(KEYS.plans,state.plans);renderAll();toast("已根据已保存档案补充生成方案");return true}
function requestNavigation(id){const active=$(".page.active")?.id,hasChanges=(active==="profile"&&profileDirty)||(active==="progress"&&progressDirty);if(hasChanges){pendingNavigation=id;$("#unsavedMessage").textContent=active==="profile"?"个人信息有未保存修改。保存后会重新生成方案版本。":"进度记录尚未保存。保存后再离开可避免丢失。";$("#unsavedDialog").showModal();return}if(id==="plan")ensurePlan();showPage(id)}
$$('[data-page]').forEach(x=>x.addEventListener("click",()=>requestNavigation(x.dataset.page)));$$('[data-jump]').forEach(x=>x.addEventListener("click",()=>requestNavigation(x.dataset.jump)));
$("#menuButton").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));$("#printButton").addEventListener("click",()=>{renderMemberControls();$("#reportDialog").showModal()});

const required=["age","sex","height","weight","goal","activity","experience","days","minutes","equipment","diet"];
function completion(profile=state.profile){if(!profile)return 0;return Math.round(required.filter(k=>profile[k]!==""&&profile[k]!=null).length/required.length*100)}
function serializeForm(form){
  const data=Object.fromEntries(new FormData(form).entries());
  for(const name of ["limits","dislikes","preferences","allergens","risks","weekdays"])data[name]=$$(`input[name="${name}"]:checked`,form).map(x=>x.value);
  for(const key of ["age","height","weight","bodyFat","restingHr","waist","hip","neck","steps","sitting","sleep","currentMinutes","days","minutes"])if(data[key]!==""&&data[key]!=null)data[key]=Number(data[key]);
  return data;
}
function fillForm(profile){if(!profile)return;const form=$("#profileForm");for(const [key,value] of Object.entries(profile)){if(Array.isArray(value))value.forEach(v=>{const input=$(`input[name="${key}"][value="${v}"]`,form);if(input)input.checked=true});else{const input=form.elements[key];if(input)input.value=value??""}}}
function specificDateValues(){return $("#specificDates").value.split(",").map(value=>value.trim()).filter(Boolean).sort()}
function renderSpecificDates(){
  const values=specificDateValues();
  $("#selectedDateChips").innerHTML=values.map(value=>`<button type="button" data-remove-date="${value}" title="移除${value}">${value}<span>×</span></button>`).join("")||"<small>尚未指定具体日期</small>";
  $$("[data-remove-date]").forEach(button=>button.onclick=()=>{$("#specificDates").value=values.filter(value=>value!==button.dataset.removeDate).join(",");renderSpecificDates();setProfileDirty(true)});
  const mode=$("#scheduleMode").value;$("#specificDateField").hidden=mode!=="dates";$("#weekdayField").hidden=mode==="dates";
}
$("#scheduleMode").onchange=()=>{renderSpecificDates();setProfileDirty(true)};
$("#addSpecificDate").onclick=()=>{const value=$("#specificDatePicker").value;if(!value)return;const values=[...new Set([...specificDateValues(),value])].sort();$("#specificDates").value=values.join(",");$("#specificDatePicker").value="";renderSpecificDates();setProfileDirty(true)};
function refreshCompletion(){const profile=serializeForm($("#profileForm")),score=completion(profile);$("#profileCompletion").textContent=`${score}%`;$("#completionScore").textContent=`${score}%`;$("#completionRing").style.background=`conic-gradient(var(--lime) ${score*3.6}deg,#31594e 0deg)`}
function setProfileDirty(value){profileDirty=value;const stateEl=$("#saveState"),button=$("#saveProfileButton");stateEl.textContent=value?"未保存":"已保存";stateEl.classList.toggle("unsaved",value);stateEl.classList.toggle("saved",!value);button.textContent=value?"保存并更新方案":"已保存 · 生成方案";$("#profileDot").classList.toggle("unsaved",value)}
$("#profileForm").addEventListener("input",()=>{refreshCompletion();setProfileDirty(true)});

function saveProfileAndGenerate({navigate=true}={}){
  const form=$("#profileForm"),profile=serializeForm(form);const missing=required.filter(k=>profile[k]===""||profile[k]==null);const errors=[];
  if(missing.length)errors.push(`请完成 ${missing.length} 个必填项。`);if(profile.age<18||profile.age>64)errors.push("首版只为18～64岁成人生成常规方案。");
  if(profile.height&&profile.weight&&bmi(profile.weight,profile.height)<18.5)errors.push("BMI低于18.5，不生成减脂处方。");
  if((profile.risks||[]).length)errors.push("风险筛查存在勾选项，请先接受医生或相应专业人员评估。");
  const box=$("#formErrors");box.innerHTML=errors.map(x=>`<p>• ${x}</p>`).join("");if(errors.length){box.scrollIntoView({behavior:"smooth",block:"center"});return false}
  const plan=generatePlan(profile,state.plans),validation=planValidation(plan);plan.validation=validation;
  state.profile=profile;state.plans.push(plan);const savedProfile=write(KEYS.profile,profile),savedPlans=write(KEYS.plans,state.plans);if(!savedProfile||!savedPlans){state.plans.pop();return false}
  setProfileDirty(false);renderAll();toast(validation.length?"已保存，方案有数据提示需要查看":"已保存并生成最新方案");if(navigate)showPage("plan");return true
}
$("#profileForm").addEventListener("submit",event=>{event.preventDefault();saveProfileAndGenerate()});
$("#clearProfile").addEventListener("click",()=>{if(confirm(`确定清空“${activeMember().name}”的个人档案？已有方案与记录不会删除。`)){state.profile=null;write(KEYS.profile,null);$("#profileForm").reset();renderSpecificDates();setProfileDirty(false);renderAll()}});
$("#regeneratePlan").addEventListener("click",()=>{if(!state.profile)return;state.plans.push(generatePlan(state.profile,state.plans));write(KEYS.plans,state.plans);renderPlan();renderOverview();toast("已创建新方案版本")});

function renderOverview(){
  const score=completion();$("#completionScore").textContent=`${score}%`;$("#completionRing").style.background=`conic-gradient(var(--lime) ${score*3.6}deg,#31594e 0deg)`;$("#overviewProfile").textContent=state.profile?"已完成":"未填写";$("#profileDot").classList.toggle("ready",score===100);$("#overviewVersion").textContent=currentPlan()?`v${currentPlan().version}`:"—";$("#overviewRecords").textContent=`${state.records.length} 条`;
  const metrics=$$("#overviewMetrics .metric");if(state.profile&&currentPlan()){const t=currentPlan().targets;metrics[0].innerHTML=`<small>当前 BMI</small><strong>${t.bmi}</strong><span>${t.bmi>=28?"达到中国成人肥胖BMI界值":t.bmi>=24?"处于超重范围":"仅作筛查指标"}</span>`;metrics[1].innerHTML=`<small>每日热量目标</small><strong>${t.calories} kcal</strong><span>估算维持 ${t.tdee} kcal，需用趋势校准</span>`;metrics[2].innerHTML=`<small>每周训练</small><strong>${state.profile.days} 天</strong><span>${currentPlan().training.structure}</span>`}
  const assessment=state.profile&&currentPlan()?assessProgress(state.records,state.profile,currentPlan()):null;metrics[3].innerHTML=assessment?.ready?`<small>趋势判断</small><strong>${assessment.status}</strong><span>近段7日均重 ${assessment.lastAvg} kg</span>`:`<small>趋势判断</small><strong>等待数据</strong><span>${assessment?.message||"至少14天体重或3次腰围"}</span>`;
}
function renderSummary(plan){const t=plan.targets,profile=state.profile||plan.input||{},goal=profile.goal==="recomp"?"体态重组":profile.goal==="faster"?"较快减脂":"稳定减脂",first=plan.training.weeks[0]?.sessions[0];$("#summaryPanel").innerHTML=`<article class="plan-hero"><div class="plan-hero-top"><div><span class="badge">当前执行方案 · v${plan.version}</span><h2>${goal}</h2><p>先执行4周，再依据7日平均体重、腰围和训练表现判断是否需要调整。不要因单日体重波动改变计划。</p></div><div class="plan-hero-score"><strong>${t.calories}</strong><span>每日目标 kcal</span></div></div><div class="plan-focus"><span>每周训练 ${profile.days} 天</span><span>${plan.training.structure}</span><span>蛋白质 ${t.protein} g/日</span><span>参考心率 ${t.moderate[0]}～${t.moderate[1]}</span></div></article><div class="summary-grid"><article class="summary-tile"><small>估算维持热量</small><strong>${t.tdee}</strong><span>kcal / 日，后续用趋势校准</span></article><article class="summary-tile"><small>蛋白质目标</small><strong>${t.protein} g</strong><span>参考体重 ${t.referenceWeight} kg</span></article><article class="summary-tile"><small>脂肪与碳水</small><strong>${t.fat} / ${t.carbs}</strong><span>脂肪 g / 碳水 g</span></article><article class="summary-tile"><small>4周训练结构</small><strong>${profile.days} 天</strong><span>${plan.training.structure}</span></article></div><article class="today-card"><div class="today-icon">↗</div><div><h3>第一步：${first?.label||"建立训练基线"}</h3><p>${first?.exercises?.slice(0,3).map(x=>x.name).join("、")||"中等强度有氧与活动度"}。动作保留2～3次余力。</p></div><button class="secondary-button" id="openTrainingTab">查看完整训练</button></article><div class="plan-note"><b>计算依据与边界</b><p>Mifflin-St Jeor估算静息代谢 ${t.resting} kcal，活动系数后约 ${t.tdee} kcal。公式对个体可有明显误差，请在至少两周规范记录后校准。</p>${plan.validation?.length?`<p class="trend-warn"><b>数据提示：</b>${plan.validation.join("；")}</p>`:""}</div>`;$("#openTrainingTab").onclick=()=>$(".tab[data-tab='training']").click()}
function renderTraining(plan){
  const week=plan.training.weeks[state.week]||plan.training.weeks[0],strengthSessions=week.sessions.filter(s=>s.exercises?.length),sets=strengthSessions.reduce((sum,s)=>sum+s.exercises.reduce((n,e)=>n+Number(e.sets),0),0),cardio=week.sessions.reduce((sum,s)=>sum+(s.cardio?.minutes||0),0);
  const calendar=week.sessions.map((session,index)=>`<article><span>${session.schedule?.dateLabel||`第${index+1}天`}</span><b>${session.schedule?.weekday||""} ${session.schedule?.startTime||""}</b><small>${session.label} · ${session.estimatedMinutes}分钟</small></article>`).join("");
  $("#trainingPanel").innerHTML=`<section class="training-dashboard"><div class="training-progress">${plan.training.weeks.map((w,i)=>`<button class="week-step ${i===state.week?"active":""}" data-week="${i}"><span>${w.week}</span><b>${w.focus}</b><small>${w.sessions[0]?.schedule?.dateLabel||""}起 · ${w.change||"查看处方"}</small></button>`).join("")}</div><article class="week-brief"><div><span class="badge">第 ${week.week} 周 · 当前执行</span><h2>${week.focus}</h2><p>${week.instruction}</p><button class="secondary-button" id="exportTrainingCalendar">导出日历文件 .ics</button></div><div class="week-stats"><span><b>${sets}</b>力量组</span><span><b>${cardio}</b>有氧分钟</span><span><b>${motionExerciseCount}</b>项动画轨迹初审</span></div></article><div class="training-calendar-strip">${calendar}</div><div class="change-ribbon">↗ 本周变化：<b>${week.change||week.instruction}</b></div><div class="training-stack">${week.sessions.map((s,i)=>`<article class="session-card"><header><div class="session-index">${String(i+1).padStart(2,"0")}</div><div><small>${s.schedule?`${s.schedule.dateLabel} ${s.schedule.weekday} · ${s.schedule.startTime}～${s.schedule.endTime}`:`${s.type}`} · 预计 ${s.estimatedMinutes||state.profile.minutes} 分钟</small><h3>${s.label}</h3><p class="session-source">${s.schedule?.source||"系统安排"}</p></div><span class="session-status">待完成</span></header><details class="session-timeline" open><summary>当天时间表</summary>${(s.schedule?.timeline||[]).map(item=>`<div><time>${item.start}–${item.end}</time><b>${item.label}</b><span>${item.minutes}分钟 · ${escapeHtml(item.detail)}</span></div>`).join("")}</details>${s.exercises?.length?`<div class="movement-list">${s.exercises.map((e,ei)=>`<div class="movement-card"><div class="movement-name"><span>${ei+1}</span><div><button class="movement-guide-link" data-exercise-name="${e.name}">${e.name}<i>${motionExerciseIds.has(e.id)?"观看拟真人动画":e.reviewStatus==="首批逐项复核"?"查看逐项教程":"查看复核状态"}</i></button><small>${e.pattern} · ${e.loadCue||"动作稳定优先"}</small></div></div><div class="dose"><span><small>组数</small><b>${e.sets}</b></span><span><small>次数</small><b>${e.reps}</b></span><span><small>余力</small><b>RIR ${e.rir}</b></span><span><small>休息</small><b>${e.rest}</b></span></div></div>`).join("")}</div>`:"<div class='recovery-card'>今天不堆力量训练量，完成低冲击有氧与活动度即可。</div>"}<footer class="cardio-strip"><span>♥</span><div><small>训练后有氧</small><b>${s.cardio.mode} · ${s.cardio.minutes} 分钟</b><p>${s.cardio.intensity}</p></div></footer></article>`).join("")}</div><p class="evidence-footnote">具体日期优先采用用户选择；只指定星期时按星期排布；均未指定时自动错开高疲劳训练。错过一次训练时不要在同一天补做两次，重新生成方案或选择下一个可恢复日期。</p></section>`;
  $$('[data-week]').forEach(b=>b.onclick=()=>{state.week=Number(b.dataset.week);renderTraining(plan)});
  $$(".movement-guide-link").forEach(button=>button.onclick=()=>openExerciseGuide(getExerciseByName(button.dataset.exerciseName)));
  $("#exportTrainingCalendar").onclick=()=>downloadTrainingCalendar(plan);
}
function icsDate(date,time){return `${date.replaceAll("-","")}T${time.replace(":","")}00`}
function downloadTrainingCalendar(plan){
  const entries=plan.training.schedule?.entries||[];
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//衡燃//个性化训练日历//CN","CALSCALE:GREGORIAN","METHOD:PUBLISH"];
  for(const item of entries)lines.push("BEGIN:VEVENT",`UID:${activeMember().id}-${item.date}-${item.sessionIndex}@hengran`,`DTSTART;TZID=Asia/Shanghai:${icsDate(item.date,item.startTime)}`,`DTEND;TZID=Asia/Shanghai:${icsDate(item.date,item.endTime)}`,`SUMMARY:衡燃训练 · ${item.label}`,`DESCRIPTION:${item.source}；预计${item.totalMinutes}分钟。请在网站查看动作、组数、RIR与替换动作。`,"END:VEVENT");
  lines.push("END:VCALENDAR");
  const blob=new Blob([lines.join("\r\n")],{type:"text/calendar;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=`${activeMember().name}-4周训练日历.ics`;a.click();URL.revokeObjectURL(url);toast("训练日历已导出");
}
function renderMeals(plan){
  if(plan.meals.conflicts.length){$("#mealsPanel").innerHTML=`<div class="notice"><b>无法安全生成</b><p>${plan.meals.conflicts.join("；")}。请调整硬性排除条件，或由营养专业人员设计。</p></div>`;return}
  const day=plan.meals.days[state.day],delta=Math.round((day.total.kcal-plan.targets.calories)/plan.targets.calories*100),mealIcons={早餐:"☀",午餐:"◐",晚餐:"☾",加餐:"◇"};
  $("#mealsPanel").innerHTML=`<section class="meal-dashboard"><div class="day-selector">${plan.meals.days.map((d,i)=>`<button class="${i===state.day?"active":""}" data-day="${i}"><span>DAY</span>${d.day}</button>`).join("")}</div><article class="nutrition-hero"><div><span class="badge">第 ${day.day} 天菜单</span><h2>${day.total.kcal} <small>kcal</small></h2><p>与目标相比 ${delta===0?"刚好":delta>0?`高 ${delta}%`:`低 ${Math.abs(delta)}%`}；克重可直接编辑。</p></div><div class="macro-dashboard"><span><b>${day.total.protein}</b>蛋白质 g<progress max="${plan.targets.protein}" value="${Math.min(day.total.protein,plan.targets.protein)}"></progress></span><span><b>${day.total.carbs}</b>碳水 g<progress max="${plan.targets.carbs}" value="${Math.min(day.total.carbs,plan.targets.carbs)}"></progress></span><span><b>${day.total.fat}</b>脂肪 g<progress max="${plan.targets.fat}" value="${Math.min(day.total.fat,plan.targets.fat)}"></progress></span></div><button class="primary-button replace-day">换一整天菜单</button></article><div class="meal-grid">${day.meals.map((meal,mi)=>`<article class="meal-card-v2"><header><div class="meal-icon">${mealIcons[meal.name]||"◇"}</div><div><small>${meal.name}</small>${meal.recipeName?`<b class="meal-recipe-name">${escapeHtml(meal.recipeName)}</b>`:""}<h3>${meal.total.kcal} kcal</h3></div><div class="macro-row"><span>P ${meal.total.protein}g</span><span>C ${meal.total.carbs}g</span><span>F ${meal.total.fat}g</span></div></header><div class="food-stack">${meal.items.map((x,ii)=>`<div class="food-item-v2"><div><b>${x.food.name}</b><small>${x.food.state} · 每100g含碳水 ${x.food.carbs}g</small></div><label><input class="meal-grams" data-meal="${mi}" data-item="${ii}" type="number" value="${x.grams}" min="10" max="800" step="5"><span>克</span></label><button class="icon-swap replace-food" data-meal="${mi}" data-item="${ii}" title="同类等热量替换" aria-label="替换${x.food.name}">↻</button></div>`).join("")}</div><p class="method"><b>3步内做法</b>${meal.method}</p><footer><select class="meal-strategy" data-meal="${mi}" aria-label="${meal.name}整餐替换方式"><option value="all">整餐全新组合</option><option value="staple">只换主食类别</option><option value="protein">只换蛋白类别</option><option value="volume">高蔬菜量组合</option></select><button class="secondary-button replace-meal" data-meal="${mi}">替换整餐</button></footer></article>`).join("")}</div><p class="evidence-footnote">替换会先执行过敏原、饮食模式和“绝对不吃”筛选，再按全天目标重算。外卖、烹调油和熟重含水量会造成明显误差。</p></section>`;
  $$('[data-day]').forEach(b=>b.onclick=()=>{state.day=Number(b.dataset.day);renderMeals(plan)});
  $$('.replace-food').forEach(b=>b.onclick=()=>{replaceMealItem(state.profile,day,Number(b.dataset.meal),Number(b.dataset.item));write(KEYS.plans,state.plans);renderMeals(plan);toast("已按同类食物近似等热量替换")});
  $$('.replace-meal').forEach(b=>b.onclick=()=>{const mi=Number(b.dataset.meal),strategy=$(`.meal-strategy[data-meal="${mi}"]`).value,result=replaceWholeMeal(state.profile,day,mi,strategy,plan.targets,state.mealVariant++);if(!result.ok){toast(result.message);return}write(KEYS.plans,state.plans);renderMeals(plan);toast("整餐已替换并重算全天营养")});
  $('.replace-day').onclick=()=>{const result=replaceDayMenu(state.profile,day,plan.targets,state.mealVariant++);if(!result.ok){toast(result.message);return}plan.meals.days[state.day]=result.day;write(KEYS.plans,state.plans);renderMeals(plan);toast("已更换整天菜单")};
  $$('.meal-grams').forEach(input=>input.onchange=()=>{const mi=Number(input.dataset.meal),ii=Number(input.dataset.item);day.meals[mi].items[ii].grams=Number(input.value);day.meals[mi].total=calculateMeal(day.meals[mi].items);day.total=calculateMeal(day.meals.flatMap(m=>m.items));write(KEYS.plans,state.plans);renderMeals(plan)});
}
function renderSwap(){
  const food=foods.find(f=>f.id===state.foodId)||foods[0];$("#swapPanel").innerHTML=`<div class="swap-grid"><div class="food-search"><input id="foodQuery" placeholder="搜索食物"><select id="foodCategory"><option value="all">全部类别</option>${[...new Set(foods.map(f=>f.category))].map(c=>`<option>${c}</option>`).join("")}</select><div class="food-results" id="foodResults"></div></div><div class="converter"><span class="badge">实时克重换算</span><h2 id="converterName">${food.name}</h2><p class="muted">${food.state} · ${food.source}</p><label>食物重量 <input id="convertGrams" type="range" min="10" max="500" value="100" step="5"> <b id="gramsLabel">100 g</b></label><div class="converter-output" id="calorieOutput">${food.kcal} kcal</div><div class="macro-row" id="convertMacros"></div><p id="rawNote" class="muted"></p><p class="notice"><b>误差提示</b><span>${food.note}</span></p></div></div>`;
  const renderResults=()=>{const q=$("#foodQuery").value.trim(),c=$("#foodCategory").value;const list=foods.filter(f=>(!q||f.name.includes(q))&&(c==="all"||f.category===c)).slice(0,60);$("#foodResults").innerHTML=list.map(f=>`<button class="food-result ${f.id===state.foodId?"active":""}" data-food="${f.id}"><b>${f.name}</b><br><small>${f.kcal} kcal · P ${f.protein} · C ${f.carbs}</small></button>`).join("");$$('[data-food]').forEach(b=>b.onclick=()=>{state.foodId=b.dataset.food;renderSwap()})};
  const update=()=>{const g=Number($("#convertGrams").value),f=foods.find(x=>x.id===state.foodId);$("#gramsLabel").textContent=`${g} g`;$("#calorieOutput").textContent=`${Math.round(f.kcal*g/100)} kcal`;$("#convertMacros").innerHTML=`<span>蛋白质 ${(f.protein*g/100).toFixed(1)} g</span><span>脂肪 ${(f.fat*g/100).toFixed(1)} g</span><span>碳水 ${(f.carbs*g/100).toFixed(1)} g</span><span>纤维 ${(f.fiber*g/100).toFixed(1)} g</span>`;$("#rawNote").textContent=f.rawRatio?`生重备注：${g} g ${f.state}约对应 ${Math.round(g*f.rawRatio)} g 生重/干重；含水量会造成误差。`:"该成品没有可靠的统一生熟换算。"};
  $("#foodQuery").oninput=renderResults;$("#foodCategory").onchange=renderResults;$("#convertGrams").oninput=update;renderResults();update();
}
function renderHistory(plan){$("#historyPanel").innerHTML=`<div class="reference-list">${[...state.plans].reverse().map((p,i)=>`<article class="reference"><div class="reference-index">v${p.version}</div><div><h3>${new Date(p.createdAt).toLocaleString("zh-CN")}</h3><p>${p.reason||"档案更新"} · ${p.targets.calories} kcal · ${p.training.structure}</p></div>${p.version!==plan.version?`<button class="secondary-button rollback" data-version="${p.version}">回退为新版本</button>`:`<span class="badge">当前</span>`}</article>`).join("")}</div>`;$$('.rollback').forEach(b=>b.onclick=()=>{const old=state.plans.find(p=>p.version===Number(b.dataset.version));const clone=structuredClone(old);clone.version=plan.version+1;clone.createdAt=new Date().toISOString();clone.reason=`从 v${old.version} 回退创建`;state.plans.push(clone);write(KEYS.plans,state.plans);renderAll();toast("已回退并创建新版本")})}
function renderPlan(){const plan=currentPlan();$("#planEmpty").hidden=!!plan;$("#planContent").hidden=!plan;if(!plan)return;const profile=state.profile||plan.input||{};$("#planHeadline").textContent=`${profile.goal==="recomp"?"体态重组":profile.goal==="faster"?"较快减脂":"稳定减脂"} · v${plan.version}`;$("#planMeta").textContent=`生成于 ${new Date(plan.createdAt).toLocaleString("zh-CN")} · ${plan.training.structure} · ${plan.meals.allowedCount}种食物通过硬性筛选`;renderSummary(plan);renderTraining(plan);renderMeals(plan);renderSwap();renderHistory(plan)}
$$('.tab').forEach(tab=>tab.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle("active",x===tab));$$('.tab-panel').forEach(x=>x.classList.remove("active"));$(`#${tab.dataset.tab}Panel`).classList.add("active")});

function renderRecords(){const body=$("#recordsBody");body.innerHTML=state.records.length?[...state.records].reverse().map((r,reverseIndex)=>`<tr><td>${r.date}</td><td>${r.weight||"—"}</td><td>${r.waist||"—"}</td><td>${r.steps||"—"}</td><td>${r.sleep||"—"}</td><td>${r.fatigue||"—"}</td><td>${r.adherence?`${r.adherence}%`:"—"}</td><td><button class="text-button delete-record" data-index="${state.records.length-1-reverseIndex}">删除</button></td></tr>`).join(""):`<tr><td colspan="8" class="empty-mini">还没有记录</td></tr>`;$$('.delete-record').forEach(b=>b.onclick=()=>{state.records.splice(Number(b.dataset.index),1);write(KEYS.records,state.records);renderRecords();renderTrend();renderOverview()})}
function renderTrend(){const panel=$("#trendPanel");if(!state.profile||!currentPlan()){panel.innerHTML="<h3>当前判断</h3><div class='empty-mini'>先生成个人方案</div>";return}const a=assessProgress(state.records,state.profile,currentPlan());if(!a.ready){panel.innerHTML=`<h3>当前判断</h3><div class="empty-mini">${a.message}<br><small>未达到阈值前不建议调整。</small></div>`;return}panel.innerHTML=`<h3>当前判断</h3><div class="trend-big ${a.proposal?"trend-warn":"trend-good"}">${a.status}</div><p>7日均重：${a.firstAvg} → ${a.lastAvg} kg<br>估算每周变化：${a.weeklyRate}% · 腰围变化：${a.waistChange} cm</p>${a.proposal?`<div class="proposal"><b>待确认调整</b><p>${a.proposal.text}</p><small>${a.proposal.reason}</small><br><button class="primary-button" id="acceptProposal">确认并创建新版本</button></div>`:"<p class='muted'>暂不调整，继续执行并记录。</p>"}`;if(a.proposal)$("#acceptProposal").onclick=()=>acceptProposal(a.proposal)}
function acceptProposal(proposal){const old=currentPlan(),next=structuredClone(old);next.version=old.version+1;next.createdAt=new Date().toISOString();next.reason=proposal.reason;next.adjustments=[...(old.adjustments||[]),proposal];if(proposal.type==="deficit")next.targets.calories-=125;else next.targets.calories+=125;state.plans.push(next);write(KEYS.plans,state.plans);renderAll();toast("调整已确认并创建新版本")}
function setProgressDirty(value){progressDirty=value;const el=$("#progressSaveState");el.textContent=value?"未保存":"已保存";el.style.background=value?"var(--amber)":"var(--mint)";el.style.color=value?"#422f10":"var(--green-dark)"}
function saveProgressRecord(){const form=$("#progressForm"),data=Object.fromEntries(new FormData(form).entries());if(!data.weight&&!data.waist){toast("体重或腰围至少填写一项");return false}state.records.push(data);state.records.sort((a,b)=>a.date.localeCompare(b.date));if(!write(KEYS.records,state.records)){state.records.pop();return false}form.reset();form.elements.date.value=new Date().toISOString().slice(0,10);setProgressDirty(false);renderRecords();renderTrend();renderOverview();toast("记录已保存");return true}
$("#progressForm").addEventListener("input",()=>setProgressDirty(true));
$("#progressForm").addEventListener("submit",e=>{e.preventDefault();saveProgressRecord()});
$("#clearRecords").onclick=()=>{if(confirm("确定清空全部进度记录？可先导出备份。")){state.records=[];write(KEYS.records,[]);renderAll()}};

function reportRecords(range){
  if(range==="all")return [...state.records];
  const cutoff=new Date();cutoff.setHours(0,0,0,0);cutoff.setDate(cutoff.getDate()-Number(range)+1);
  return state.records.filter(record=>record.date&&new Date(`${record.date}T00:00:00`)>=cutoff);
}
function reportTrendSvg(records){
  const values=records.filter(record=>Number(record.weight)).map(record=>Number(record.weight));
  if(values.length<2)return `<div class="report-empty">所选范围内不足2次体重记录，暂不绘制趋势图。</div>`;
  const width=700,height=150,pad=22,min=Math.min(...values),max=Math.max(...values),span=Math.max(1,max-min);
  const points=values.map((value,index)=>`${pad+index*(width-pad*2)/(values.length-1)},${height-pad-(value-min)*(height-pad*2)/span}`).join(" ");
  return `<svg class="report-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="体重趋势折线图"><line x1="${pad}" y1="${height-pad}" x2="${width-pad}" y2="${height-pad}"/><polyline points="${points}"/><text x="${pad}" y="16">最高 ${max.toFixed(1)} kg</text><text x="${width-pad}" y="${height-4}" text-anchor="end">最低 ${min.toFixed(1)} kg</text></svg>`;
}
function renderPrintReport(range="45"){
  const member=activeMember(),profile=state.profile,plan=currentPlan(),records=reportRecords(range),rangeText=range==="all"?"全部记录":`最近${range}天`;
  if(!profile||!plan){toast("当前成员需要先完成档案并生成方案");return false}
  const profileRows=[
    ["年龄",`${profile.age}岁`],["生理性别",profile.sex==="male"?"男性":"女性"],["身高",`${profile.height} cm`],["体重",`${profile.weight} kg`],
    ["体脂率",profile.bodyFat?`${profile.bodyFat}%`:"未填写"],["腰围",profile.waist?`${profile.waist} cm`:"未填写"],["训练条件",profile.equipment==="gym"?"健身房":profile.equipment==="home"?"家庭器械":"徒手"],["每周安排",`${profile.days}天 × ${profile.minutes}分钟`],
    ["饮食模式",profile.diet],["身体限制",(profile.limits||[]).join("、")||"未报告"]
  ];
  const trainingHtml=plan.training.weeks.map(week=>`<section class="report-week"><h3>第${week.week}周 · ${week.focus}</h3><p>${escapeHtml(week.change)}；${escapeHtml(week.instruction)}</p>${week.sessions.map(session=>`<div class="report-session"><h4>${escapeHtml(session.label)} <span>${session.schedule?`${session.schedule.date} ${session.schedule.weekday} ${session.schedule.startTime}～${session.schedule.endTime}`:escapeHtml(session.type)}</span></h4>${session.schedule?`<p>${session.schedule.timeline.map(item=>`${item.start} ${item.label} ${item.minutes}分钟`).join(" → ")}</p>`:""}${session.exercises?.length?`<table><thead><tr><th>动作</th><th>组数</th><th>次数</th><th>RIR</th><th>休息</th></tr></thead><tbody>${session.exercises.map(exercise=>`<tr><td>${escapeHtml(exercise.name)}</td><td>${exercise.sets}</td><td>${escapeHtml(exercise.reps)}</td><td>${escapeHtml(exercise.rir)}</td><td>${escapeHtml(exercise.rest)}</td></tr>`).join("")}</tbody></table>`:""}<p class="report-cardio">有氧：${escapeHtml(session.cardio?.mode||"—")} · ${session.cardio?.minutes||0}分钟 · ${escapeHtml(session.cardio?.intensity||"")}</p></div>`).join("")}</section>`).join("");
  const mealsHtml=plan.meals.days.map(day=>`<section class="report-day"><h3>第${day.day}天 <span>${day.total.kcal} kcal · P ${day.total.protein}g · C ${day.total.carbs}g · F ${day.total.fat}g</span></h3>${day.meals.map(meal=>`<div class="report-meal"><h4>${meal.name}${meal.recipeName?` · ${escapeHtml(meal.recipeName)}`:""}</h4><p>${meal.items.map(item=>`${escapeHtml(item.food.name)} ${item.grams}g`).join("；")}</p><small>${escapeHtml(meal.method)}</small></div>`).join("")}</section>`).join("");
  $("#printReport").innerHTML=`<header class="report-cover"><div><span>衡燃 · 个性化减脂报告</span><h1>${escapeHtml(member.name)}</h1><p>生成日期：${new Date().toLocaleDateString("zh-CN")} · 当前方案 v${plan.version} · 进度范围：${rangeText}</p></div><div class="report-score"><b>${plan.targets.calories}</b><span>每日目标 kcal</span></div></header><section class="report-section"><h2>一、个人信息与目标</h2><div class="report-profile">${profileRows.map(([label,value])=>`<div><small>${label}</small><b>${escapeHtml(value)}</b></div>`).join("")}</div><div class="report-targets"><span>BMI <b>${plan.targets.bmi}</b></span><span>维持热量估算 <b>${plan.targets.tdee} kcal</b></span><span>蛋白质 <b>${plan.targets.protein}g</b></span><span>脂肪 <b>${plan.targets.fat}g</b></span><span>碳水 <b>${plan.targets.carbs}g</b></span></div></section><section class="report-section report-page-break"><h2>二、完整4周训练计划</h2><p class="report-note">RIR表示预计还能完成的规范次数；心率仅作辅助，优先结合谈话测试和主观用力程度。</p>${trainingHtml}</section><section class="report-section report-page-break"><h2>三、完整7天饮食计划</h2><p class="report-note">食物克重以页面标注的熟重或可食部为准；家庭烹调油、外卖和成品含水量会造成误差。</p>${mealsHtml}</section><section class="report-section report-page-break"><h2>四、测量与进度（${rangeText}）</h2>${reportTrendSvg(records)}<table><thead><tr><th>日期</th><th>体重 kg</th><th>腰围 cm</th><th>步数</th><th>睡眠 h</th><th>疲劳</th><th>完成率</th></tr></thead><tbody>${records.length?records.map(record=>`<tr><td>${record.date}</td><td>${record.weight||"—"}</td><td>${record.waist||"—"}</td><td>${record.steps||"—"}</td><td>${record.sleep||"—"}</td><td>${record.fatigue||"—"}</td><td>${record.adherence?`${record.adherence}%`:"—"}</td></tr>`).join(""):`<tr><td colspan="7">所选范围内暂无记录</td></tr>`}</tbody></table></section><footer class="report-footer">本报告面向一般健康成人，用于健康管理参考，不能诊断疾病或替代医生、注册营养师和康复专业人员。</footer>`;
  $("#printReport").setAttribute("aria-hidden","false");return true;
}
$("#generateReport").onclick=()=>{if(!renderPrintReport($("#reportRange").value))return;$("#reportDialog").close();document.body.classList.add("printing-report");setTimeout(()=>window.print(),100)};
window.addEventListener("afterprint",()=>{document.body.classList.remove("printing-report");$("#printReport").setAttribute("aria-hidden","true")});

function poseFor(key,stage){
  const poses={
    squat:[{head:[55,25],shoulder:[55,43],hip:[55,73],knee:[43,98],ankle:[40,128],hand:[72,63]},{head:[48,40],shoulder:[52,58],hip:[62,86],knee:[42,102],ankle:[34,128],hand:[76,75]},{head:[55,25],shoulder:[55,43],hip:[55,73],knee:[65,100],ankle:[70,128],hand:[38,63]}],
    hinge:[{head:[55,24],shoulder:[55,43],hip:[55,73],knee:[52,101],ankle:[50,129],hand:[70,71]},{head:[82,42],shoulder:[70,58],hip:[53,78],knee:[47,103],ankle:[45,129],hand:[86,84]},{head:[55,24],shoulder:[55,43],hip:[55,73],knee:[58,101],ankle:[60,129],hand:[40,71]}],
    lunge:[{head:[55,24],shoulder:[55,43],hip:[55,73],knee:[42,100],ankle:[30,129],hand:[72,70]},{head:[55,38],shoulder:[55,56],hip:[55,84],knee:[36,104],ankle:[24,129],hand:[73,83]},{head:[55,24],shoulder:[55,43],hip:[55,73],knee:[70,100],ankle:[88,129],hand:[38,70]}],
    push:[{head:[27,62],shoulder:[47,68],hip:[78,78],knee:[103,84],ankle:[130,87],hand:[45,96]},{head:[27,82],shoulder:[49,83],hip:[78,81],knee:[104,84],ankle:[130,87],hand:[48,105]},{head:[27,62],shoulder:[47,68],hip:[78,78],knee:[103,84],ankle:[130,87],hand:[70,102]}],
    pull:[{head:[55,25],shoulder:[55,43],hip:[55,76],knee:[56,102],ankle:[58,130],hand:[100,65]},{head:[55,25],shoulder:[55,43],hip:[55,76],knee:[56,102],ankle:[58,130],hand:[72,58]},{head:[55,25],shoulder:[55,43],hip:[55,76],knee:[56,102],ankle:[58,130],hand:[92,65]}],
    vertical:[{head:[55,30],shoulder:[55,48],hip:[55,79],knee:[55,104],ankle:[55,132],hand:[35,62]},{head:[55,30],shoulder:[55,48],hip:[55,79],knee:[55,104],ankle:[55,132],hand:[38,22]},{head:[55,30],shoulder:[55,48],hip:[55,79],knee:[55,104],ankle:[55,132],hand:[75,22]}],
    core:[{head:[28,78],shoulder:[48,82],hip:[80,88],knee:[105,78],ankle:[128,82],hand:[48,108]},{head:[28,78],shoulder:[48,82],hip:[80,88],knee:[104,60],ankle:[125,44],hand:[72,52]},{head:[28,78],shoulder:[48,82],hip:[80,88],knee:[105,78],ankle:[128,82],hand:[90,108]}],
    carry:[{head:[55,24],shoulder:[55,44],hip:[55,76],knee:[45,103],ankle:[39,130],hand:[82,75]},{head:[55,24],shoulder:[55,44],hip:[55,76],knee:[68,101],ankle:[80,127],hand:[82,75]},{head:[55,24],shoulder:[55,44],hip:[55,76],knee:[45,103],ankle:[39,130],hand:[28,75]}],
    isolation:[{head:[55,24],shoulder:[55,43],hip:[55,76],knee:[55,103],ankle:[55,131],hand:[55,82]},{head:[55,24],shoulder:[55,43],hip:[55,76],knee:[55,103],ankle:[55,131],hand:[82,57]},{head:[55,24],shoulder:[55,43],hip:[55,76],knee:[55,103],ankle:[55,131],hand:[30,57]}],
    cardio:[{head:[55,24],shoulder:[55,43],hip:[55,76],knee:[42,101],ankle:[32,130],hand:[72,65]},{head:[55,24],shoulder:[55,43],hip:[55,76],knee:[70,92],ankle:[84,109],hand:[35,58]},{head:[55,24],shoulder:[55,43],hip:[55,76],knee:[45,93],ankle:[34,112],hand:[76,56]}],
    mobility:[{head:[55,24],shoulder:[55,43],hip:[55,76],knee:[55,103],ankle:[55,131],hand:[32,62]},{head:[55,24],shoulder:[55,43],hip:[55,76],knee:[55,103],ankle:[55,131],hand:[30,28]},{head:[55,24],shoulder:[55,43],hip:[55,76],knee:[55,103],ankle:[55,131],hand:[82,28]}]
  };return (poses[key]||poses.isolation)[stage]||(poses[key]||poses.isolation)[0];
}
function exerciseSvg(exercise,stage=0,label=""){
  const pose=poseFor(exercise.visualKey,stage),[hx,hy]=pose.head,[sx,sy]=pose.shoulder,[px,py]=pose.hip,[kx,ky]=pose.knee,[ax,ay]=pose.ankle,[wx,wy]=pose.hand;
  const mirror=110-wx;
  return `<svg class="exercise-pose" viewBox="0 0 160 150" role="img" aria-label="${escapeHtml(exercise.name)}${label}示意"><rect x="5" y="5" width="150" height="140" rx="18"/><line class="ground" x1="18" y1="133" x2="142" y2="133"/><circle cx="${hx}" cy="${hy}" r="9"/><line x1="${sx}" y1="${sy}" x2="${px}" y2="${py}"/><line x1="${sx}" y1="${sy}" x2="${wx}" y2="${wy}"/><line x1="${sx}" y1="${sy}" x2="${mirror}" y2="${wy}"/><line x1="${px}" y1="${py}" x2="${kx}" y2="${ky}"/><line x1="${kx}" y1="${ky}" x2="${ax}" y2="${ay}"/><line x1="${px}" y1="${py}" x2="${110-kx}" y2="${ky}"/><line x1="${110-kx}" y1="${ky}" x2="${110-ax}" y2="${ay}"/><text x="80" y="143" text-anchor="middle">${escapeHtml(label)}</text><text class="tool-label" x="145" y="19" text-anchor="end">${escapeHtml(exercise.tool)}</text></svg>`;
}
let motionAnimationFrame=0;
function motionAvatarMarkup(view){
  return `<g class="motion-avatar" data-view="${view}">
    <ellipse class="motion-shadow" cx="55" cy="133" rx="30" ry="5"/>
    <g class="motion-rear-limbs">
      <path class="motion-skin motion-thigh" data-part="thigh2"/><path class="motion-skin motion-shin" data-part="shin2"/><path class="motion-shoe" data-part="foot2"/>
      <path class="motion-skin motion-upper-arm" data-part="upperArm2"/><path class="motion-skin motion-forearm" data-part="forearm2"/><ellipse class="motion-hand" data-part="hand2" rx="4.6" ry="3.2"/>
    </g>
    <path class="motion-neck" data-part="neck"/>
    <path class="motion-shirt" data-part="torso"/>
    <path class="motion-shorts" data-part="pelvis"/>
    <path class="motion-skin motion-thigh" data-part="thigh1"/><path class="motion-skin motion-shin" data-part="shin1"/><path class="motion-shoe" data-part="foot1"/>
    <path class="motion-skin motion-upper-arm" data-part="upperArm1"/><path class="motion-skin motion-forearm" data-part="forearm1"/><ellipse class="motion-hand" data-part="hand1" rx="4.6" ry="3.2"/>
    <ellipse class="motion-head" data-part="head" rx="8.4" ry="10.3"/>
    <path class="motion-hair" data-part="hair"/>
    <circle class="motion-ear" data-part="ear" r="1.8"/>
    <path class="motion-face" data-part="face"/>
    <path class="motion-shirt-highlight" data-part="shirtHighlight"/>
  </g>`;
}
function motionPlayerMarkup(exercise,motion){
  const multi=motion.mode==="multi-angle";
  return `<section class="motion-player" id="motionPlayer" data-exercise="${exercise.id}"><div class="motion-stage"><svg viewBox="0 0 360 190" role="img" aria-label="${escapeHtml(exercise.name)}拟真人循环动作演示"><defs><linearGradient id="motionSkin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd0aa"/><stop offset=".42" stop-color="#d98b5a"/><stop offset="1" stop-color="#8b432f"/></linearGradient><linearGradient id="motionShirt" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#52616a"/><stop offset=".5" stop-color="#252e33"/><stop offset="1" stop-color="#0f1518"/></linearGradient><linearGradient id="motionShorts" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#303b41"/><stop offset="1" stop-color="#0d1113"/></linearGradient><linearGradient id="motionShoe" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#67747b"/><stop offset=".55" stop-color="#232b2f"/><stop offset="1" stop-color="#0d1113"/></linearGradient><filter id="motionDepth" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="1.2" dy="1.8" stdDeviation="1.2" flood-color="#000" flood-opacity=".35"/></filter></defs>${motionAvatarMarkup("a")}${motionAvatarMarkup("b")}<text class="motion-angle-label" x="180" y="178" text-anchor="middle">${multi?"侧面视角":"单角度循环"}</text></svg><div class="motion-status"><span>${motion.fps} FPS 拟真人插值</span><span>${multi?"角度A → 角度B → 分屏":"固定机位"}</span></div></div><div class="motion-controls"><button class="secondary-button" id="motionToggle">暂停</button><button class="secondary-button" id="motionSpeed">速度 1×</button><label>动作进度<input id="motionScrubber" type="range" min="0" max="1000" value="0"></label></div><p class="motion-note">画面采用有身体体积、服装和明暗层次的统一拟真人模型，并由浏览器连续插值；不是火柴人，也不是摄像头姿态识别或真人实拍。</p></section>`;
}
function interpolatePose(key,progress){
  const start=poseFor(key,0),end=poseFor(key,1),depth=(1-Math.cos(progress*Math.PI*2))/2,result={};
  for(const joint of ["head","shoulder","hip","knee","ankle","hand"])result[joint]=start[joint].map((value,index)=>value+(end[joint][index]-value)*depth);
  return result;
}
function setMotionPose(group,pose){
  if(!group)return;
  const [hx,hy]=pose.head,[sx,sy]=pose.shoulder,[px,py]=pose.hip,[kx,ky]=pose.knee,[ax,ay]=pose.ankle,[wx,wy]=pose.hand;
  const mirrorX=value=>110-value,knee2=mirrorX(kx),ankle2=mirrorX(ax),hand2=mirrorX(wx);
  const vector=(a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1;return {dx,dy,length,nx:-dy/length,ny:dx/length}};
  const segmentPath=(a,b,startWidth,endWidth)=>{
    const {nx,ny}=vector(a,b),s=startWidth/2,e=endWidth/2;
    return `M ${a[0]+nx*s} ${a[1]+ny*s} L ${b[0]+nx*e} ${b[1]+ny*e} Q ${b[0]} ${b[1]+e*.35} ${b[0]-nx*e} ${b[1]-ny*e} L ${a[0]-nx*s} ${a[1]-ny*s} Q ${a[0]} ${a[1]-s*.25} ${a[0]+nx*s} ${a[1]+ny*s} Z`;
  };
  const torsoVector=vector([sx,sy],[px,py]),shoulderLeft=[sx+torsoVector.nx*10,sy+torsoVector.ny*10],shoulderRight=[sx-torsoVector.nx*10,sy-torsoVector.ny*10],hipLeft=[px+torsoVector.nx*7,py+torsoVector.ny*7],hipRight=[px-torsoVector.nx*7,py-torsoVector.ny*7];
  const torso=`M ${shoulderLeft[0]} ${shoulderLeft[1]} Q ${sx+torsoVector.nx*12} ${sy+8} ${hipLeft[0]} ${hipLeft[1]} Q ${px} ${py+4} ${hipRight[0]} ${hipRight[1]} Q ${sx-torsoVector.nx*12} ${sy+8} ${shoulderRight[0]} ${shoulderRight[1]} Q ${sx} ${sy-4} ${shoulderLeft[0]} ${shoulderLeft[1]} Z`;
  const pelvis=`M ${hipLeft[0]+1} ${hipLeft[1]-2} L ${hipRight[0]-1} ${hipRight[1]-2} L ${hipRight[0]-2} ${hipRight[1]+10} Q ${px} ${py+14} ${hipLeft[0]+2} ${hipLeft[1]+10} Z`;
  const elbow=(start,end,side)=>{const mid=[(start[0]+end[0])*.5,(start[1]+end[1])*.5],v=vector(start,end);return [mid[0]+v.nx*side*3.2,mid[1]+v.ny*side*3.2]};
  const arm1Start=shoulderLeft,arm2Start=shoulderRight,elbow1=elbow(arm1Start,[wx,wy],1),elbow2=elbow(arm2Start,[hand2,wy],-1);
  const setPath=(part,d)=>$(`[data-part="${part}"]`,group)?.setAttribute("d",d);
  setPath("torso",torso);setPath("pelvis",pelvis);
  setPath("neck",segmentPath([sx,sy-1],[hx,hy+8],6,5));
  setPath("upperArm1",segmentPath(arm1Start,elbow1,8.5,7));setPath("forearm1",segmentPath(elbow1,[wx,wy],7,5.2));
  setPath("upperArm2",segmentPath(arm2Start,elbow2,8.2,6.8));setPath("forearm2",segmentPath(elbow2,[hand2,wy],6.8,5));
  setPath("thigh1",segmentPath(hipLeft,[kx,ky],12,9));setPath("shin1",segmentPath([kx,ky],[ax,ay],9,6.5));
  setPath("thigh2",segmentPath(hipRight,[knee2,ky],11.5,8.5));setPath("shin2",segmentPath([knee2,ky],[ankle2,ay],8.5,6));
  setPath("foot1",segmentPath([ax,ay],[ax+10,ay+1.5],7,5));setPath("foot2",segmentPath([ankle2,ay],[ankle2+10,ay+1.5],7,5));
  setPath("hair",`M ${hx-7.5} ${hy-2} Q ${hx-6.5} ${hy-11} ${hx+1} ${hy-10.5} Q ${hx+8} ${hy-9} ${hx+7.5} ${hy-3} Q ${hx+1} ${hy-6} ${hx-7.5} ${hy-2} Z`);
  setPath("face",`M ${hx+2.5} ${hy-1} L ${hx+7.8} ${hy+1.5} L ${hx+3.2} ${hy+3}`);
  setPath("shirtHighlight",`M ${shoulderLeft[0]-1} ${shoulderLeft[1]+2} Q ${sx} ${sy+4} ${hipLeft[0]-1} ${hipLeft[1]-2}`);
  const setEllipse=(part,x,y,rotation=0)=>{const node=$(`[data-part="${part}"]`,group);if(!node)return;node.setAttribute("cx",x);node.setAttribute("cy",y);node.setAttribute("transform",`rotate(${rotation} ${x} ${y})`)};
  const torsoAngle=Math.atan2(py-sy,px-sx)*180/Math.PI-90;
  setEllipse("head",hx,hy,torsoAngle);setEllipse("ear",hx-7.5,hy+.5,torsoAngle);setEllipse("hand1",wx,wy,Math.atan2(wy-elbow1[1],wx-elbow1[0])*180/Math.PI);setEllipse("hand2",hand2,wy,Math.atan2(wy-elbow2[1],hand2-elbow2[0])*180/Math.PI);
}
function startMotionPlayer(exercise,motion){
  cancelAnimationFrame(motionAnimationFrame);const player=$("#motionPlayer");if(!player)return;
  const avatarA=$('[data-view="a"]',player),avatarB=$('[data-view="b"]',player),label=$(".motion-angle-label",player),scrubber=$("#motionScrubber",player),toggle=$("#motionToggle",player),speedButton=$("#motionSpeed",player);
  let playing=!matchMedia("(prefers-reduced-motion: reduce)").matches,speed=1,origin=performance.now(),manual=0;
  const layout=progress=>{
    const multi=motion.mode==="multi-angle";let local=progress;
    if(!multi){avatarA.style.display="";avatarB.style.display="none";avatarA.setAttribute("transform","translate(96 8) scale(1.55)");label.textContent="固定机位 · 单角度循环"}
    else if(progress<.33){local=progress/.33;avatarA.style.display="";avatarB.style.display="none";avatarA.setAttribute("transform","translate(96 8) scale(1.55)");label.textContent="角度A · 侧面"}
    else if(progress<.66){local=(progress-.33)/.33;avatarA.style.display="none";avatarB.style.display="";avatarB.setAttribute("transform","translate(264 8) scale(-1.55 1.55)");label.textContent="角度B · 斜前方"}
    else{local=(progress-.66)/.34;avatarA.style.display="";avatarB.style.display="";avatarA.setAttribute("transform","translate(33 38) scale(1.02)");avatarB.setAttribute("transform","translate(327 38) scale(-1.02 1.02)");label.textContent="双角度同步对照"}
    const pose=interpolatePose(exercise.visualKey,local);setMotionPose(avatarA,pose);setMotionPose(avatarB,pose);
  };
  const frame=now=>{if(playing)manual=((now-origin)/1000*speed/motion.duration)%1;layout(manual);scrubber.value=Math.round(manual*1000);motionAnimationFrame=requestAnimationFrame(frame)};
  toggle.onclick=()=>{playing=!playing;toggle.textContent=playing?"暂停":"继续";if(playing)origin=performance.now()-manual*motion.duration*1000/speed};
  speedButton.onclick=()=>{speed=speed===1?.5:speed===.5?1.5:1;speedButton.textContent=`速度 ${speed}×`;origin=performance.now()-manual*motion.duration*1000/speed};
  scrubber.oninput=()=>{manual=Number(scrubber.value)/1000;origin=performance.now()-manual*motion.duration*1000/speed;layout(manual)};
  if(!playing)toggle.textContent="继续";motionAnimationFrame=requestAnimationFrame(frame);
}
function openExerciseGuide(exercise){
  if(!exercise)return;state.exerciseId=exercise.id;$("#exerciseDialogTitle").textContent=exercise.name;
  const motion=getMotion(exercise.id),reviewed=exercise.reviewStatus==="首批逐项复核";
  const sourceMarkup=(exercise.sources||[]).length?`<div class="exercise-sources"><b>复核依据</b>${exercise.sources.map(source=>`<a href="${source.url}" target="_blank" rel="noopener">${escapeHtml(source.title)} ↗</a>`).join("")}<small>本站说明为中文整理，不是来源原文的逐字翻译。</small></div>`:"";
  const guideMarkup=reviewed?`<div class="reviewed-step-grid">${exercise.steps.map((step,index)=>`<article><b>${String(index+1).padStart(2,"0")}</b><div><small>${index===0?"起始位":index===1?"执行轨迹":"受控回位"}</small><p>${escapeHtml(step)}</p></div></article>`).join("")}</div><div class="guide-columns"><section><h3>做到位的判断</h3><p>${escapeHtml(exercise.standard)}</p><h3>动作提示</h3><ul>${exercise.cues.map(cue=>`<li>${escapeHtml(cue)}</li>`).join("")}</ul></section><section class="guide-warning"><h3>本动作常见错误</h3><ul>${exercise.errors.map(error=>`<li>${escapeHtml(error)}</li>`).join("")}</ul><h3>呼吸</h3><p>${escapeHtml(exercise.breathing)}</p></section></div>${sourceMarkup}`:`<article class="unreviewed-exercise"><b>该动作尚未完成逐项复核</b><p>此前版本错误地套用了“${escapeHtml(exercise.category)}”通用说明。为避免继续误导，当前不展示通用三帧图和注意事项；完成动作轨迹与来源核对后再开放。</p></article>`;
  $("#exerciseDialogBody").innerHTML=`<div class="exercise-guide-meta"><span>${exercise.category}</span><span>${exercise.difficulty}</span><span>${exercise.tool}</span><span>${exercise.primaryMuscles.join("、")}</span>${motion?`<span class="motion-ready">拟真人动画已初审</span>`:reviewed?"<span class='guide-reviewed'>文字已逐项复核 · 动画待制作</span>":"<span class='guide-pending'>待逐项复核</span>"}</div>${motion?motionPlayerMarkup(exercise,motion):""}${guideMarkup}<div class="alternative-row"><b>同模式替代</b>${exercise.alternatives.map(name=>`<button class="secondary-button alternative-exercise" data-exercise-name="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join("")}</div><p class="notice"><b>安全边界</b><span>教学画面用于理解动作阶段，不会判断你的实际姿态。出现锐痛、麻木、眩晕或异常气促时立即停止。</span></p>`;
  $$(".alternative-exercise").forEach(button=>button.onclick=()=>openExerciseGuide(getExerciseByName(button.dataset.exerciseName)));$("#exerciseDialog").showModal();if(motion)startMotionPlayer(exercise,motion);
}
$("#closeExerciseDialog").onclick=()=>{cancelAnimationFrame(motionAnimationFrame);$("#exerciseDialog").close()};
let exerciseLimit=36;
function renderExerciseLibrary(){
  const query=$("#exerciseSearch").value.trim().toLowerCase(),pattern=$("#exercisePattern").value,equipment=$("#exerciseEquipment").value,difficulty=$("#exerciseDifficulty").value;
  const filtered=exerciseLibrary.filter(exercise=>(!query||`${exercise.name}${exercise.category}${exercise.primaryMuscles.join("")}${exercise.tool}`.toLowerCase().includes(query))&&(pattern==="all"||exercise.group===pattern)&&(equipment==="all"||exercise.tool===equipment)&&(difficulty==="all"||exercise.difficulty===difficulty));
  $("#exerciseLibraryGrid").innerHTML=filtered.slice(0,exerciseLimit).map(exercise=>{const reviewed=exercise.reviewStatus==="首批逐项复核",motion=motionExerciseIds.has(exercise.id);return `<button class="exercise-library-card" data-exercise="${exercise.id}"><div class="exercise-review-cover ${motion?"has-motion":reviewed?"reviewed":"pending"}"><b>${motion?"拟真人演示":reviewed?"逐项复核":"待复核"}</b><small>${motion?"动作轨迹已初审":reviewed?"独立文字教程":"不再套用通用教程"}</small>${motion?"<em class='motion-card-badge'>▶ 36 FPS</em>":""}</div><span>${exercise.category}</span><h3>${exercise.name}</h3><p>${exercise.primaryMuscles.join(" · ")}</p><footer><small>${exercise.tool}</small><small>${exercise.difficulty}</small></footer></button>`}).join("")||"<div class='empty-mini'>没有匹配动作，请减少筛选条件。</div>";
  $("#exerciseLoadMore").hidden=exerciseLimit>=filtered.length;$("#exerciseLoadMore").textContent=`显示更多（当前 ${Math.min(exerciseLimit,filtered.length)} / ${filtered.length}）`;
  $$(".exercise-library-card").forEach(card=>card.onclick=()=>openExerciseGuide(exerciseById(card.dataset.exercise)));
}
for(const [group,label] of [...new Map(exerciseLibrary.map(exercise=>[exercise.group,exercise.category]))])$("#exercisePattern").insertAdjacentHTML("beforeend",`<option value="${group}">${label}</option>`);
for(const id of ["exerciseSearch","exercisePattern","exerciseEquipment","exerciseDifficulty"])$(`#${id}`).addEventListener(id==="exerciseSearch"?"input":"change",()=>{exerciseLimit=36;renderExerciseLibrary()});
$("#exerciseLoadMore").onclick=()=>{exerciseLimit+=36;renderExerciseLibrary()};

function allRecipes(){return [...standardRecipes,...state.library.sharedRecipes,...state.customRecipes]}
function selectRecipe(recipe){state.recipeId=recipe.id;state.recipeDraft=structuredClone(recipe);renderRecipeCalculator()}
function recipeOwnerLabel(recipe){if(/^r\d{3}$/.test(recipe.id))return "标准菜谱";if(state.library.sharedRecipes.some(item=>item.id===recipe.id))return "成员共享";return "当前成员"}
function renderRecipeList(){
  const query=$("#recipeSearch").value.trim(),category=$("#recipeCategory").value,available=allRecipes().filter(recipe=>(!query||recipe.name.includes(query))&&(category==="all"||recipe.category===category));
  $("#recipeList").innerHTML=available.map(recipe=>{const nutrition=calculateRecipe(recipe);return `<button class="recipe-list-item ${recipe.id===state.recipeId?"active":""}" data-recipe="${recipe.id}"><div><span>${escapeHtml(recipe.category)}</span><small>${recipeOwnerLabel(recipe)}</small></div><b>${escapeHtml(recipe.name)}</b><p>${nutrition.perServing.kcal} kcal/份 · P ${nutrition.perServing.protein}g</p></button>`}).join("")||"<div class='empty-mini'>没有匹配菜谱</div>";
  $$(".recipe-list-item").forEach(button=>button.onclick=()=>selectRecipe(allRecipes().find(recipe=>recipe.id===button.dataset.recipe)));
}
function recipeNutritionMarkup(recipe){
  const nutrition=calculateRecipe(recipe),confidence=recipe.confidence||"取决于原料";
  return `<div class="recipe-result-main"><span>整道菜</span><strong>${nutrition.total.kcal}</strong><b>kcal</b></div><div class="recipe-result-grid"><span><small>每100克</small><b>${nutrition.per100.kcal} kcal</b></span><span><small>每份</small><b>${nutrition.perServing.kcal} kcal</b></span><span><small>蛋白质/份</small><b>${nutrition.perServing.protein} g</b></span><span><small>脂肪/份</small><b>${nutrition.perServing.fat} g</b></span><span><small>碳水/份</small><b>${nutrition.perServing.carbs} g</b></span><span><small>成品/份</small><b>${nutrition.servingGrams} g</b></span></div><p class="recipe-confidence">数据置信度：${escapeHtml(confidence)}。用油、成品含水量和品牌差异会直接改变结果。</p>`;
}
function renderRecipeEditor(){
  let recipe=state.recipeDraft||allRecipes().find(item=>item.id===state.recipeId)||structuredClone(standardRecipes[0]);state.recipeDraft=recipe;
  const foodOptions=foods.map(food=>`<option value="${food.id}">${escapeHtml(food.name)} · ${food.state}</option>`).join("");
  $("#recipeEditor").innerHTML=`<div class="recipe-editor-head"><div><span class="badge">${recipeOwnerLabel(recipe)}</span><input id="recipeNameInput" value="${escapeHtml(recipe.name)}" maxlength="40" aria-label="菜谱名称"></div><button class="secondary-button" id="newBlankRecipe">新建空白菜谱</button></div><div class="recipe-meta-grid"><label>类别<select id="recipeDraftCategory">${[...new Set([...recipeCategories,"自定义"])].map(category=>`<option ${category===recipe.category?"selected":""}>${category}</option>`).join("")}</select></label><label>成品重量 g<input id="recipeYield" type="number" min="50" max="5000" step="5" value="${recipe.yieldGrams}"></label><label>份数<input id="recipeServings" type="number" min="1" max="20" step="1" value="${recipe.servings||1}"></label></div><div class="recipe-ingredient-head"><h3>原料与克重</h3><button class="text-button" id="addRecipeIngredient">＋ 添加原料</button></div><div class="recipe-ingredients">${recipe.ingredients.map((ingredient,index)=>`<div class="recipe-ingredient-row"><span>${String(index+1).padStart(2,"0")}</span><select class="recipe-food-select" data-index="${index}">${foodOptions.replace(`value="${ingredient.foodId}"`,`value="${ingredient.foodId}" selected`)}</select><label><input class="recipe-grams-input" data-index="${index}" type="number" min="0" max="3000" step="1" value="${ingredient.grams}"><small>克</small></label><button class="icon-button remove-ingredient" data-index="${index}" aria-label="删除原料">×</button></div>`).join("")}</div><div class="recipe-nutrition" id="recipeNutrition">${recipeNutritionMarkup(recipe)}</div><label class="recipe-method-label">做法<textarea id="recipeMethod" rows="3">${escapeHtml(recipe.method||"")}</textarea></label><div class="recipe-save-row"><label><input id="shareRecipe" type="checkbox"> 保存后共享给全部成员</label><div><button class="secondary-button" id="saveRecipe">保存为自定义菜谱</button><button class="primary-button" id="addRecipeToPlan">加入当前饮食日</button></div></div>`;
  const syncDraft=()=>{recipe.name=$("#recipeNameInput").value.trim()||"未命名菜谱";recipe.category=$("#recipeDraftCategory").value;recipe.yieldGrams=Number($("#recipeYield").value)||100;recipe.servings=Number($("#recipeServings").value)||1;recipe.method=$("#recipeMethod").value;$("#recipeNutrition").innerHTML=recipeNutritionMarkup(recipe)};
  $("#recipeNameInput").oninput=syncDraft;$("#recipeDraftCategory").onchange=syncDraft;$("#recipeYield").oninput=syncDraft;$("#recipeServings").oninput=syncDraft;$("#recipeMethod").oninput=syncDraft;
  $$(".recipe-food-select").forEach(select=>select.onchange=()=>{const index=Number(select.dataset.index),food=foods.find(item=>item.id===select.value);recipe.ingredients[index].foodId=food.id;recipe.ingredients[index].foodName=food.name;syncDraft()});
  $$(".recipe-grams-input").forEach(input=>input.oninput=()=>{recipe.ingredients[Number(input.dataset.index)].grams=Number(input.value)||0;syncDraft()});
  $$(".remove-ingredient").forEach(button=>button.onclick=()=>{recipe.ingredients.splice(Number(button.dataset.index),1);renderRecipeEditor()});
  $("#addRecipeIngredient").onclick=()=>{const food=foods[0];recipe.ingredients.push({foodId:food.id,foodName:food.name,grams:100});renderRecipeEditor()};
  $("#newBlankRecipe").onclick=()=>{const food=foods[0];state.recipeDraft={id:createId("recipe"),name:"我的自定义菜谱",category:"自定义",ingredients:[{foodId:food.id,foodName:food.name,grams:100}],yieldGrams:100,servings:1,method:"",source:"用户自定义原料与克重",verifiedOn:new Date().toISOString().slice(0,10),confidence:"取决于称量准确度",reviewStatus:"用户自定义"};state.recipeId=state.recipeDraft.id;renderRecipeCalculator()};
  $("#saveRecipe").onclick=()=>{syncDraft();if(!recipe.ingredients.length){toast("至少添加一种原料");return}const saved=structuredClone(recipe);if(/^r\d{3}$/.test(saved.id))saved.id=createId("recipe");saved.source="用户自定义原料与克重";saved.verifiedOn=new Date().toISOString().slice(0,10);saved.confidence="取决于称量准确度";const shared=$("#shareRecipe").checked,target=shared?state.library.sharedRecipes:state.customRecipes;const index=target.findIndex(item=>item.id===saved.id);if(index>=0)target[index]=saved;else target.push(saved);state.recipeId=saved.id;state.recipeDraft=structuredClone(saved);persistLibrary();renderRecipeCalculator();toast(shared?"菜谱已保存并共享给全部成员":"菜谱已保存到当前成员")};
  $("#addRecipeToPlan").onclick=()=>{syncDraft();const plan=currentPlan();if(!plan){toast("请先为当前成员生成方案");return}if(!recipeAllowed(recipe,state.profile||{})){toast("该菜谱与当前成员的忌口、饮食模式或过敏原冲突");return}const day=plan.meals.days[state.day]||plan.meals.days[0],meal=day.meals.find(item=>item.name==="午餐")||day.meals[1],scale=1/Math.max(1,recipe.servings||1);meal.items=recipe.ingredients.map(ingredient=>({foodId:ingredient.foodId,food:foods.find(food=>food.id===ingredient.foodId),grams:Math.round(ingredient.grams*scale)})).filter(item=>item.food);meal.recipeName=recipe.name;meal.method=recipe.method;meal.total=calculateMeal(meal.items);day.total=calculateMeal(day.meals.flatMap(item=>item.items));write(KEYS.plans,state.plans);renderMeals(plan);toast(`已加入第${day.day}天午餐，全天营养已重算`)};
}
function renderRecipeCalculator(){
  $("#recipeCount").textContent=standardRecipes.length+diningItemCount;const allCategories=[...new Set([...recipeCategories,...allRecipes().map(recipe=>recipe.category)])],current=$("#recipeCategory").value||"all";$("#recipeCategory").innerHTML=`<option value="all">全部类别</option>${allCategories.map(category=>`<option ${category===current?"selected":""}>${escapeHtml(category)}</option>`).join("")}`;
  if(!state.recipeDraft)state.recipeDraft=structuredClone(allRecipes().find(recipe=>recipe.id===state.recipeId)||standardRecipes[0]);renderRecipeList();renderRecipeEditor();
}
$("#recipeSearch").oninput=renderRecipeList;$("#recipeCategory").onchange=renderRecipeList;

function activeDiningItem(){return diningItems.find(item=>item.id===state.diningId)||diningItems[0]}
function diningFilters(){
  const query=$("#diningSearch").value.trim().toLowerCase(),group=$("#diningGroup").value,brand=$("#diningBrand").value;
  return diningItems.filter(item=>(!query||`${item.brand}${item.name}`.toLowerCase().includes(query))&&(group==="all"||item.group===group)&&(brand==="all"||item.brand===brand));
}
function renderDiningList(){
  const available=diningFilters();if(!available.some(item=>item.id===state.diningId)&&available.length)state.diningId=available[0].id;
  $("#diningList").innerHTML=available.slice(0,160).map(item=>`<button class="${item.id===state.diningId?"active":""}" data-dining="${item.id}"><span>${escapeHtml(item.brand)}</span><b>${escapeHtml(item.name)}</b><small>${item.kcal} kcal/份 · ${item.status}</small></button>`).join("")||"<div class='empty-mini'>没有匹配的外食条目</div>";
  $$("#diningList [data-dining]").forEach(button=>button.onclick=()=>{state.diningId=button.dataset.dining;state.diningOptions={};renderDiningList();renderDiningDetail()});
}
function renderDiningDetail(){
  const item=activeDiningItem(),calculated=calculateDiningItem(item,state.diningOptions),hasAllergens=(state.profile?.allergens||[]).length>0;
  const options=item.options?`<div class="dining-option-grid"><label>杯型<select id="diningSize">${item.options.sizes.map(([label])=>`<option ${label===(state.diningOptions.size||"中杯")?"selected":""}>${label}</option>`).join("")}</select></label><label>糖度<select id="diningSugar">${item.options.sugars.map(([label])=>`<option ${label===(state.diningOptions.sugar||"不另外加糖")?"selected":""}>${label}</option>`).join("")}</select></label><label>加料<select id="diningTopping">${item.options.toppings.map(([label])=>`<option ${label===(state.diningOptions.topping||"不加料")?"selected":""}>${label}</option>`).join("")}</select></label></div>`:"";
  $("#diningDetail").innerHTML=`<header><div><span class="badge">${escapeHtml(item.group)} · ${escapeHtml(item.brand)}</span><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(calculated.selectedServing)}</p></div><div class="dining-kcal"><strong>${calculated.calculatedKcal}</strong><span>kcal / 份</span></div></header>${options}<div class="dining-macros"><span><small>蛋白质</small><b>${calculated.calculatedProtein??item.protein} g</b></span><span><small>脂肪</small><b>${calculated.calculatedFat??item.fat} g</b></span><span><small>碳水</small><b>${calculated.calculatedCarbs??item.carbs} g</b></span><span><small>估算区间</small><b>${calculated.calculatedRange[0]}～${calculated.calculatedRange[1]} kcal</b></span></div><article class="data-confidence"><b>${item.status} · 置信度${item.confidence}</b><p>${escapeHtml(item.source)}</p><small>核验日期：${item.verifiedOn}。同品牌不同门店、份量、酱料和季节配方可能造成差异。</small>${item.sourceUrl?`<a href="${item.sourceUrl}" target="_blank" rel="noopener">打开品牌官方入口 ↗</a>`:""}</article>${hasAllergens?`<label class="allergen-ack"><input type="checkbox" id="diningAllergenAck"> 我理解当前外食条目没有完整交叉接触信息，将自行向门店确认过敏原</label>`:""}<div class="dining-actions"><button class="primary-button" id="addDiningToPlan">加入当前饮食日</button><button class="secondary-button" id="copyDiningValue">复制热量信息</button></div>`;
  for(const [id,key] of [["diningSize","size"],["diningSugar","sugar"],["diningTopping","topping"]])if($(`#${id}`))$(`#${id}`).onchange=event=>{state.diningOptions[key]=event.target.value;renderDiningDetail()};
  $("#copyDiningValue").onclick=async()=>{
    const text=`${item.brand} ${item.name}：${calculated.calculatedKcal} kcal/份（${calculated.selectedServing}，${item.status}）`;
    try{
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
      else{const area=document.createElement("textarea");area.value=text;area.style.position="fixed";area.style.opacity="0";document.body.append(area);area.select();document.execCommand("copy");area.remove()}
      toast("热量信息已复制");
    }catch{toast("浏览器禁止自动复制，请手动记录当前热量")}
  };
  $("#addDiningToPlan").onclick=()=>{
    const plan=currentPlan();if(!plan){toast("请先为当前成员生成方案");return}
    if(hasAllergens&&!$("#diningAllergenAck")?.checked){toast("请先确认外食过敏原提示");return}
    const day=plan.meals.days[state.day]||plan.meals.days[0],meal=day.meals[item.type==="drinks"?3:1];
    const food={id:`dining-${item.id}`,name:`${item.brand} · ${item.name}`,category:"外食主菜",state:"每份",kcal:calculated.calculatedKcal,protein:calculated.calculatedProtein??item.protein,fat:calculated.calculatedFat??item.fat,carbs:calculated.calculatedCarbs??item.carbs,fiber:0,allergens:[],tags:["external"],source:item.source,verifiedOn:item.verifiedOn,reviewStatus:item.status};
    meal.items=[{foodId:food.id,food,grams:100}];meal.recipeName=`外食：${item.brand} ${item.name}`;meal.method=`按购买一份记录；${calculated.selectedServing}。估算区间 ${calculated.calculatedRange[0]}～${calculated.calculatedRange[1]} kcal。`;
    meal.total=calculateMeal(meal.items);day.total=calculateMeal(day.meals.flatMap(entry=>entry.items));write(KEYS.plans,state.plans);renderMeals(plan);toast(`已加入第${day.day}天${meal.name}`);
  };
}
function renderDiningCalculator(){
  $("#diningBrandCount").textContent=diningBrandCount;$("#diningItemCount").textContent=diningItemCount;
  const group=$("#diningGroup").value||"all",brand=$("#diningBrand").value||"all";
  $("#diningGroup").innerHTML=`<option value="all">全部餐饮类别</option>${[...new Set(diningBrands.map(item=>item.group))].map(value=>`<option ${value===group?"selected":""}>${value}</option>`).join("")}`;
  $("#diningBrand").innerHTML=`<option value="all">全部品牌</option>${diningBrands.map(item=>`<option ${item.name===brand?"selected":""}>${item.name}</option>`).join("")}`;
  renderDiningList();renderDiningDetail();
}
for(const id of ["diningSearch","diningGroup","diningBrand"])$(`#${id}`).addEventListener(id==="diningSearch"?"input":"change",()=>{renderDiningList();renderDiningDetail()});
$$("[data-calculator-tab]").forEach(button=>button.onclick=()=>{$$("[data-calculator-tab]").forEach(item=>item.classList.toggle("active",item===button));$("#recipeCalculatorPanel").classList.toggle("active",button.dataset.calculatorTab==="recipe");$("#diningCalculatorPanel").classList.toggle("active",button.dataset.calculatorTab==="dining")});

function renderEvidence(){$("#referenceList").innerHTML=references.map((r,i)=>`<article class="reference"><div class="reference-index">${String(i+1).padStart(2,"0")}</div><div><h3>${r.title}</h3><p>${r.org} · ${r.note}</p></div><a href="${r.url}" target="_blank" rel="noopener">查看来源 ↗</a></article>`).join("");$("#foodCount").textContent=foods.length;$("#mealCount").textContent=`${mealTemplates.length}+${standardRecipes.length}`;$("#dataDate").textContent=dataMeta.verifiedOn}
function renderVideos(filter="all"){
  const filtered=videos.filter(v=>filter==="all"||v.platform===filter);
  $("#videoGrid").innerHTML=filtered.map((v,i)=>{const cover=v.provider==="youtube"?`<img src="https://i.ytimg.com/vi/${v.embedId}/hqdefault.jpg" alt="${v.title}视频封面" loading="lazy">`:`<div class="bili-cover"><b>哔哩哔哩</b><strong>${v.title}</strong><small>${v.author}</small></div>`;return `<article class="video-card-v2"><div class="video-media"><button class="video-poster ${v.provider}" data-video="${i}" aria-label="在页面内播放：${v.title}">${cover}<span>▶</span><small>${v.platform}</small></button></div><div class="video-body"><div class="video-kicker"><span>${v.platform}</span><em>${v.status}</em></div><h3>${v.title}</h3><p><b>${v.author}</b> · ${v.summary}</p><div class="video-metrics"><span>▶ ${v.views}</span><span>♥ ${v.likes}</span></div><footer><small>数据查询：${v.checkedOn}</small><a href="${v.url}" target="_blank" rel="noopener">来源页 ↗</a></footer></div></article>`}).join("");
  $$('.video-poster').forEach(button=>button.onclick=()=>{const video=filtered[Number(button.dataset.video)],iframe=document.createElement("iframe");iframe.className="video-frame";iframe.src=video.provider==="youtube"?`https://www.youtube-nocookie.com/embed/${video.embedId}?autoplay=1&rel=0`:`https://player.bilibili.com/player.html?bvid=${video.embedId}&high_quality=1&danmaku=0&autoplay=1`;iframe.title=video.title;iframe.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";iframe.allowFullscreen=true;iframe.referrerPolicy="strict-origin-when-cross-origin";button.replaceWith(iframe)});
}
$("#videoPlatform").onchange=e=>renderVideos(e.target.value);

function exportPayload(){return {schemaVersion:4,kind:"member-library",exportedAt:new Date().toISOString(),library:structuredClone(state.library)}}
function exportCurrentMemberPayload(){return {schemaVersion:4,kind:"single-member",exportedAt:new Date().toISOString(),member:structuredClone(activeMember())}}
function downloadJson(payload,filename){const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url)}
const dateStamp=()=>new Date().toISOString().slice(0,10);
$("#exportData").onclick=()=>downloadJson(exportCurrentMemberPayload(),`衡燃-${activeMember().name}-成员数据-${dateStamp()}.json`);
$("#downloadBackup").onclick=()=>downloadJson(exportPayload(),`衡燃-完整成员资料库-${dateStamp()}.json`);
$("#downloadCurrentMember").onclick=()=>downloadJson(exportCurrentMemberPayload(),`衡燃-${activeMember().name}-成员数据-${dateStamp()}.json`);
$("#openSettings").onclick=()=>$("#syncDialog").showModal();
$("#importBackup").onchange=async event=>{try{
  const data=JSON.parse(await event.target.files[0].text());
  if(data.schemaVersion>=4&&data.kind==="member-library"&&Array.isArray(data.library?.members)&&data.library.members.length){state.library=data.library;persistLibrary();location.reload();return}
  if(data.schemaVersion>=4&&data.kind==="single-member"&&data.member){const imported=structuredClone(data.member);imported.id=createId("member");imported.name=`${imported.name||"导入成员"}（导入）`;state.library.members.push(imported);state.library.activeMemberId=imported.id;persistLibrary();location.reload();return}
  if(data.schemaVersion&&Array.isArray(data.plans)&&Array.isArray(data.records)){const imported=createMember("旧版导入成员",{profile:data.profile,plans:data.plans,records:data.records});state.library.members.push(imported);state.library.activeMemberId=imported.id;persistLibrary();location.reload();return}
  throw new Error("备份格式不正确或不受支持");
}catch(error){toast(error.message)}finally{event.target.value=""}};
$("#deleteLocal").onclick=()=>{if(confirm("这会删除本浏览器中的整个成员资料库、所有方案、记录和自定义菜谱，且不可撤销。确定继续？")){for(const key of Object.values(KEYS))localStorage.removeItem(key);location.reload()}};

function finishPendingNavigation(){const target=pendingNavigation,memberTarget=pendingMemberId;pendingNavigation=null;pendingMemberId=null;if(memberTarget){performMemberSwitch(memberTarget);return}if(target){if(target==="plan")ensurePlan();showPage(target)}}
$("#saveAndLeave").onclick=()=>{const active=$(".page.active")?.id,ok=active==="profile"?saveProfileAndGenerate({navigate:false}):active==="progress"?saveProgressRecord():true;if(ok){$("#unsavedDialog").close();finishPendingNavigation()}};
$("#discardAndLeave").onclick=()=>{const active=$(".page.active")?.id;if(active==="profile"){$("#profileForm").reset();fillForm(state.profile);setProfileDirty(false);refreshCompletion()}else if(active==="progress"){$("#progressForm").reset();$("#progressForm").elements.date.value=new Date().toISOString().slice(0,10);setProgressDirty(false)}$("#unsavedDialog").close();finishPendingNavigation()};
$("#cancelLeave").onclick=()=>{pendingNavigation=null;pendingMemberId=null;$("#unsavedDialog").close()};
window.addEventListener("beforeunload",event=>{if(profileDirty||progressDirty){event.preventDefault();event.returnValue=""}});
document.addEventListener("keydown",event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="s"){event.preventDefault();const active=$(".page.active")?.id;if(active==="profile")saveProfileAndGenerate({navigate:false});else if(active==="progress")saveProgressRecord()}});

const syncKeys={id:"hengran_sync_id",revision:"hengran_sync_revision",code:"hengran_recovery_code"};
function syncCredentials(){return {syncId:$("#syncIdInput").value.trim(),code:$("#recoveryInput").value.trim()||sessionStorage.getItem(syncKeys.code)||""}}
function setSyncStatus(text,error=false){const el=$("#syncStatus");el.textContent=text;el.style.color=error?"var(--danger)":"var(--green)"}
async function createCloud(){try{setSyncStatus("正在本地加密…");const code=createRecoveryCode(),syncId=crypto.randomUUID(),token=await authToken(code),bundle=await encryptPayload(exportPayload(),code);const result=await syncRequest("create",{syncId,authToken:token,bundle});localStorage.setItem(syncKeys.id,syncId);localStorage.setItem(syncKeys.revision,String(result.revision));sessionStorage.setItem(syncKeys.code,code);$("#syncIdInput").value=syncId;$("#recoveryInput").value=code;const blob=new Blob([`衡燃匿名同步恢复信息\n同步ID：${syncId}\n恢复码：${code}\n\n请离线保管。遗失后无法恢复。`],{type:"text/plain;charset=utf-8"}),a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download="衡燃恢复码.txt";a.click();URL.revokeObjectURL(url);setSyncStatus("云端档案已创建，恢复码文件已下载。") }catch(e){setSyncStatus(e.message,true)}}
async function pushCloud(){try{const {syncId,code}=syncCredentials();if(!syncId||!code)throw new Error("请填写同步ID和恢复码");setSyncStatus("正在加密并上传…");const token=await authToken(code),bundle=await encryptPayload(exportPayload(),code),revision=Number(localStorage.getItem(syncKeys.revision)||0);const result=await syncRequest("update",{syncId,authToken:token,revision,bundle});localStorage.setItem(syncKeys.id,syncId);localStorage.setItem(syncKeys.revision,String(result.revision));sessionStorage.setItem(syncKeys.code,code);setSyncStatus(`上传成功，修订号 ${result.revision}`)}catch(e){setSyncStatus(e.message,true)}}
async function restoreCloud(){try{const {syncId,code}=syncCredentials();if(!syncId||!code)throw new Error("请填写同步ID和恢复码");setSyncStatus("正在下载并解密…");const token=await authToken(code),result=await syncRequest("read",{syncId,authToken:token}),data=await decryptPayload(result.bundle,code);if(data.schemaVersion>=4&&data.kind==="member-library"&&Array.isArray(data.library?.members)){state.library=data.library;persistLibrary()}else if(data.schemaVersion&&Array.isArray(data.plans)){const member=createMember("云端旧版成员",{profile:data.profile,plans:data.plans,records:data.records||[]});state.library={schemaVersion:4,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),activeMemberId:member.id,members:[member],sharedRecipes:[],migration:{from:"云端旧单人版",at:new Date().toISOString()}};persistLibrary()}else throw new Error("解密成功，但数据结构不受支持");localStorage.setItem(syncKeys.id,syncId);localStorage.setItem(syncKeys.revision,String(result.revision));sessionStorage.setItem(syncKeys.code,code);setSyncStatus("整个成员资料库恢复成功，即将刷新页面");setTimeout(()=>location.reload(),700)}catch(e){setSyncStatus(`恢复失败：${e.message}`,true)}}
async function deleteCloud(){try{const {syncId,code}=syncCredentials();if(!syncId||!code)throw new Error("请填写同步ID和恢复码");if(!confirm("确定永久删除云端密文？本地数据不会同时删除。"))return;const token=await authToken(code);await syncRequest("delete",{syncId,authToken:token});localStorage.removeItem(syncKeys.id);localStorage.removeItem(syncKeys.revision);sessionStorage.removeItem(syncKeys.code);setSyncStatus("云端档案已删除") }catch(e){setSyncStatus(e.message,true)}}
$("#createCloud").onclick=createCloud;$("#pushCloud").onclick=pushCloud;$("#restoreCloud").onclick=restoreCloud;$("#deleteCloud").onclick=deleteCloud;

function renderAll(){renderMemberControls();renderOverview();renderPlan();renderRecords();renderTrend();renderRecipeCalculator();renderDiningCalculator();renderExerciseLibrary();refreshCompletion()}
persistLibrary();fillForm(state.profile);renderSpecificDates();setProfileDirty(false);$("#progressForm").elements.date.value=new Date().toISOString().slice(0,10);setProgressDirty(false);renderEvidence();renderVideos();$("#exerciseCount").textContent=exerciseLibraryCount;if(state.profile&&!currentPlan())ensurePlan();else if(upgradeLegacyPlan())toast("旧方案已保留，并自动升级为新的渐进方案");renderAll();
$("#storageMode").textContent=syncConfigured()?"可用加密同步":"仅本地存储";$(".online-dot").classList.toggle("ready",syncConfigured());
$("#syncUnavailable").hidden=syncConfigured();$("#syncOnline").hidden=!syncConfigured();$("#syncIdInput").value=localStorage.getItem(syncKeys.id)||"";
const initial=location.hash.slice(1);if(initial&&document.getElementById(initial)?.classList.contains("page"))showPage(initial);
const requestedExercise=new URLSearchParams(location.search).get("exercise");
if(requestedExercise){
  const exercise=exerciseById(requestedExercise);
  if(exercise){showPage("exercises");openExerciseGuide(exercise)}
}
