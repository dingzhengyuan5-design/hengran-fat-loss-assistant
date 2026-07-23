import {foods} from "./catalog.js";

const 菜谱核验日期="2026-07-23";
const 菜谱食物=name=>foods.find(food=>food.name===name);
const 菜谱原料=(foodName,grams)=>({foodId:菜谱食物(foodName)?.id||"",foodName,grams});
const 标准菜谱=(id,name,category,ingredients,method,yieldRatio=.94,servings=1)=>({
  id,name,category,ingredients:ingredients.map(([foodName,grams])=>菜谱原料(foodName,grams)),
  yieldGrams:Math.max(100,Math.round(ingredients.reduce((sum,item)=>sum+item[1],0)*yieldRatio)),
  servings,method,source:"国家卫健委成人肥胖食养指南的配餐结构；单项营养值参考站内中国食物成分资料与USDA FoodData Central快照",
  verifiedOn:菜谱核验日期,confidence:"中",reviewStatus:"标准化家庭配方；外食版本不适用"
});

const 菜谱集合=[];
let 菜谱序号=1;
const 添加菜谱=(name,category,ingredients,method,yieldRatio=.94,servings=1)=>{
  菜谱集合.push(标准菜谱(`r${String(菜谱序号++).padStart(3,"0")}`,name,category,ingredients,method,yieldRatio,servings));
};

const 饭底=["白米饭","糙米饭","黑米饭","藜麦饭"];
const 面底=["小麦面条","全麦面条","荞麦面条","米线"];
const 餐蛋白=["去皮鸡胸肉","牛里脊","虾仁","水浸金枪鱼罐头","北豆腐","水煮鸡蛋"];
const 餐蔬菜=["西兰花","彩椒","圆白菜","番茄"];
for(const rice of 饭底)for(const protein of 餐蛋白){
  const veg=餐蔬菜[(菜谱序号-1)%餐蔬菜.length];
  添加菜谱(`${protein.replace(/去皮|水浸|罐头|水煮/g,"")}${veg}${rice.replace("饭","")}炒饭`,"炒饭",
    [[rice,220],[protein,90],["水煮鸡蛋",50],[veg,120],["菜籽油",8],["生抽",6]],
    "不粘锅预热；8克油炒香蛋白与蔬菜；加入熟饭和生抽翻炒至均匀。",.9);
}
for(const noodle of 面底)for(const protein of 餐蛋白){
  const veg=餐蔬菜[(菜谱序号+1)%餐蔬菜.length];
  添加菜谱(`${protein.replace(/去皮|水浸|罐头|水煮/g,"")}${veg}${noodle}`,"炒面与汤面",
    [[noodle,230],[protein,100],[veg,160],["菜籽油",7],["生抽",7]],
    "面食煮熟沥水；少油炒蛋白和蔬菜；加入面食及调味快速翻匀。",.94);
}
const 家常蛋白=["去皮鸡胸肉","鸡里脊","牛里脊","猪里脊","鳕鱼","鲈鱼","虾仁","北豆腐"];
const 家常蔬菜=["西兰花","彩椒","番茄","圆白菜","芹菜"];
for(const protein of 家常蛋白)for(const veg of 家常蔬菜){
  添加菜谱(`${veg}${protein.replace(/去皮/g,"")}少油小炒`,"家常炒菜",
    [[protein,160],[veg,260],["菜籽油",8],["生抽",6]],
    "食材切成大小一致；8克油先炒蛋白至熟；加入蔬菜快速翻炒并调味。",.86,2);
}
const 盖饭主菜=[
  ["番茄鸡丁",[["去皮鸡胸肉",140],["番茄",220]]],
  ["青椒牛肉",[["牛里脊",140],["彩椒",200]]],
  ["西兰花虾仁",[["虾仁",150],["西兰花",240]]],
  ["菌菇豆腐",[["北豆腐",180],["香菇",180]]]
];
for(const rice of 饭底)for(const [main,items] of 盖饭主菜){
  添加菜谱(`${main}${rice}盖饭`,"盖饭与焖饭",[[rice,220],...items,["菜籽油",7],["生抽",6]],
    "主菜用定量油烹熟；熟饭按克重装盘；将主菜和汤汁覆盖在米饭上。",.9);
}
const 汤羹=[
  ["番茄鸡蛋汤",[["番茄",250],["水煮鸡蛋",60],["芝麻油",2]]],
  ["冬瓜虾仁汤",[["冬瓜",300],["虾仁",100],["芝麻油",2]]],
  ["菌菇豆腐汤",[["香菇",150],["北豆腐",180],["芝麻油",2]]],
  ["萝卜牛肉汤",[["牛腱子",140],["冬瓜",260],["芝麻油",2]]],
  ["海带豆腐汤",[["海带",180],["北豆腐",180],["芝麻油",2]]],
  ["菠菜鸡蛋汤",[["菠菜",220],["水煮鸡蛋",60],["芝麻油",2]]],
  ["玉米鸡肉汤",[["甜玉米粒",140],["去皮鸡胸肉",130],["芝麻油",2]]],
  ["番茄鱼片汤",[["番茄",220],["鳕鱼",150],["芝麻油",2]]]
];
for(const [name,items] of 汤羹)添加菜谱(name,"汤羹炖菜",items,"食材切配；清水煮沸后按成熟速度下锅；关火前加入定量芝麻油。",1.55,2);
const 早餐菜谱=[
  ["燕麦鸡蛋早餐碗",[["燕麦粥",250],["水煮鸡蛋",60],["蓝莓",100]]],
  ["全麦鸡肉早餐盘",[["全麦吐司",100],["去皮鸡胸肉",100],["番茄",150]]],
  ["玉米鸡蛋豆浆餐",[["玉米棒",180],["水煮鸡蛋",60],["豆浆无糖",250]]],
  ["红薯酸奶水果碗",[["蒸红薯",200],["希腊酸奶无糖",180],["苹果",120]]],
  ["杂粮馒头鸡蛋餐",[["杂粮馒头",120],["水煮鸡蛋",60],["低脂牛奶",250]]],
  ["山药鸡胸早餐盘",[["山药",200],["去皮鸡胸肉",100],["黄瓜",150]]],
  ["小米粥豆干早餐",[["小米粥",280],["豆腐干",100],["橙子",150]]],
  ["全麦吐司酸奶杯",[["全麦吐司",100],["纯酸奶无糖",200],["草莓",150]]]
];
for(const [name,items] of 早餐菜谱)添加菜谱(name,"早餐组合",items,"主食加热；蛋白食物少油或直接食用；水果洗净，不额外加糖。",1,1);

export const standardRecipes=菜谱集合;
export const recipeCategories=[...new Set(standardRecipes.map(recipe=>recipe.category))];
export function calculateRecipe(recipe,ingredientOverrides=recipe.ingredients){
  const totals={kcal:0,protein:0,fat:0,carbs:0,fiber:0};
  for(const ingredient of ingredientOverrides){
    const food=foods.find(item=>item.id===ingredient.foodId)||菜谱食物(ingredient.foodName);
    if(!food)continue;
    const ratio=Number(ingredient.grams||0)/100;
    for(const key of Object.keys(totals))totals[key]+=food[key]*ratio;
  }
  const rounded=Object.fromEntries(Object.entries(totals).map(([key,value])=>[key,Number(value.toFixed(1))]));
  const yieldGrams=Math.max(1,Number(recipe.yieldGrams)||ingredientOverrides.reduce((sum,item)=>sum+Number(item.grams||0),0));
  const per100=Object.fromEntries(Object.entries(rounded).map(([key,value])=>[key,Number((value*100/yieldGrams).toFixed(1))]));
  const servings=Math.max(1,Number(recipe.servings)||1);
  const perServing=Object.fromEntries(Object.entries(rounded).map(([key,value])=>[key,Number((value/servings).toFixed(1))]));
  return {total:rounded,per100,perServing,yieldGrams,servingGrams:Math.round(yieldGrams/servings)};
}
export function recipeAllowed(recipe,profile={}){
  const excluded=(profile.excludedFoods||"").split(/[，,、]/).map(value=>value.trim()).filter(Boolean);
  return recipe.ingredients.every(ingredient=>{
    const food=foods.find(item=>item.id===ingredient.foodId)||菜谱食物(ingredient.foodName);
    if(!food)return false;
    if((food.allergens||[]).some(allergen=>(profile.allergens||[]).includes(allergen)))return false;
    if(profile.diet==="vegan"&&!food.tags.includes("vegan"))return false;
    if(profile.diet==="vegetarian"&&!food.tags.includes("vegetarian"))return false;
    if(profile.diet==="no-pork"&&(food.tags.includes("pork")||food.name.includes("猪")))return false;
    return !excluded.some(name=>food.name.includes(name));
  });
}
