import {foods, mealTemplates} from "./catalog.js";

export const round=(n,d=0)=>Number(Number(n).toFixed(d));
export function bmi(weight,height){return round(weight/((height/100)**2),1)}
export function bmr(profile){
  const base=10*profile.weight+6.25*profile.height-5*profile.age;
  return Math.round(base+(profile.sex==="male"?5:-161));
}
export function referenceWeight(profile){
  const estimatedLean=profile.bodyFat?profile.weight*(1-profile.bodyFat/100):null;
  const bmi25=25*((profile.height/100)**2);
  return round(estimatedLean?Math.min(profile.weight,Math.max(estimatedLean/.78,bmi25)):Math.min(profile.weight,bmi25),1);
}
export function calculateTargets(profile){
  const resting=bmr(profile),tdee=Math.round(resting*Number(profile.activity));
  const deficit=profile.goal==="faster"?.22:profile.goal==="recomp"?.1:.16;
  const calories=Math.max(profile.sex==="male"?1500:1200,Math.round((tdee*(1-deficit))/25)*25);
  const ref=referenceWeight(profile);
  const protein=Math.round(ref*(profile.experience==="trained"?2:1.7));
  const fat=Math.max(Math.round(calories*.25/9),Math.round(ref*.65));
  const carbs=Math.max(80,Math.round((calories-protein*4-fat*9)/4));
  const hrMax=Math.round(208-.7*profile.age);
  const moderate=profile.restingHr
    ? [Math.round((hrMax-profile.restingHr)*.4+profile.restingHr),Math.round((hrMax-profile.restingHr)*.6+profile.restingHr)]
    : [Math.round(hrMax*.55),Math.round(hrMax*.7)];
  return {resting,tdee,calories,protein,fat,carbs,referenceWeight:ref,bmi:bmi(profile.weight,profile.height),moderate,deficit};
}

const exercises={
  squat:[
    {name:"高脚杯深蹲",equipment:["home","gym"],limits:["knee"],pattern:"蹲"},{name:"箱式徒手深蹲",equipment:["none","home","gym"],limits:[],pattern:"蹲"},{name:"腿举",equipment:["gym"],limits:["knee"],pattern:"蹲"},{name:"史密斯箱式深蹲",equipment:["gym"],limits:["knee"],pattern:"蹲"},{name:"哈克深蹲",equipment:["gym"],limits:["knee"],pattern:"蹲"},{name:"哑铃相扑深蹲",equipment:["home","gym"],limits:["knee"],pattern:"蹲"},{name:"坐站训练",equipment:["none","home","gym"],limits:[],pattern:"蹲"}],
  hinge:[
    {name:"哑铃罗马尼亚硬拉",equipment:["home","gym"],limits:["back"],pattern:"髋铰链"},{name:"臀桥",equipment:["none","home","gym"],limits:[],pattern:"髋铰链"},{name:"器械腿弯举",equipment:["gym"],limits:[],pattern:"髋铰链"},{name:"杠铃罗马尼亚硬拉",equipment:["gym"],limits:["back"],pattern:"髋铰链"},{name:"绳索拉臀",equipment:["gym"],limits:["back"],pattern:"髋铰链"},{name:"哑铃臀推",equipment:["home","gym"],limits:[],pattern:"髋铰链"},{name:"健身球腿弯举",equipment:["home","gym"],limits:[],pattern:"髋铰链"}],
  push:[
    {name:"上斜俯卧撑",equipment:["none","home","gym"],limits:["shoulder"],pattern:"水平推"},{name:"哑铃卧推",equipment:["home","gym"],limits:["shoulder"],pattern:"水平推"},{name:"器械推胸",equipment:["gym"],limits:["shoulder"],pattern:"水平推"},{name:"跪姿俯卧撑",equipment:["none","home","gym"],limits:["shoulder"],pattern:"水平推"},{name:"地板哑铃卧推",equipment:["home","gym"],limits:["shoulder"],pattern:"水平推"},{name:"史密斯卧推",equipment:["gym"],limits:["shoulder"],pattern:"水平推"},{name:"绳索夹胸",equipment:["gym"],limits:["shoulder"],pattern:"水平推"}],
  pull:[
    {name:"弹力带划船",equipment:["home","gym"],limits:[],pattern:"水平拉"},{name:"单臂哑铃划船",equipment:["home","gym"],limits:["back"],pattern:"水平拉"},{name:"坐姿划船",equipment:["gym"],limits:[],pattern:"水平拉"},{name:"毛巾等长划船",equipment:["none"],limits:[],pattern:"水平拉"},{name:"胸托哑铃划船",equipment:["home","gym"],limits:[],pattern:"水平拉"},{name:"器械高位划船",equipment:["gym"],limits:[],pattern:"水平拉"},{name:"反向飞鸟",equipment:["home","gym"],limits:["shoulder"],pattern:"水平拉"}],
  vertical:[
    {name:"半跪姿哑铃推举",equipment:["home","gym"],limits:["shoulder","back"],pattern:"垂直推"},{name:"高位下拉",equipment:["gym"],limits:["shoulder"],pattern:"垂直拉"},{name:"弹力带下拉",equipment:["home"],limits:["shoulder"],pattern:"垂直拉"},{name:"墙壁滑动",equipment:["none"],limits:["shoulder"],pattern:"肩胛控制"},{name:"中立握下拉",equipment:["gym"],limits:["shoulder"],pattern:"垂直拉"},{name:"坐姿哑铃推举",equipment:["home","gym"],limits:["shoulder","back"],pattern:"垂直推"},{name:"地雷管推举",equipment:["gym"],limits:["shoulder"],pattern:"垂直推"}],
  single:[
    {name:"扶墙反向箭步蹲",equipment:["none","home","gym"],limits:["knee"],pattern:"单腿"},{name:"低台阶踏步",equipment:["none","home","gym"],limits:["knee"],pattern:"单腿"},{name:"单腿臀桥",equipment:["none","home","gym"],limits:[],pattern:"单腿"},{name:"分腿蹲扶墙版",equipment:["none","home","gym"],limits:["knee"],pattern:"单腿"},{name:"侧向台阶踏步",equipment:["home","gym"],limits:["knee"],pattern:"单腿"},{name:"单腿腿举",equipment:["gym"],limits:["knee"],pattern:"单腿"}],
  core:[
    {name:"死虫",equipment:["none","home","gym"],limits:[],pattern:"核心"},{name:"鸟狗",equipment:["none","home","gym"],limits:[],pattern:"核心"},{name:"Pallof抗旋转",equipment:["home","gym"],limits:[],pattern:"核心"},{name:"侧桥",equipment:["none","home","gym"],limits:["shoulder"],pattern:"核心"},{name:"前臂平板支撑",equipment:["none","home","gym"],limits:["shoulder"],pattern:"核心"},{name:"跪姿绳索卷腹",equipment:["gym"],limits:["back"],pattern:"核心"},{name:"仰卧交替抬腿",equipment:["none","home","gym"],limits:["back"],pattern:"核心"}],
  carry:[
    {name:"农夫行走",equipment:["home","gym"],limits:[],pattern:"负重行走"},{name:"原地高抬腿慢走",equipment:["none"],limits:["knee"],pattern:"行走"},{name:"跑步机坡度走",equipment:["gym"],limits:[],pattern:"行走"},{name:"单侧提重行走",equipment:["home","gym"],limits:[],pattern:"负重行走"},{name:"雪橇推行",equipment:["gym"],limits:["knee"],pattern:"负重行走"},{name:"低台阶连续踏步",equipment:["home","gym"],limits:["knee"],pattern:"行走"}]
};
export const exerciseCount=Object.values(exercises).flat().length;

function pickExercise(group,profile,index=0){
  const limits=profile.limits||[];
  const valid=exercises[group].filter(x=>x.equipment.includes(profile.equipment)&&!x.limits.some(l=>limits.includes(l))&&!(profile.dislikes||[]).some(d=>d==="jump"&&x.name.includes("跳")));
  return valid[index%valid.length]||exercises[group].find(x=>x.equipment.includes(profile.equipment))||exercises[group][0];
}
function strengthSession(profile,label,offset=0){
  const count=Number(profile.minutes)>=60?6:Number(profile.minutes)>=45?5:4;
  const patterns=label.includes("上肢")?["push","pull","vertical","pull","core","carry"]:label.includes("下肢")?["squat","hinge","single","hinge","core","carry"]:["squat","push","hinge","pull","core","carry"];
  return {type:"力量",label,exercises:patterns.slice(0,count).map((p,i)=>({ ...pickExercise(p,profile,i+offset),sets:profile.experience==="new"?2:3,reps:i===4?"8～12/侧":"8～12",rir:profile.experience==="trained"?"2":"2～3",rest:i<4?"75～120秒":"45～75秒"})),cardio:{mode:getCardio(profile),minutes:Number(profile.minutes)>=60?15:10,intensity:"能说完整短句；参考心率仅作辅助"}};
}
function getCardio(profile){if((profile.limits||[]).includes("knee"))return profile.equipment==="gym"?"椭圆机或单车":"平地快走";if((profile.dislikes||[]).includes("run"))return"快走或单车";return profile.equipment==="gym"?"坡度走、单车或椭圆机":"户外快走"}
export function generateTraining(profile){
  const days=Number(profile.days);let base=[];
  if(days<=3) base=Array.from({length:days},(_,i)=>strengthSession(profile,`全身训练 ${String.fromCharCode(65+i)}`,i));
  else if(days===4) base=[strengthSession(profile,"上肢 A"),strengthSession(profile,"下肢 A",1),strengthSession(profile,"上肢 B",2),strengthSession(profile,"下肢 B",3)];
  else {base=[strengthSession(profile,"全身 A"),strengthSession(profile,"全身 B",1),strengthSession(profile,"全身 C",2)];while(base.length<days)base.push({type:base.length===days-1?"恢复":"有氧",label:base.length===days-1?"恢复与活动度":"低冲击有氧",cardio:{mode:getCardio(profile),minutes:Math.min(45,Number(profile.minutes)),intensity:"中等强度谈话测试"},exercises:[]})}
  const weekRules=[
    {week:1,focus:"建立基线",change:"基线周",instruction:"选择能稳定完成且保留2～3次余力的负荷；记录每组实际次数、负荷和完成感受。"},
    {week:2,focus:"增加完成量",change:"每组 +1次 · 有氧 +5分钟",instruction:"动作质量不变时每组增加1次；到不了目标就维持，不强行加量。"},
    {week:3,focus:"渐进负荷",change:"主动作加重2.5%～5% · RIR 1～2",instruction:"已连续达到次数上限的动作增加约2.5%～5%负荷；未达上限的动作继续用原重量。"},
    {week:4,focus:"降低疲劳并复测",change:"组数约 -30% · 有氧 -5分钟",instruction:"减少力量组数并保留3～4次余力；周末复测腰围、平均体重和同动作表现。"}
  ];
  const progressSession=(session,rule)=>{
    const next=structuredClone(session);
    next.week=rule.week;
    next.exercises=(next.exercises||[]).map((e,i)=>{
      if(rule.week===2)return {...e,reps:e.reps.includes("/侧")?"9～13/侧":"9～13",rir:"2"};
      if(rule.week===3)return {...e,reps:i<4?"6～10":e.reps,rir:"1～2",loadCue:"达到上周上限才加重2.5%～5%"};
      if(rule.week===4)return {...e,sets:Math.max(1,Math.floor(e.sets*.7)),reps:e.reps.includes("/侧")?"8～10/侧":"8～10",rir:"3～4",loadCue:"使用第3周约85%～90%的负荷"};
      return {...e,loadCue:"先记录可重复的基线负荷"};
    });
    if(next.cardio){const baseMinutes=next.cardio.minutes;next.cardio.minutes=rule.week===2?baseMinutes+5:rule.week===3?baseMinutes+5:rule.week===4?Math.max(10,baseMinutes-5):baseMinutes;next.cardio.intensity=rule.week===3?"中等偏上：只能说短句，但不追求冲刺":rule.week===4?"轻到中等：可正常交谈，主动恢复":next.cardio.intensity;}
    next.estimatedMinutes=Math.min(Number(profile.minutes),Math.round((next.exercises?.length||0)*6+(next.cardio?.minutes||0)));
    return next;
  };
  const weeks=weekRules.map(rule=>({...rule,sessions:base.map(s=>progressSession(s,rule))}));
  return {structure:days<=3?"全身训练":days===4?"上下肢拆分":"3次力量＋有氧/恢复",weeks,exerciseDatabaseSize:exerciseCount};
}

function allowedFood(food,profile){
  const allergens=profile.allergens||[];
  if(food.allergens.some(a=>allergens.includes(a)))return false;
  if(profile.diet==="vegan"&&!food.tags.includes("vegan"))return false;
  if(profile.diet==="vegetarian"&&!food.tags.includes("vegetarian"))return false;
  if(profile.diet==="no-pork"&&(food.tags.includes("pork")||food.name.includes("猪")||food.name.includes("肉包")))return false;
  const excluded=(profile.excludedFoods||"").split(/[，,、]/).map(s=>s.trim()).filter(Boolean);
  return !excluded.some(x=>food.name.includes(x));
}
export function filterFoods(profile){return foods.filter(f=>allowedFood(f,profile))}
function foodByCategory(allowed,categories,index){const list=allowed.filter(f=>categories.includes(f.category));return list[index%Math.max(1,list.length)]}
function item(food,grams){return {foodId:food.id,grams,food}}
function mealTotal(items){return items.reduce((a,x)=>{const ratio=x.grams/100;for(const k of ["kcal","protein","fat","carbs","fiber"])a[k]+=x.food[k]*ratio;return a},{kcal:0,protein:0,fat:0,carbs:0,fiber:0})}
export function calculateMeal(items){const total=mealTotal(items);return Object.fromEntries(Object.entries(total).map(([k,v])=>[k,round(v,1)]))}
function calibrateDay(meals,targets){
  const all=()=>meals.flatMap(m=>m.items),total=()=>calculateMeal(all());
  const tune=(nutrient,target,categories)=>{
    const candidates=all().filter(x=>categories.includes(x.food.category));const contribution=candidates.reduce((s,x)=>s+x.food[nutrient]*x.grams/100,0);const other=total()[nutrient]-contribution;
    if(contribution<=0)return;const factor=Math.max(.45,Math.min(2.2,(target-other)/contribution));for(const x of candidates)x.grams=Math.max(20,Math.round(x.grams*factor/5)*5);
  };
  tune("protein",targets.protein,["禽肉","畜肉","鱼类","虾贝","蛋类","豆制品","豆类","便捷蛋白","奶类"]);
  tune("carbs",targets.carbs,["米饭杂粮","面食","薯类","全谷早餐","常见早餐"]);
  const missingFat=targets.fat-total().fat;if(missingFat>2){const oil=foods.find(f=>f.name==="橄榄油");meals[1].items.push(item(oil,Math.max(2,Math.round(missingFat))))}
  // 油脂补足后用主食微调总热量；目标宏量按Atwater系数本身与热量目标相近。
  const delta=targets.calories-total().kcal,staples=all().filter(x=>["米饭杂粮","面食","薯类","全谷早餐","常见早餐"].includes(x.food.category));
  if(Math.abs(delta)>20&&staples.length){const each=delta/staples.length;for(const x of staples)x.grams=Math.max(20,Math.round((x.grams+each/(x.food.kcal/100))/5)*5)}
  for(const meal of meals)meal.total=calculateMeal(meal.items);return {meals,total:calculateMeal(all())};
}
export function generateMeals(profile,targets,variant=0){
  const allowed=filterFoods(profile),conflicts=[];
  const pools={staple:["米饭杂粮","面食","薯类","全谷早餐"],protein:["禽肉","畜肉","鱼类","虾贝","蛋类","豆制品","豆类","便捷蛋白"],veg:["叶菜","瓜茄菌菇"],fruit:["水果"],breakfast:["全谷早餐","常见早餐","米饭杂粮","薯类"]};
  for(const [key,cats] of Object.entries(pools))if(!allowed.some(f=>cats.includes(f.category)))conflicts.push(`没有可用的${key}食物：可能与过敏或饮食模式冲突`);
  if(conflicts.length)return {days:[],conflicts,allowedCount:allowed.length};
  const distribution={早餐:.25,午餐:.35,晚餐:.32,加餐:.08};
  const days=Array.from({length:7},(_,d)=>{
    const seed=d+variant*7;
    const create=(name,di)=>{
      const mealKcal=targets.calories*distribution[name];
      let items;
      if(name==="早餐")items=[item(foodByCategory(allowed,pools.breakfast,seed),Math.round(mealKcal*.45/(foodByCategory(allowed,pools.breakfast,seed).kcal/100))),item(foodByCategory(allowed,pools.protein,seed+2),90),item(foodByCategory(allowed,pools.fruit,seed),150)];
      else if(name==="加餐")items=[item(foodByCategory(allowed,["水果"],seed+2),150),item(foodByCategory(allowed,["奶类","豆制品","便捷蛋白"],seed+5),150)];
      else items=[item(foodByCategory(allowed,pools.staple,seed+di),Math.round(mealKcal*.35/(foodByCategory(allowed,pools.staple,seed+di).kcal/100))),item(foodByCategory(allowed,pools.protein,seed*2+di),Math.max(100,Math.round((targets.protein*distribution[name])/(foodByCategory(allowed,pools.protein,seed*2+di).protein/100)))),item(foodByCategory(allowed,pools.veg,seed+di),250)];
      items=items.filter(x=>x.food).map(x=>({...x,grams:Math.min(500,Math.max(30,Math.round(x.grams/5)*5))}));
      return {name,items,total:calculateMeal(items),method:name==="加餐"?"洗净或直接食用；不额外加糖。":"主食按熟重称量；蛋白少油煎/蒸/煮；蔬菜焯拌或快炒，全餐用油计入目标。"};
    };
    const meals=[create("早餐",0),create("午餐",1),create("晚餐",3),create("加餐",4)],calibrated=calibrateDay(meals,targets);
    return {day:d+1,...calibrated};
  });
  return {days,conflicts,allowedCount:allowed.length};
}
export function replaceMealItem(profile,day,mealIndex,itemIndex){
  const old=day.meals[mealIndex].items[itemIndex],allowed=filterFoods(profile).filter(f=>f.category===old.food.category&&f.id!==old.food.id);
  if(!allowed.length)return day;
  const next=allowed[Math.floor(Math.random()*allowed.length)];
  const grams=Math.max(20,Math.round((old.food.kcal*old.grams/next.kcal)/5)*5);
  day.meals[mealIndex].items[itemIndex]={foodId:next.id,food:next,grams};
  day.meals[mealIndex].total=calculateMeal(day.meals[mealIndex].items);
  day.total=calculateMeal(day.meals.flatMap(m=>m.items));return day;
}
function nextFood(allowed,categories,currentId,offset=1){
  const list=allowed.filter(f=>categories.includes(f.category)&&f.id!==currentId);
  return list.length?list[offset%list.length]:null;
}
export function replaceWholeMeal(profile,day,mealIndex,strategy,targets,variant=1){
  const meal=day.meals[mealIndex],allowed=filterFoods(profile);
  if(!meal||!allowed.length)return {ok:false,message:"当前硬性筛选后没有可替换食物。"};
  const oldItems=meal.items;
  const stapleCats=["米饭杂粮","面食","薯类","全谷早餐","常见早餐"],proteinCats=["禽肉","畜肉","鱼类","虾贝","蛋类","豆制品","豆类","便捷蛋白","奶类"],vegCats=["叶菜","瓜茄菌菇"],fruitCats=["水果"];
  const replaceGroup=(items,cats,offset)=>items.map(x=>{
    if(!cats.includes(x.food.category))return x;
    const next=nextFood(allowed,cats,x.food.id,offset);if(!next)return x;
    return item(next,Math.max(20,Math.round((x.food.kcal*x.grams/Math.max(1,next.kcal))/5)*5));
  });
  let items=structuredClone(oldItems);
  if(strategy==="staple")items=replaceGroup(items,stapleCats,variant);
  else if(strategy==="protein")items=replaceGroup(items,proteinCats,variant+2);
  else if(strategy==="volume"){
    items=replaceGroup(items,vegCats,variant+3).map(x=>vegCats.includes(x.food.category)?{...x,grams:Math.min(400,Math.max(300,x.grams+100))}:stapleCats.includes(x.food.category)?{...x,grams:Math.max(40,Math.round(x.grams*.75/5)*5)}:x);
  }else{
    const groups=meal.name==="加餐"?[fruitCats,["奶类","豆制品","便捷蛋白"]]:meal.name==="早餐"?[stapleCats,proteinCats,fruitCats]:[stapleCats,proteinCats,vegCats];
    items=groups.map((cats,i)=>{const old=oldItems.find(x=>cats.includes(x.food.category));const next=nextFood(allowed,cats,old?.food.id,variant+i*3);if(!next)return old;const targetKcal=old?old.food.kcal*old.grams:meal.total.kcal*100/groups.length;return item(next,Math.max(20,Math.min(500,Math.round((targetKcal/Math.max(1,next.kcal))/5)*5)))}).filter(Boolean);
  }
  const changed=items.some((x,i)=>x.food.id!==oldItems[i]?.food.id||x.grams!==oldItems[i]?.grams);
  if(!changed)return {ok:false,message:"该类别没有更多符合忌口和过敏筛选的食物。"};
  meal.items=items;meal.total=calculateMeal(items);calibrateDay(day.meals,targets);day.total=calculateMeal(day.meals.flatMap(m=>m.items));
  return {ok:true,day};
}
export function replaceDayMenu(profile,day,targets,variant=1){
  const generated=generateMeals(profile,targets,variant);
  if(generated.conflicts.length||!generated.days.length)return {ok:false,message:generated.conflicts.join("；")||"无法生成新菜单"};
  const replacement=structuredClone(generated.days[(day.day-1)%generated.days.length]);replacement.day=day.day;
  return {ok:true,day:replacement};
}
export function generatePlan(profile,previousVersions=[]){
  const previous=previousVersions.length?previousVersions[previousVersions.length-1]:null,targets=calculateTargets(profile);return {schemaVersion:3,version:(previous?.version||0)+1,createdAt:new Date().toISOString(),input:{...profile},targets,training:generateTraining(profile),meals:generateMeals(profile,targets),reason:"依据当前档案重新计算",adjustments:[]};
}
export function assessRisk(profile){
  const flags=[...(profile.risks||[])];const value=bmi(profile.weight,profile.height);
  if(profile.age<18||profile.age>64)flags.push("年龄不在18～64岁");if(value<18.5)flags.push("BMI低于18.5");
  return [...new Set(flags)];
}
export function assessProgress(records,profile,plan){
  const sorted=[...records].filter(r=>r.date).sort((a,b)=>a.date.localeCompare(b.date));
  const weights=sorted.filter(r=>Number(r.weight));const waists=sorted.filter(r=>Number(r.waist));
  if(weights.length<14&&waists.length<3)return {ready:false,message:`还需记录：${Math.max(0,14-weights.length)}次体重，或${Math.max(0,3-waists.length)}次腰围。`};
  const first7=weights.slice(0,7),last7=weights.slice(-7);const avg=a=>a.reduce((s,x)=>s+Number(x.weight),0)/a.length;
  const firstAvg=first7.length?avg(first7):profile.weight,lastAvg=last7.length?avg(last7):profile.weight;
  const weeks=Math.max(1,(new Date(sorted[sorted.length-1].date)-new Date(sorted[0].date))/604800000);const weeklyRate=(firstAvg-lastAvg)/weeks/profile.weight;
  const waistChange=waists.length>=2?Number(waists[waists.length-1].waist)-Number(waists[0].waist):0;
  const recent=sorted.slice(-7),fatigue=recent.reduce((s,x)=>s+(Number(x.fatigue)||0),0)/Math.max(1,recent.filter(x=>x.fatigue).length);const down=recent.filter(x=>x.performance==="down").length>=3;
  let proposal=null,status="趋势符合预期";
  if(weeklyRate>.01||fatigue>=4||down){status="下降或疲劳偏快";proposal={type:"recover",text:"建议将每日目标增加100～150 kcal，或将本周力量组数减少约20%。",reason:"下降速度、疲劳或力量趋势触发保护性规则。"}}
  else if(weeklyRate<.0025&&waistChange>=0){status="趋势低于目标";proposal={type:"deficit",text:"建议只调整一个变量：每日减少100～150 kcal，或每周增加30～45分钟中等强度有氧。",reason:"连续记录中体重下降较慢且腰围未下降。"}}
  return {ready:true,status,firstAvg:round(firstAvg,1),lastAvg:round(lastAvg,1),weeklyRate:round(weeklyRate*100,2),waistChange:round(waistChange,1),proposal};
}
export function planValidation(plan){
  const errors=[];if(!plan.training.weeks.length)errors.push("训练计划为空");if(plan.meals.conflicts.length)errors.push(...plan.meals.conflicts);
  for(const day of plan.meals.days){if(Math.abs(day.total.kcal-plan.targets.calories)/plan.targets.calories>.25)errors.push(`第${day.day}天能量偏差超过25%`)}
  return errors;
}
export {foods,mealTemplates};
