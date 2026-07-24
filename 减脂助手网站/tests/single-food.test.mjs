import test from "node:test";
import assert from "node:assert/strict";
import {singleFoodItems,singleFoodTypes,calculateSingleFood} from "../js/single-food-catalog.js";

test("单品热量库覆盖全部基础食物并包含用户要求的简单菜",()=>{
  assert.equal(singleFoodItems.length,300);
  for(const name of ["水煮鸡蛋","蒸鸡蛋羹","荷包蛋少油","蒸红薯","清蒸鱼"]){
    assert.ok(singleFoodItems.some(item=>item.name===name),`缺少${name}`);
  }
  assert.deepEqual(singleFoodTypes,["基础食物","简单烹调菜","即食单品"]);
});

test("单品按克重换算营养并返回透明估算区间",()=>{
  const egg=singleFoodItems.find(item=>item.name==="水煮鸡蛋");
  const result=calculateSingleFood(egg,50);
  assert.equal(result.grams,50);
  assert.equal(result.kcal,Math.round(egg.kcal*.5));
  assert.equal(result.protein,Number((egg.protein*.5).toFixed(1)));
  assert.ok(result.range[0]<result.kcal);
  assert.ok(result.range[1]>result.kcal);
});

test("蒸蛋使用常见份量且不被归类成套餐",()=>{
  const steamedEgg=singleFoodItems.find(item=>item.name==="蒸鸡蛋羹");
  const boiledEgg=singleFoodItems.find(item=>item.name==="水煮鸡蛋");
  const friedEgg=singleFoodItems.find(item=>item.name==="荷包蛋少油");
  assert.equal(steamedEgg.itemType,"简单烹调菜");
  assert.equal(steamedEgg.servingGrams,120);
  assert.ok(steamedEgg.kcal>=50&&steamedEgg.kcal<=90,"蒸蛋必须计入加水后的成品重");
  assert.ok(boiledEgg.kcal>=140&&boiledEgg.kcal<=170);
  assert.ok(friedEgg.kcal>boiledEgg.kcal,"少油荷包蛋必须计入烹调油");
  assert.match(steamedEgg.note,/鸡蛋|加水|成品/);
});
