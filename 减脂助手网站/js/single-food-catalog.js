import {foods} from "./catalog.js";

const 常用份量 = {
  "水煮鸡蛋":50,
  "蒸鸡蛋羹":120,
  "荷包蛋少油":55,
  "鹌鹑蛋":50,
  "鸭蛋":65,
  "鸡蛋白":35,
  "鸡蛋黄":18,
  "茶叶蛋":50,
  "卤鸡蛋":50,
  "番茄炒蛋少油":180,
  "韭菜炒蛋少油":160,
  "虾仁蒸蛋":160,
  "菠菜蛋羹":160,
  "香菇蒸蛋":160,
  "青椒炒蛋少油":180,
  "玉米棒":180,
  "蒸红薯":200,
  "蒸土豆":200,
  "南瓜":200,
  "贝贝南瓜":200,
  "白米饭":150,
  "糙米饭":150,
  "全脂牛奶":250,
  "低脂牛奶":250,
  "脱脂牛奶":250,
  "豆浆无糖":250,
  "纯酸奶无糖":200,
  "希腊酸奶无糖":180
};

const 简单菜关键词 = [
  "水煮","蒸","烤","清炖","清蒸","盐水","卤","手撕","蛋羹","炒蛋",
  "黑椒牛柳","瘦肉丸","清炖牛腩"
];

const 即食类别 = new Set(["奶类","水果","坚果种子","便捷蛋白","常见早餐"]);
const 默认份量 = {
  "米饭杂粮":150,"面食":200,"薯类":200,"全谷早餐":250,
  "禽肉":100,"畜肉":100,"鱼类":150,"虾贝":150,"蛋类":60,
  "豆制品":150,"豆类":150,"奶类":250,"叶菜":200,"瓜茄菌菇":200,
  "水果":150,"坚果种子":25,"外卖主菜":200,"便捷蛋白":100,
  "常见早餐":100,"油脂调味":10
};

function 单品类型(food){
  if(简单菜关键词.some(keyword=>food.name.includes(keyword))||["蛋类","外卖主菜"].includes(food.category))return "简单烹调菜";
  if(即食类别.has(food.category))return "即食单品";
  return "基础食物";
}

function 误差比例(food){
  if(food.confidence==="高")return .05;
  if(food.confidence==="中")return .1;
  return .2;
}

export const singleFoodItems = foods.map(food=>({
  ...food,
  itemType:单品类型(food),
  servingGrams:常用份量[food.name]||默认份量[food.category]||100,
  basis:"每100克可食部",
  calculationStatus:food.reviewStatus,
  rangeRatio:误差比例(food)
}));

export const singleFoodTypes=["基础食物","简单烹调菜","即食单品"];
export const singleFoodCategories=[...new Set(singleFoodItems.map(item=>item.category))];

export function calculateSingleFood(item,grams){
  const safeGrams=Math.max(1,Math.min(3000,Number(grams)||item.servingGrams||100));
  const ratio=safeGrams/100;
  const nutrient=key=>Number((item[key]*ratio).toFixed(1));
  const kcal=Math.round(item.kcal*ratio);
  const margin=Math.max(2,Math.round(kcal*item.rangeRatio));
  return {
    grams:safeGrams,
    kcal,
    protein:nutrient("protein"),
    fat:nutrient("fat"),
    carbs:nutrient("carbs"),
    fiber:nutrient("fiber"),
    range:[Math.max(0,kcal-margin),kcal+margin]
  };
}
