import test from "node:test";
import assert from "node:assert/strict";
import {bmi,bmr,calculateTargets,filterFoods,generatePlan,assessRisk,assessProgress,foods,mealTemplates} from "../js/engine.js";

const 男性={age:30,sex:"male",height:175,weight:85,goal:"steady",activity:1.375,experience:"some",days:4,minutes:60,equipment:"gym",diet:"normal",limits:[],dislikes:[],allergens:[],risks:[]};

test("BMI与Mifflin-St Jeor计算",()=>{assert.equal(bmi(85,175),27.8);assert.equal(bmr(男性),1799)});
test("宏量目标在合理范围",()=>{const t=calculateTargets(男性);assert.ok(t.calories>=1500&&t.calories<t.tdee);assert.ok(t.protein>=120);assert.ok(t.fat>=50);assert.ok(t.carbs>=80)});
test("4天训练采用上下肢拆分且60分钟含6动作",()=>{const p=generatePlan(男性);assert.equal(p.training.structure,"上下肢拆分");assert.equal(p.training.weeks.length,4);assert.equal(p.training.weeks[0].sessions[0].exercises.length,6)});
test("膝部限制过滤已标记动作",()=>{const p=generatePlan({...男性,equipment:"home",limits:["knee"]});for(const w of p.training.weeks)for(const s of w.sessions)for(const e of s.exercises)assert.ok(!e.limits.includes("knee"))});
test("纯素与过敏原属于硬过滤",()=>{const list=filterFoods({...男性,diet:"vegan",allergens:["soy","nuts"]});assert.ok(list.length>0);assert.ok(list.every(x=>x.tags.includes("vegan")));assert.ok(list.every(x=>!x.allergens.includes("soy")&&!x.allergens.includes("nuts")))});
test("不吃猪肉不会返回猪肉标签或名称",()=>{const list=filterFoods({...男性,diet:"no-pork"});assert.ok(list.every(x=>!x.tags.includes("pork")&&!x.name.includes("猪")))});
test("风险用户不应进入普通处方流程",()=>{assert.ok(assessRisk({...男性,age:17}).length);assert.ok(assessRisk({...男性,weight:50}).includes("BMI低于18.5"))});
test("进度不足时不提调整",()=>{assert.equal(assessProgress([{date:"2026-01-01",weight:85}],男性,generatePlan(男性)).ready,false)});
test("连续下降过快触发恢复建议",()=>{const records=Array.from({length:14},(_,i)=>({date:`2026-01-${String(i+1).padStart(2,"0")}`,weight:85-i*.25,fatigue:"4",performance:i>9?"down":"same"}));const a=assessProgress(records,男性,generatePlan(男性));assert.equal(a.ready,true);assert.equal(a.proposal.type,"recover")});
test("目录和套餐达到首版规模",()=>{assert.equal(foods.length,300);assert.equal(mealTemplates.length,80)});
test("七天菜单能量与主要宏量控制在目标容差",()=>{const p=generatePlan(男性);for(const d of p.meals.days){assert.ok(Math.abs(d.total.kcal-p.targets.calories)/p.targets.calories<=.05,`第${d.day}天能量超差`);for(const k of ["protein","fat","carbs"])assert.ok(Math.abs(d.total[k]-p.targets[k])/p.targets[k]<=.10,`第${d.day}天${k}超差`)}});
