import assert from "node:assert/strict";
import {foods,mealTemplates,dataMeta} from "../js/catalog.js";
import {exerciseLibrary,bodyweightExerciseCount} from "../js/exercise-catalog.js";
import {standardRecipes,calculateRecipe} from "../js/recipe-catalog.js";
import {diningBrands,diningItems} from "../js/external-food-catalog.js";
import {motionExercises} from "../js/motion-catalog.js";

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
assert.equal(standardRecipes.length,120,"标准菜谱必须为120套");
const recipeIds=new Set();
for(const recipe of standardRecipes){
  assert.ok(recipe.id&&recipe.name&&recipe.category&&recipe.ingredients.length>=3,`菜谱基础字段缺失：${recipe.name}`);
  assert.ok(!recipeIds.has(recipe.id),`重复菜谱ID：${recipe.id}`);recipeIds.add(recipe.id);
  assert.ok(recipe.source&&recipe.verifiedOn&&recipe.reviewStatus,`${recipe.name} 缺少来源或审核状态`);
  for(const ingredient of recipe.ingredients){assert.ok(ids.has(ingredient.foodId),`${recipe.name} 引用了不存在的食物 ${ingredient.foodId}`);assert.ok(Number.isFinite(ingredient.grams)&&ingredient.grams>0,`${recipe.name} 原料克重不合理`)}
  const nutrition=calculateRecipe(recipe);assert.ok(nutrition.total.kcal>50&&nutrition.total.kcal<4000,`${recipe.name} 热量不合理`);
}
assert.equal(exerciseLibrary.length,220,"动作库必须为220项");
assert.ok(bodyweightExerciseCount>=100,"徒手或无专门器械动作不得少于100项");
const exerciseIds=new Set();
for(const exercise of exerciseLibrary){
  assert.ok(exercise.id&&exercise.name&&exercise.group&&exercise.category,`动作基础字段缺失：${exercise.name}`);
  assert.ok(!exerciseIds.has(exercise.id),`重复动作ID：${exercise.id}`);exerciseIds.add(exercise.id);
  assert.equal(exercise.steps.length,3,`${exercise.name} 必须有三阶段指导`);
  assert.ok(exercise.cues.length>=3&&exercise.errors.length>=3&&exercise.standard&&exercise.breathing,`${exercise.name} 指导信息不完整`);
  assert.ok(exercise.source&&exercise.verifiedOn&&exercise.reviewStatus,`${exercise.name} 缺少来源说明`);
}
assert.ok(diningBrands.length>=25,"外食品牌不得少于25个");
assert.ok(diningItems.length>=400,"外食项目不得少于400项");
const diningIds=new Set();
for(const item of diningItems){
  assert.ok(item.id&&item.brand&&item.name&&item.serving,`外食项目字段缺失：${item.brand} ${item.name}`);
  assert.ok(!diningIds.has(item.id),`重复外食ID：${item.id}`);diningIds.add(item.id);
  assert.ok(Number.isFinite(item.kcal)&&item.kcal>=0&&item.kcal<3000,`${item.brand} ${item.name} 热量不合理`);
  assert.ok(Array.isArray(item.range)&&item.range.length===2&&item.range[0]<=item.kcal&&item.range[1]>=item.kcal,`${item.brand} ${item.name} 区间不合理`);
  assert.ok(item.status&&item.confidence&&item.source&&item.verifiedOn,`${item.brand} ${item.name} 缺少估算说明`);
}
assert.ok(motionExercises.length>=80,"首批动作演示覆盖不得少于80项");
for(const motion of motionExercises){
  assert.ok(exerciseIds.has(motion.exerciseId),`动作演示引用不存在的动作：${motion.exerciseId}`);
  assert.ok(["single-angle","multi-angle"].includes(motion.mode)&&motion.fps>=50,`${motion.name} 演示配置不完整`);
}
console.log(`数据验证通过：${foods.length}种食物、${mealTemplates.length}套模板、${standardRecipes.length}套标准菜谱、${diningItems.length}项外食、${exerciseLibrary.length}项动作、${motionExercises.length}项演示，版本 ${dataMeta.version}`);
