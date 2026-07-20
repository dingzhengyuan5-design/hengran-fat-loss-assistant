import assert from "node:assert/strict";
import {foods,mealTemplates,dataMeta} from "../js/catalog.js";

assert.equal(foods.length,300,"食物条目必须为300");
assert.equal(mealTemplates.length,80,"套餐模板必须为80");
const ids=new Set();
for(const food of foods){
  assert.ok(food.id&&food.name&&food.category&&food.state,"食物基础字段缺失");
  assert.ok(!ids.has(food.id),`重复ID：${food.id}`);ids.add(food.id);
  for(const key of ["kcal","protein","fat","carbs","fiber"])assert.ok(Number.isFinite(food[key])&&food[key]>=0,`${food.name} 的 ${key} 不合理`);
  assert.ok(food.kcal<=950,`${food.name} 热量超出合理上限`);assert.ok(food.source&&food.verifiedOn&&food.reviewStatus,"食物来源、日期或审核状态缺失");
}
for(const meal of mealTemplates){assert.ok(meal.items.length>=2,`${meal.name} 内容过少`);for(const item of meal.items)assert.ok(ids.has(item.foodId),`${meal.name} 引用了不存在的食物 ${item.foodId}`)}
console.log(`数据验证通过：${foods.length}种食物、${mealTemplates.length}套套餐，版本 ${dataMeta.version}`);
