import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const 清单=JSON.parse(await readFile(new URL("../data/动作动画审核清单.json",import.meta.url),"utf8"));

test("审核清单完整覆盖动作库",()=>{
  assert.equal(清单.元数据.动作总数,220);
  assert.equal(清单.动作.length,220);
  assert.equal(new Set(清单.动作.map(item=>item.动作编号)).size,220);
  assert.equal(new Set(清单.动作.map(item=>item.动作名称)).size,220);
});

test("未完成来源核对的动作禁止生成和上线",()=>{
  for(const 动作 of 清单.动作.filter(item=>item.来源状态!=="已完成首轮交叉核对")){
    assert.match(动作.生成状态,/禁止生成/);
    assert.equal(动作.上线状态,"禁止上线");
  }
});

test("进入样片阶段必须具有机构和教练两类来源",()=>{
  for(const 动作 of 清单.动作.filter(item=>item.生成状态.includes("样片"))){
    assert.ok(动作.机构来源.length>=2,`${动作.动作名称} 缺少机构来源`);
    assert.ok(动作.教练来源.length>=2,`${动作.动作名称} 缺少独立教练来源`);
    assert.notEqual(动作.动画分型确认,"待逐项确认");
    assert.ok(动作.稳定锚点.length>=2);
  }
});

test("任何动作在五项复核和用户审核前不得上线",()=>{
  for(const 动作 of 清单.动作){
    const 全部通过=Object.values(动作.五项复核).every(value=>value==="通过")&&动作.用户审核==="通过";
    if(!全部通过)assert.equal(动作.上线状态,"禁止上线");
  }
});
