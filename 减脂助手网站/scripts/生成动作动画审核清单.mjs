import {mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {exerciseLibrary} from "../js/exercise-catalog.js";

const 当前目录=path.dirname(fileURLToPath(import.meta.url));
const 网站目录=path.resolve(当前目录,"..");
const 输出路径=path.join(网站目录,"data","动作动画审核清单.json");

const 来源登记={
  "徒手深蹲":{
    机构来源:[
      {名称:"ACE Bodyweight Squat",链接:"https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/"},
      {名称:"NASM Exercise Library",链接:"https://www.nasm.org/workout-exercise-guidance"},
      {名称:"NHS Strength and Flex - Squat",链接:"https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan-how-to-videos/"}
    ],
    教练来源:[
      {名称:"Squat University - How to Teach a Perfect Squat",链接:"https://squatuniversity.com/2016/02/05/how-to-teach-a-perfect-squat/"},
      {名称:"E3 Rehab",链接:"https://e3rehab.com/"},
      {名称:"Jeff Nippard - Squat",链接:"https://jeffnippard.com/blogs/news/the-fastest-way-to-blow-up-your-squat-naturally"}
    ],
    来源结论:"站距、脚尖角度、深度和躯干倾斜允许个体差异；共同底线是脚掌稳定、膝盖轨迹可控、脊柱形状稳定、胸髋同步站起。",
    来源状态:"已完成首轮交叉核对",
    生成状态:"禁止生成：旧样片未通过最终复核，需按新分镜重制",
    动画分型:"站立双脚固定",
    分镜:"8×2，16帧",
    稳定锚点:["双脚中心","地面","人物全局尺度"]
  },
  "标准俯卧撑":{
    机构来源:[
      {名称:"NASM Push-Up",链接:"https://www.nasm.org/resource-center/exercise-library/push-up"},
      {名称:"NASM Proper Push-Up Form",链接:"https://www.nasm.org/resource-center/blog/training/proper-push-up-form-and-technique-a-complete-guide"},
      {名称:"ACE Push-up Assessment Protocol",链接:"https://www.acefitness.org/images/webcontent/assets/certification/ace-answers/forms/pt/36_Push-up_Assessment_Protocol.pdf"}
    ],
    教练来源:[
      {名称:"E3 Rehab - How To Perform PERFECT Push Ups",链接:"https://e3rehab.com/how-to-perform-perfect-push-ups/"},
      {名称:"FitnessFAQs - Push-up Tutorials",链接:"https://fitnessfaqs.com/articles/ff-video-tag/push-ups-tutorial/"}
    ],
    来源结论:"身体作为整体升降，躯干稳定；手距和肘角允许舒适范围，避免明显塌腰、耸肩及极端肘外展。",
    来源状态:"已完成首轮交叉核对",
    生成状态:"禁止生成：旧样片已被用户否决，需重新制作人体结构与轨迹",
    动画分型:"俯卧支撑",
    分镜:"4×4，16帧",
    稳定锚点:["手掌","脚尖","地面"]
  }
};

const 深蹲动画规格={
  "箱式徒手深蹲":["箱椅触点深蹲","4×4，16帧",["双脚中心","箱椅","地面","人物全局尺度"]],
  "靠墙静蹲":["靠墙静态保持","单角度起始—下滑—保持—回位",["墙面","双脚中心","地面","骨盆高度"]],
  "相扑徒手深蹲":["宽站距双脚固定","4×4，16帧",["双脚内外侧","地面","膝盖正面轨迹"]],
  "深蹲触椅":["椅缘轻触深蹲","4×4，16帧",["双脚中心","椅缘","地面","人物全局尺度"]],
  "抱胸深蹲":["抱胸双脚固定","4×4，16帧",["双脚中心","双臂交叉位置","地面"]],
  "哑铃高脚杯深蹲":["单哑铃胸前负重","侧前方单角度16帧",["双脚中心","哑铃与胸口距离","地面"]],
  "双哑铃前蹲":["双哑铃肩前架位","正侧双角度各16帧",["双脚中心","左右哑铃高度","地面"]],
  "哑铃相扑深蹲":["宽站距哑铃垂直悬挂","正侧双角度各16帧",["双脚内外侧","哑铃垂直路径","地面"]],
  "壶铃高脚杯深蹲":["壶铃铃角胸前架位","侧前方单角度16帧",["双脚中心","壶铃与胸口距离","地面"]],
  "杠铃后蹲":["自由杠后架深蹲","正侧双角度各20帧",["足中部","杠铃中点与两端","安全销","地面"]],
  "杠铃前蹲":["自由杠前架深蹲","正侧双角度各20帧",["足中部","杠铃中点","双肘高度","地面"]],
  "安全杠深蹲":["安全杠肩垫与把手","正侧双角度各20帧",["足中部","左右杠端","肩垫中心","把手"]],
  "史密斯深蹲":["固定导轨深蹲","侧面20帧＋正面关键帧",["导轨","双脚中心","杠铃高度","安全挡块"]],
  "史密斯箱式深蹲":["固定导轨箱式深蹲","侧面20帧＋正面关键帧",["导轨","箱体","双脚中心","安全挡块"]],
  "哈克深蹲":["哈克滑架与靠垫","侧面20帧＋脚位特写",["滑轨","肩背靠垫","双脚平台位置","安全把手"]],
  "腿举":["斜板腿举机","侧面20帧＋膝脚正面特写",["座椅靠背","平台","双脚位置","安全把手"]],
  "地雷管深蹲":["地雷管弧形前负重","侧面20帧＋正面关键帧",["底座锚点","杠端与胸口","双脚中心","地面"]]
};

for(const 动作 of exerciseLibrary.filter(item=>item.group==="squat")){
  if(来源登记[动作.name])continue;
  const 机构来源=(动作.sources||[]).filter(source=>/NASM|ACE|NHS/.test(source.title)).map(source=>({名称:source.title,链接:source.url}));
  const 教练来源=(动作.sources||[]).filter(source=>!/NASM|ACE|NHS/.test(source.title)).map(source=>({名称:source.title,链接:source.url}));
  const [动画分型,分镜,稳定锚点]=深蹲动画规格[动作.name]||["待逐项确认","待逐项确认",[]];
  来源登记[动作.name]={
    机构来源,教练来源,
    来源结论:`${动作.steps.join("")} 做到位判断：${动作.standard}`,
    来源状态:"已完成首轮交叉核对",
    生成状态:"禁止生成：动画分镜和真人结构尚未逐帧审定",
    动画分型,分镜,稳定锚点
  };
}

const 分组候选分型={
  squat:"站立双脚固定",
  hinge:"需按臀桥、硬拉和腿弯举逐项判定",
  push:"需按俯卧、仰卧和器械逐项判定",
  pull:"需按站立、支撑和器械逐项判定",
  vertical:"需按悬垂、站立、坐姿和器械逐项判定",
  single:"单腿与箭步",
  core:"需按仰卧、俯卧、四点跪姿、悬垂和站立逐项判定",
  carry:"移动与有氧",
  isolation:"需按站立、坐姿、侧卧和器械逐项判定",
  cardio:"移动与有氧",
  mobility:"需按站立、跪姿、仰卧和四点跪姿逐项判定"
};

const 清单=exerciseLibrary.map((动作,索引)=>{
  const 已登记=来源登记[动作.name];
  return {
    顺序:索引+1,
    动作编号:动作.id,
    动作名称:动作.name,
    动作分组:动作.group,
    动作类别:动作.category,
    器械:动作.equipment,
    候选动画分型:已登记?.动画分型||分组候选分型[动作.group],
    动画分型确认:已登记?.动画分型||"待逐项确认",
    推荐分镜:已登记?.分镜||"待逐项确认",
    稳定锚点:已登记?.稳定锚点||[],
    机构来源:已登记?.机构来源||[],
    教练来源:已登记?.教练来源||[],
    来源结论:已登记?.来源结论||"",
    来源状态:已登记?.来源状态||"待逐项核对",
    动作要点状态:已登记?"已完成首轮核对":"待逐项核对",
    生成状态:已登记?.生成状态||"禁止生成：来源未通过",
    五项复核:{
      解剖完整性:"待复核",
      动作轨迹:"待复核",
      器械与安全:"待复核",
      画面稳定:"待复核",
      说明一致性:"待复核"
    },
    用户审核:动作.name==="标准俯卧撑"?"旧样片未通过":动作.group==="squat"?"新分镜待审核":"待审核",
    上线状态:"禁止上线"
  };
});

const 输出={
  元数据:{
    名称:"动作动画逐项审核清单",
    版本:1,
    生成日期:new Date().toISOString().slice(0,10),
    动作总数:清单.length,
    审核原则:"先来源核对，后生成；五项复核和用户审核均通过后方可上线",
    规范文件:"docs/动作动画逐项审核规范.md"
  },
  动作:清单
};

await mkdir(path.dirname(输出路径),{recursive:true});
await writeFile(输出路径,`${JSON.stringify(输出,null,2)}\n`,"utf8");
console.log(`已生成 ${清单.length} 项动作审核清单`);
