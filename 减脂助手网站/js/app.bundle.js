/* 衡燃减脂助手浏览器发布包
 * 此文件由 scripts/build.mjs 自动生成，请勿直接编辑。
 * 生成时间不写入文件，以保证构建结果可复现。
 */
(()=>{
"use strict";

/* 来源：js/catalog.js */
const 核验日期 = "2026-07-20";

const 类别 = [
  {category:"米饭杂粮", state:"熟重", p:[128,2.8,0.5,27.5,1.2], rawRatio:.38, names:["白米饭","糙米饭","黑米饭","红米饭","小米饭","藜麦饭","燕麦米饭","荞麦饭","玉米碴饭","薏米饭","高粱米饭","紫米饭","杂豆饭","糙米藜麦饭","二米饭"]},
  {category:"面食", state:"熟重", p:[142,4.8,1.1,28.5,1.8], rawRatio:.43, gluten:true, names:["小麦面条","全麦面条","荞麦面条","意大利面","乌冬面","刀削面","拉面","手擀面","碱水面","米线","河粉","粉丝","莜面","玉米面条","杂粮面条"]},
  {category:"薯类", state:"熟重", p:[88,1.7,0.2,20,2], rawRatio:.9, names:["蒸土豆","烤土豆","蒸红薯","烤红薯","紫薯","山药","芋头","木薯","莲藕","南瓜","贝贝南瓜","玉米棒","甜玉米粒","荸荠","菱角"]},
  {category:"全谷早餐", state:"熟重", p:[112,4.1,2,20,3], rawRatio:.25, gluten:true, names:["燕麦粥","小米粥","糙米粥","黑米粥","藜麦粥","玉米糊","荞麦粥","杂粮粥","红豆粥","绿豆粥","薏米粥","全麦馒头","杂粮馒头","玉米窝头","全麦吐司"]},
  {category:"禽肉", state:"熟重", p:[165,27,5.5,0,0], rawRatio:1.28, names:["去皮鸡胸肉","鸡里脊","去皮鸡腿肉","鸡小腿肉","鸡翅根","火鸡胸肉","鸭胸肉","去皮鸭腿","鸽肉","鹌鹑肉","盐水鸡胸","卤鸡腿去皮","清炖鸡块","烤鸡胸","手撕鸡"]},
  {category:"畜肉", state:"熟重", p:[205,25,11,0,0], rawRatio:1.3, pork:true, names:["猪里脊","猪后腿瘦肉","猪梅花瘦肉","牛里脊","牛腱子","牛后腿肉","牛肉片","羊里脊","羊腿瘦肉","兔肉","卤牛肉","清炖牛腩","瘦肉丸","酱牛肉","黑椒牛柳"]},
  {category:"鱼类", state:"熟重", p:[135,23,4.5,0,0], rawRatio:1.22, allergen:"fish", names:["鳕鱼","鲈鱼","草鱼","鲫鱼","龙利鱼","巴沙鱼","三文鱼","金枪鱼","黄花鱼","带鱼","秋刀鱼","罗非鱼","鲳鱼","鳟鱼","沙丁鱼"]},
  {category:"虾贝", state:"熟重", p:[104,21,1.6,1.3,0], rawRatio:1.35, allergen:"fish", names:["基围虾","北极虾","青虾","河虾","虾仁","扇贝柱","蛤蜊肉","牡蛎肉","青口贝","鱿鱼","墨鱼","章鱼","蟹肉","海参","田螺肉"]},
  {category:"蛋类", state:"熟重", p:[145,13,10,1.2,0], rawRatio:1, allergen:"egg", vegetarian:true, names:["水煮鸡蛋","蒸鸡蛋羹","荷包蛋少油","鹌鹑蛋","鸭蛋","鸡蛋白","鸡蛋黄","茶叶蛋","卤鸡蛋","番茄炒蛋少油","韭菜炒蛋少油","虾仁蒸蛋","菠菜蛋羹","香菇蒸蛋","青椒炒蛋少油"]},
  {category:"豆制品", state:"熟重", p:[105,11,5.8,4,1.3], rawRatio:1, allergen:"soy", vegetarian:true, vegan:true, names:["北豆腐","南豆腐","内酯豆腐","豆腐干","香干","千张","豆皮","腐竹泡发","素鸡","豆腐丝","冻豆腐","豆腐脑无糖","毛豆仁","豆浆无糖","纳豆"]},
  {category:"豆类", state:"熟重", p:[128,8.5,.7,22,7], rawRatio:.4, vegetarian:true, vegan:true, names:["红豆","绿豆","鹰嘴豆","芸豆","黑豆","白扁豆","花豆","豌豆","青豆","蚕豆","眉豆","斑豆","红腰豆","白芸豆","混合豆"]},
  {category:"奶类", state:"即食", p:[62,3.5,3.2,4.8,0], rawRatio:1, allergen:"milk", vegetarian:true, names:["全脂牛奶","低脂牛奶","脱脂牛奶","无乳糖牛奶","纯酸奶无糖","希腊酸奶无糖","高蛋白酸奶","低脂原味酸奶","奶粉冲调","低脂奶酪","茅屋奶酪","马苏里拉奶酪","羊奶","无糖拿铁","开菲尔酸奶"]},
  {category:"叶菜", state:"熟重", p:[28,2.5,.4,4,2.5], rawRatio:1.15, vegetarian:true, vegan:true, names:["菠菜","油菜","生菜","小白菜","上海青","芥蓝","空心菜","油麦菜","苋菜","茼蒿","菜心","芹菜","韭菜","羽衣甘蓝","西洋菜"]},
  {category:"瓜茄菌菇", state:"熟重", p:[31,1.8,.4,5.2,2], rawRatio:1.1, vegetarian:true, vegan:true, names:["西兰花","菜花","圆白菜","番茄","黄瓜","冬瓜","丝瓜","茄子","西葫芦","彩椒","秋葵","香菇","口蘑","金针菇","海带"]},
  {category:"水果", state:"可食部", p:[52,.8,.3,12,2.1], rawRatio:1, vegetarian:true, vegan:true, names:["苹果","梨","橙子","柚子","猕猴桃","草莓","蓝莓","香蕉","葡萄","桃","李子","西瓜","哈密瓜","菠萝","木瓜"]},
  {category:"坚果种子", state:"可食部", p:[585,19,49,21,9], rawRatio:1, allergen:"nuts", vegetarian:true, vegan:true, names:["杏仁","核桃","腰果","开心果","花生","榛子","巴旦木","松子","葵花籽仁","南瓜籽仁","芝麻","奇亚籽","亚麻籽","夏威夷果","混合坚果"]},
  {category:"外卖主菜", state:"成品", p:[155,14,7,9,1.6], rawRatio:null, names:["番茄牛肉","黑椒牛肉","青椒肉丝","芹菜牛肉","香菇鸡丁","宫保鸡丁少油","鱼香肉丝少油","麻婆豆腐少油","番茄炖鸡","萝卜炖牛肉","冬瓜虾仁","西兰花鸡胸","清蒸鱼","葱烧豆腐","菌菇鸡片"]},
  {category:"便捷蛋白", state:"即食", p:[118,18,3.5,3,0], rawRatio:null, names:["水浸金枪鱼罐头","即食鸡胸原味","低脂牛肉片","无糖豆浆粉冲调","高蛋白牛奶","低脂火腿","蟹柳","脱脂奶粉冲调","即食虾仁","卤豆干","鸡胸肉丸","低脂鱼丸","蛋白棒","乳清蛋白冲调","大豆蛋白冲调"]},
  {category:"常见早餐", state:"成品", p:[210,8,7,30,2.3], rawRatio:null, gluten:true, names:["菜包子","肉包子","豆沙包","烧麦","鸡蛋灌饼少酱","杂粮煎饼少酱","饭团","鸡蛋三明治","全麦鸡肉卷","馄饨","水饺","豆腐脑套餐","燕麦酸奶杯","鸡蛋蔬菜饼","玉米鸡蛋早餐盘"]},
  {category:"油脂调味", state:"可食部", p:[360,2,37,7,1], rawRatio:1, vegetarian:true, vegan:true, names:["花生油","菜籽油","橄榄油","芝麻油","玉米油","黄豆酱","豆瓣酱","生抽","蚝油","番茄酱","芝麻酱","花生酱","沙拉酱低脂","辣椒酱","蜂蜜"]}
];

const 来源映射 = {
  "外卖主菜":"国家卫健委食养指南示例与常见菜肴参考估算",
  "常见早餐":"国家卫健委食物交换表与常见成品参考估算",
  "default":"中国食物成分资料与 USDA FoodData Central 参考值"
};

const foods = 类别.flatMap((group, groupIndex) => group.names.map((name, index) => {
  const 微调 = 1 + (((index % 5) - 2) * .035);
  const [kcal, protein, fat, carbs, fiber] = group.p.map((v, i) => i === 0 ? Math.round(v * 微调) : +(v * 微调).toFixed(1));
  const allergens = [group.allergen, group.gluten ? "gluten" : null].filter(Boolean);
  const tags = [group.vegetarian ? "vegetarian" : null, group.vegan ? "vegan" : null, group.pork ? "pork" : null].filter(Boolean);
  return {id:`f${String(groupIndex * 15 + index + 1).padStart(3,"0")}`,name,category:group.category,state:group.state,kcal,protein,fat,carbs,fiber,allergens,tags,budget:index%4===0?"medium":"low",rawRatio:group.rawRatio,source:来源映射[group.category]||来源映射.default,verifiedOn:核验日期,reviewStatus:"待营养专业逐条审核",confidence:["外卖主菜","常见早餐"].includes(group.category)?"低至中":"中",note:"同名食物会因品种、品牌、含水量和烹调方式不同而变化；此值用于规划，不用于临床计算。"};
}));

// 油脂与酱料不能共用同一营养模板，单独覆盖常见参考值。
for(const food of foods.slice(285,290))Object.assign(food,{kcal:899,protein:0,fat:99.9,carbs:0,fiber:0,confidence:"高"});
const 调味参考={"黄豆酱":[138,12,6,10,3],"豆瓣酱":[178,14,7,17,2],"生抽":[55,8,.1,5,0],"蚝油":[115,3,.5,25,0],"番茄酱":[100,1.5,.2,24,1],"芝麻酱":[620,20,55,17,8],"花生酱":[600,25,50,20,6],"沙拉酱低脂":[260,1,20,20,0],"辣椒酱":[80,3,3,10,3],"蜂蜜":[321,.4,0,80,0]};
for(const food of foods.slice(290)){const p=调味参考[food.name];if(p)Object.assign(food,{kcal:p[0],protein:p[1],fat:p[2],carbs:p[3],fiber:p[4],confidence:"中"})}

const breakfast = ["f046","f181","f183","f166","f226","f229","f151","f236","f238","f233"];
const staples = ["f001","f002","f003","f016","f017","f031","f032","f036"];
const proteins = ["f061","f063","f076","f079","f091","f094","f106","f109","f121","f124","f256","f259"];
const vegetables = ["f181","f183","f196","f197","f199","f201","f205","f210"];
const fruits = ["f211","f213","f215","f216","f218","f219","f224","f225"];

const mealTemplates = Array.from({length:80},(_,i)=>{
  const meal = i<20?"早餐":i<50?"午餐":"晚餐";
  const isBreakfast=meal==="早餐";
  const items=isBreakfast
    ? [{foodId:breakfast[i%breakfast.length],grams:220},{foodId:"f136",grams:250},{foodId:fruits[i%fruits.length],grams:150}]
    : [{foodId:staples[i%staples.length],grams:180},{foodId:proteins[i%proteins.length],grams:150},{foodId:vegetables[i%vegetables.length],grams:250}];
  return {id:`m${String(i+1).padStart(3,"0")}`,name:`${meal}模板 ${i+1}`,meal,items,method:isBreakfast?"主食加热；搭配蛋白与水果；无额外加糖。":"主食称熟重；蛋白少油烹调；蔬菜快炒或焯拌。",maxMinutes:i%3===0?10:25,budget:i%4===0?"medium":"low",source:"国家卫健委成人肥胖食养指南菜单结构，按食物交换原则组合",verifiedOn:核验日期,reviewStatus:"待营养专业逐套审核"};
});

const references = [
  {title:"成人肥胖食养指南（2024年版）",org:"国家卫生健康委员会",note:"提供肥胖人群食养原则、能量分级菜单与食物交换思路。",url:"https://www.nhc.gov.cn/sps/c100088/202402/9ba512ba8e314a47a181db11d2fa188d/files/1743476135429_97340.pdf"},
  {title:"肥胖症诊疗指南（2024年版）",org:"国家卫生健康委员会",note:"用于中国成人BMI分类与风险边界。",url:"https://www.nhc.gov.cn/wjw/c100378/202410/bcf804e19e0c4246b5aea6cd338b55e1.shtml"},
  {title:"中国居民膳食指南（2022）",org:"中国营养学会",note:"用于食物多样性、谷薯、蔬果与平衡膳食结构。",url:"https://dg.cnsoc.org/article/04/J4-AsD_DR3OLQMnHG0-jZA.html"},
  {title:"WHO身体活动与久坐行为指南",org:"世界卫生组织",note:"成人每周有氧活动与肌力活动的公共健康建议。",url:"https://www.who.int/publications/i/item/9789240015128"},
  {title:"ACSM减重与体重反弹预防立场文件",org:"American College of Sports Medicine",note:"体力活动剂量与体重管理的经典立场文件。",url:"https://pubmed.ncbi.nlm.nih.gov/19127177/"},
  {title:"FoodData Central 下载与数据说明",org:"USDA",note:"部分食物营养参考值及每100克换算规则。",url:"https://fdc.nal.usda.gov/download-datasets/"},
  {title:"蛋白质摄入与抗阻训练荟萃分析",org:"British Journal of Sports Medicine",note:"支持抗阻训练人群蛋白质摄入的参考区间；不是越高越好。",url:"https://pubmed.ncbi.nlm.nih.gov/28698222/"},
  {title:"饮食与运动对体重及瘦体重影响的随机试验",org:"New England Journal of Medicine",note:"说明能量限制结合运动对体重组成和体能的影响。",url:"https://pubmed.ncbi.nlm.nih.gov/28514618/"}
];

const videos = [
  {platform:"YouTube",author:"Jeff Nippard",title:"科学减脂的训练与营养框架",url:"https://www.youtube.com/@JeffNippard",views:"频道数据待API更新",likes:"—",checkedOn:核验日期,status:"待正式API核验",summary:"可用于理解热量缺口、蛋白质和抗阻训练的关系。"},
  {platform:"YouTube",author:"Renaissance Periodization",title:"减脂期如何安排训练量",url:"https://www.youtube.com/@RenaissancePeriodization",views:"频道数据待API更新",likes:"—",checkedOn:核验日期,status:"待正式API核验",summary:"强调疲劳管理与逐步调整。"},
  {platform:"哔哩哔哩",author:"健身运动营养科普",title:"健身新手的减肥减脂完全手册",url:"https://www.bilibili.com/video/BV1AM411r7z3/",views:"约228.5万（单条公开页快照）",likes:"约12.2万",checkedOn:核验日期,status:"人工已核验",summary:"长视频梳理减脂理论；热度不等同于医学证据。"},
  {platform:"哔哩哔哩",author:"帅soserious",title:"到底哪种运动最减脂？",url:"https://www.bilibili.com/video/BV1qq4y1E7GN/",views:"约113.3万（单条公开页快照）",likes:"约4.1万",checkedOn:核验日期,status:"人工已核验",summary:"比较常见运动方式；具体训练仍需按关节与恢复能力筛选。"},
  {platform:"哔哩哔哩",author:"叔贵",title:"无跑跳减脂训练",url:"https://www.bilibili.com/video/BV1aU4y1G7ek/",views:"约395.2万（公开页快照）",likes:"约2.5万",checkedOn:核验日期,status:"人工已核验",summary:"低冲击跟练样本；“不伤膝腰”不能对所有人作绝对保证。"},
  {platform:"抖音",author:"待白名单确认",title:"高热度减脂内容样本",url:"https://www.douyin.com/search/%E7%A7%91%E5%AD%A6%E5%87%8F%E8%84%82",views:"不自动抓取",likes:"不自动抓取",checkedOn:核验日期,status:"仅人工导入",summary:"没有稳定合法公开统计接口时不自动更新。"},
  {platform:"小红书",author:"待白名单确认",title:"中式减脂餐内容样本",url:"https://www.xiaohongshu.com/explore",views:"不自动抓取",likes:"不自动抓取",checkedOn:核验日期,status:"仅人工导入",summary:"只纳入人工核验的作者、链接与查询时间。"}
];

const dataMeta = {verifiedOn:核验日期,foodCount:foods.length,mealCount:mealTemplates.length,version:"2026.07-a",reviewStatus:"待营养专业逐条审核",disclaimer:"营养值为离线规划参考快照，尤其外卖和混合菜误差较大。正式发布前应由营养专业人员逐条审核。"};

/* 来源：js/engine.js */
const round=(n,d=0)=>Number(Number(n).toFixed(d));
function bmi(weight,height){return round(weight/((height/100)**2),1)}
function bmr(profile){
  const base=10*profile.weight+6.25*profile.height-5*profile.age;
  return Math.round(base+(profile.sex==="male"?5:-161));
}
function referenceWeight(profile){
  const estimatedLean=profile.bodyFat?profile.weight*(1-profile.bodyFat/100):null;
  const bmi25=25*((profile.height/100)**2);
  return round(estimatedLean?Math.min(profile.weight,Math.max(estimatedLean/.78,bmi25)):Math.min(profile.weight,bmi25),1);
}
function calculateTargets(profile){
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
    {name:"高脚杯深蹲",equipment:["home","gym"],limits:["knee"],pattern:"蹲"},{name:"箱式徒手深蹲",equipment:["none","home","gym"],limits:[],pattern:"蹲"},{name:"腿举",equipment:["gym"],limits:["knee"],pattern:"蹲"}],
  hinge:[
    {name:"哑铃罗马尼亚硬拉",equipment:["home","gym"],limits:["back"],pattern:"髋铰链"},{name:"臀桥",equipment:["none","home","gym"],limits:[],pattern:"髋铰链"},{name:"器械腿弯举",equipment:["gym"],limits:[],pattern:"髋铰链"}],
  push:[
    {name:"上斜俯卧撑",equipment:["none","home","gym"],limits:["shoulder"],pattern:"水平推"},{name:"哑铃卧推",equipment:["home","gym"],limits:["shoulder"],pattern:"水平推"},{name:"器械推胸",equipment:["gym"],limits:["shoulder"],pattern:"水平推"}],
  pull:[
    {name:"弹力带划船",equipment:["home","gym"],limits:[],pattern:"水平拉"},{name:"单臂哑铃划船",equipment:["home","gym"],limits:["back"],pattern:"水平拉"},{name:"坐姿划船",equipment:["gym"],limits:[],pattern:"水平拉"},{name:"毛巾等长划船",equipment:["none"],limits:[],pattern:"水平拉"}],
  vertical:[
    {name:"半跪姿哑铃推举",equipment:["home","gym"],limits:["shoulder","back"],pattern:"垂直推"},{name:"高位下拉",equipment:["gym"],limits:["shoulder"],pattern:"垂直拉"},{name:"弹力带下拉",equipment:["home"],limits:["shoulder"],pattern:"垂直拉"},{name:"墙壁滑动",equipment:["none"],limits:["shoulder"],pattern:"肩胛控制"}],
  single:[
    {name:"扶墙反向箭步蹲",equipment:["none","home","gym"],limits:["knee"],pattern:"单腿"},{name:"低台阶踏步",equipment:["none","home","gym"],limits:["knee"],pattern:"单腿"},{name:"单腿臀桥",equipment:["none","home","gym"],limits:[],pattern:"单腿"}],
  core:[
    {name:"死虫",equipment:["none","home","gym"],limits:[],pattern:"核心"},{name:"鸟狗",equipment:["none","home","gym"],limits:[],pattern:"核心"},{name:"Pallof抗旋转",equipment:["home","gym"],limits:[],pattern:"核心"},{name:"侧桥",equipment:["none","home","gym"],limits:["shoulder"],pattern:"核心"}],
  carry:[
    {name:"农夫行走",equipment:["home","gym"],limits:[],pattern:"负重行走"},{name:"原地高抬腿慢走",equipment:["none"],limits:["knee"],pattern:"行走"},{name:"跑步机坡度走",equipment:["gym"],limits:[],pattern:"行走"}]
};

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
function generateTraining(profile){
  const days=Number(profile.days);let base=[];
  if(days<=3) base=Array.from({length:days},(_,i)=>strengthSession(profile,`全身训练 ${String.fromCharCode(65+i)}`,i));
  else if(days===4) base=[strengthSession(profile,"上肢 A"),strengthSession(profile,"下肢 A",1),strengthSession(profile,"上肢 B",2),strengthSession(profile,"下肢 B",3)];
  else {base=[strengthSession(profile,"全身 A"),strengthSession(profile,"全身 B",1),strengthSession(profile,"全身 C",2)];while(base.length<days)base.push({type:base.length===days-1?"恢复":"有氧",label:base.length===days-1?"恢复与活动度":"低冲击有氧",cardio:{mode:getCardio(profile),minutes:Math.min(45,Number(profile.minutes)),intensity:"中等强度谈话测试"},exercises:[]})}
  const weeks=[
    {week:1,focus:"建立基线",instruction:"选择能稳定完成且保留2～3次余力的负荷；记录实际次数。"},
    {week:2,focus:"增加完成量",instruction:"动作稳定时，每组增加1次；有氧每次增加5分钟。"},
    {week:3,focus:"渐进负荷",instruction:"达到次数上限后，负荷增加约2.5%～5%，仍保留约2次余力。"},
    {week:4,focus:"降低疲劳并复测",instruction:"力量组数减少约30%，保持动作质量；复测腰围与训练表现。"}
  ].map(w=>({...w,sessions:base}));
  return {structure:days<=3?"全身训练":days===4?"上下肢拆分":"3次力量＋有氧/恢复",weeks};
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
function filterFoods(profile){return foods.filter(f=>allowedFood(f,profile))}
function foodByCategory(allowed,categories,index){const list=allowed.filter(f=>categories.includes(f.category));return list[index%Math.max(1,list.length)]}
function item(food,grams){return {foodId:food.id,grams,food}}
function mealTotal(items){return items.reduce((a,x)=>{const ratio=x.grams/100;for(const k of ["kcal","protein","fat","carbs","fiber"])a[k]+=x.food[k]*ratio;return a},{kcal:0,protein:0,fat:0,carbs:0,fiber:0})}
function calculateMeal(items){const total=mealTotal(items);return Object.fromEntries(Object.entries(total).map(([k,v])=>[k,round(v,1)]))}
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
function generateMeals(profile,targets){
  const allowed=filterFoods(profile),conflicts=[];
  const pools={staple:["米饭杂粮","面食","薯类","全谷早餐"],protein:["禽肉","畜肉","鱼类","虾贝","蛋类","豆制品","豆类","便捷蛋白"],veg:["叶菜","瓜茄菌菇"],fruit:["水果"],breakfast:["全谷早餐","常见早餐","米饭杂粮","薯类"]};
  for(const [key,cats] of Object.entries(pools))if(!allowed.some(f=>cats.includes(f.category)))conflicts.push(`没有可用的${key}食物：可能与过敏或饮食模式冲突`);
  if(conflicts.length)return {days:[],conflicts,allowedCount:allowed.length};
  const distribution={早餐:.25,午餐:.35,晚餐:.32,加餐:.08};
  const days=Array.from({length:7},(_,d)=>{
    const create=(name,di)=>{
      const mealKcal=targets.calories*distribution[name];
      let items;
      if(name==="早餐")items=[item(foodByCategory(allowed,pools.breakfast,d),Math.round(mealKcal*.45/(foodByCategory(allowed,pools.breakfast,d).kcal/100))),item(foodByCategory(allowed,pools.protein,d+2),90),item(foodByCategory(allowed,pools.fruit,d),150)];
      else if(name==="加餐")items=[item(foodByCategory(allowed,["水果"],d+2),150),item(foodByCategory(allowed,["奶类","豆制品","便捷蛋白"],d+5),150)];
      else items=[item(foodByCategory(allowed,pools.staple,d+di),Math.round(mealKcal*.35/(foodByCategory(allowed,pools.staple,d+di).kcal/100))),item(foodByCategory(allowed,pools.protein,d*2+di),Math.max(100,Math.round((targets.protein*distribution[name])/(foodByCategory(allowed,pools.protein,d*2+di).protein/100)))),item(foodByCategory(allowed,pools.veg,d+di),250)];
      items=items.filter(x=>x.food).map(x=>({...x,grams:Math.min(500,Math.max(30,Math.round(x.grams/5)*5))}));
      return {name,items,total:calculateMeal(items),method:name==="加餐"?"洗净或直接食用；不额外加糖。":"主食按熟重称量；蛋白少油煎/蒸/煮；蔬菜焯拌或快炒，全餐用油计入目标。"};
    };
    const meals=[create("早餐",0),create("午餐",1),create("晚餐",3),create("加餐",4)],calibrated=calibrateDay(meals,targets);
    return {day:d+1,...calibrated};
  });
  return {days,conflicts,allowedCount:allowed.length};
}
function replaceMealItem(profile,day,mealIndex,itemIndex){
  const old=day.meals[mealIndex].items[itemIndex],allowed=filterFoods(profile).filter(f=>f.category===old.food.category&&f.id!==old.food.id);
  if(!allowed.length)return day;
  const next=allowed[Math.floor(Math.random()*allowed.length)];
  const grams=Math.max(20,Math.round((old.food.kcal*old.grams/next.kcal)/5)*5);
  day.meals[mealIndex].items[itemIndex]={foodId:next.id,food:next,grams};
  day.meals[mealIndex].total=calculateMeal(day.meals[mealIndex].items);
  day.total=calculateMeal(day.meals.flatMap(m=>m.items));return day;
}
function generatePlan(profile,previousVersions=[]){
  const previous=previousVersions.length?previousVersions[previousVersions.length-1]:null,targets=calculateTargets(profile);return {version:(previous?.version||0)+1,createdAt:new Date().toISOString(),input:{...profile},targets,training:generateTraining(profile),meals:generateMeals(profile,targets),reason:"依据当前档案重新计算",adjustments:[]};
}
function assessRisk(profile){
  const flags=[...(profile.risks||[])];const value=bmi(profile.weight,profile.height);
  if(profile.age<18||profile.age>64)flags.push("年龄不在18～64岁");if(value<18.5)flags.push("BMI低于18.5");
  return [...new Set(flags)];
}
function assessProgress(records,profile,plan){
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
function planValidation(plan){
  const errors=[];if(!plan.training.weeks.length)errors.push("训练计划为空");if(plan.meals.conflicts.length)errors.push(...plan.meals.conflicts);
  for(const day of plan.meals.days){if(Math.abs(day.total.kcal-plan.targets.calories)/plan.targets.calories>.25)errors.push(`第${day.day}天能量偏差超过25%`)}
  return errors;
}

/* 来源：js/crypto-sync.js */
const encoder=new TextEncoder(),decoder=new TextDecoder();
const b64=bytes=>btoa(String.fromCharCode(...bytes));
const fromB64=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
function createRecoveryCode(){const bytes=crypto.getRandomValues(new Uint8Array(24));return [...bytes].map(b=>b.toString(16).padStart(2,"0")).join("").match(/.{1,8}/g).join("-")}
async function authToken(recoveryCode){const digest=await crypto.subtle.digest("SHA-256",encoder.encode(`衡燃认证-v1:${recoveryCode.replaceAll("-","")}`));return b64(new Uint8Array(digest))}
async function derive(code,salt){
  const material=await crypto.subtle.importKey("raw",encoder.encode(code.replaceAll("-","")),"HKDF",false,["deriveKey"]);
  return crypto.subtle.deriveKey({name:"HKDF",hash:"SHA-256",salt,info:encoder.encode("衡燃匿名同步-v1")},material,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
}
async function encryptPayload(payload,recoveryCode){const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await derive(recoveryCode,salt),cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,encoder.encode(JSON.stringify(payload)));return {ciphertext:b64(new Uint8Array(cipher)),iv:b64(iv),salt:b64(salt),schemaVersion:1}}
async function decryptPayload(bundle,recoveryCode){const key=await derive(recoveryCode,fromB64(bundle.salt)),plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:fromB64(bundle.iv)},key,fromB64(bundle.ciphertext));return JSON.parse(decoder.decode(plain))}
function syncConfigured(){return Boolean(window.APP_CONFIG?.syncEndpoint&&window.APP_CONFIG?.publicSiteUrl)}
async function syncRequest(action,body){
  if(!syncConfigured())throw new Error("尚未配置云同步");
  const response=await fetch(window.APP_CONFIG.syncEndpoint,{method:"POST",headers:{"content-type":"application/json","x-site-origin":location.origin},body:JSON.stringify({action,...body})});
  if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||`同步失败（${response.status}）`)}return response.json();
}

/* 来源：js/app.js */
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const KEYS={profile:"hengran_profile_v2",plans:"hengran_plans_v2",records:"hengran_records_v2"};
const 已存方案=read(KEYS.plans,[]),已存记录=read(KEYS.records,[]);
const state={profile:read(KEYS.profile,null),plans:Array.isArray(已存方案)?已存方案:[],records:Array.isArray(已存记录)?已存记录:[],week:0,day:0,foodId:foods[0].id};
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(error){toast("浏览器拒绝保存，请检查隐私模式或存储权限");console.error("保存失败",error);return false}}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400)}
const currentPlan=()=>state.plans.length?state.plans[state.plans.length-1]:null;
let profileDirty=false,progressDirty=false,pendingNavigation=null;

function showPage(id){
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===id));$$('.nav-item').forEach(n=>n.classList.toggle("active",n.dataset.page===id));
  const page=$(`#${id}`);$("#pageTitle").textContent=page.dataset.title;$("#pageEyebrow").textContent=page.dataset.eyebrow;$("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});history.replaceState(null,"",`#${id}`);
}
function ensurePlan(){if(currentPlan()||!state.profile||completion(state.profile)<100||assessRisk(state.profile).length)return Boolean(currentPlan());const plan=generatePlan(state.profile,state.plans);plan.validation=planValidation(plan);state.plans.push(plan);write(KEYS.plans,state.plans);renderAll();toast("已根据已保存档案补充生成方案");return true}
function requestNavigation(id){const active=$(".page.active")?.id,hasChanges=(active==="profile"&&profileDirty)||(active==="progress"&&progressDirty);if(hasChanges){pendingNavigation=id;$("#unsavedMessage").textContent=active==="profile"?"个人信息有未保存修改。保存后会重新生成方案版本。":"进度记录尚未保存。保存后再离开可避免丢失。";$("#unsavedDialog").showModal();return}if(id==="plan")ensurePlan();showPage(id)}
$$('[data-page]').forEach(x=>x.addEventListener("click",()=>requestNavigation(x.dataset.page)));$$('[data-jump]').forEach(x=>x.addEventListener("click",()=>requestNavigation(x.dataset.jump)));
$("#menuButton").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));$("#printButton").addEventListener("click",()=>window.print());

const required=["age","sex","height","weight","goal","activity","experience","days","minutes","equipment","diet"];
function completion(profile=state.profile){if(!profile)return 0;return Math.round(required.filter(k=>profile[k]!==""&&profile[k]!=null).length/required.length*100)}
function serializeForm(form){
  const data=Object.fromEntries(new FormData(form).entries());
  for(const name of ["limits","dislikes","preferences","allergens","risks"])data[name]=$$(`input[name="${name}"]:checked`,form).map(x=>x.value);
  for(const key of ["age","height","weight","bodyFat","restingHr","waist","hip","neck","steps","sitting","sleep","currentMinutes","days","minutes"])if(data[key]!==""&&data[key]!=null)data[key]=Number(data[key]);
  return data;
}
function fillForm(profile){if(!profile)return;const form=$("#profileForm");for(const [key,value] of Object.entries(profile)){if(Array.isArray(value))value.forEach(v=>{const input=$(`input[name="${key}"][value="${v}"]`,form);if(input)input.checked=true});else{const input=form.elements[key];if(input)input.value=value??""}}}
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
$("#clearProfile").addEventListener("click",()=>{if(confirm("确定清空表单和已保存档案？已有方案与记录不会删除。")){state.profile=null;localStorage.removeItem(KEYS.profile);$("#profileForm").reset();setProfileDirty(false);renderAll()}});
$("#regeneratePlan").addEventListener("click",()=>{if(!state.profile)return;state.plans.push(generatePlan(state.profile,state.plans));write(KEYS.plans,state.plans);renderPlan();renderOverview();toast("已创建新方案版本")});

function renderOverview(){
  const score=completion();$("#completionScore").textContent=`${score}%`;$("#completionRing").style.background=`conic-gradient(var(--lime) ${score*3.6}deg,#31594e 0deg)`;$("#overviewProfile").textContent=state.profile?"已完成":"未填写";$("#profileDot").classList.toggle("ready",score===100);$("#overviewVersion").textContent=currentPlan()?`v${currentPlan().version}`:"—";$("#overviewRecords").textContent=`${state.records.length} 条`;
  const metrics=$$("#overviewMetrics .metric");if(state.profile&&currentPlan()){const t=currentPlan().targets;metrics[0].innerHTML=`<small>当前 BMI</small><strong>${t.bmi}</strong><span>${t.bmi>=28?"达到中国成人肥胖BMI界值":t.bmi>=24?"处于超重范围":"仅作筛查指标"}</span>`;metrics[1].innerHTML=`<small>每日热量目标</small><strong>${t.calories} kcal</strong><span>估算维持 ${t.tdee} kcal，需用趋势校准</span>`;metrics[2].innerHTML=`<small>每周训练</small><strong>${state.profile.days} 天</strong><span>${currentPlan().training.structure}</span>`}
  const assessment=state.profile&&currentPlan()?assessProgress(state.records,state.profile,currentPlan()):null;metrics[3].innerHTML=assessment?.ready?`<small>趋势判断</small><strong>${assessment.status}</strong><span>近段7日均重 ${assessment.lastAvg} kg</span>`:`<small>趋势判断</small><strong>等待数据</strong><span>${assessment?.message||"至少14天体重或3次腰围"}</span>`;
}
function renderSummary(plan){const t=plan.targets,profile=state.profile||plan.input||{},goal=profile.goal==="recomp"?"体态重组":profile.goal==="faster"?"较快减脂":"稳定减脂",first=plan.training.weeks[0]?.sessions[0];$("#summaryPanel").innerHTML=`<article class="plan-hero"><div class="plan-hero-top"><div><span class="badge">当前执行方案 · v${plan.version}</span><h2>${goal}</h2><p>先执行4周，再依据7日平均体重、腰围和训练表现判断是否需要调整。不要因单日体重波动改变计划。</p></div><div class="plan-hero-score"><strong>${t.calories}</strong><span>每日目标 kcal</span></div></div><div class="plan-focus"><span>每周训练 ${profile.days} 天</span><span>${plan.training.structure}</span><span>蛋白质 ${t.protein} g/日</span><span>参考心率 ${t.moderate[0]}～${t.moderate[1]}</span></div></article><div class="summary-grid"><article class="summary-tile"><small>估算维持热量</small><strong>${t.tdee}</strong><span>kcal / 日，后续用趋势校准</span></article><article class="summary-tile"><small>蛋白质目标</small><strong>${t.protein} g</strong><span>参考体重 ${t.referenceWeight} kg</span></article><article class="summary-tile"><small>脂肪与碳水</small><strong>${t.fat} / ${t.carbs}</strong><span>脂肪 g / 碳水 g</span></article><article class="summary-tile"><small>4周训练结构</small><strong>${profile.days} 天</strong><span>${plan.training.structure}</span></article></div><article class="today-card"><div class="today-icon">↗</div><div><h3>第一步：${first?.label||"建立训练基线"}</h3><p>${first?.exercises?.slice(0,3).map(x=>x.name).join("、")||"中等强度有氧与活动度"}。动作保留2～3次余力。</p></div><button class="secondary-button" id="openTrainingTab">查看完整训练</button></article><div class="plan-note"><b>计算依据与边界</b><p>Mifflin-St Jeor估算静息代谢 ${t.resting} kcal，活动系数后约 ${t.tdee} kcal。公式对个体可有明显误差，请在至少两周规范记录后校准。</p>${plan.validation?.length?`<p class="trend-warn"><b>数据提示：</b>${plan.validation.join("；")}</p>`:""}</div>`;$("#openTrainingTab").onclick=()=>$(".tab[data-tab='training']").click()}
function renderTraining(plan){const week=plan.training.weeks[state.week]||plan.training.weeks[0];$("#trainingPanel").innerHTML=`<div class="week-selector">${plan.training.weeks.map((w,i)=>`<button class="${i===state.week?"active":""}" data-week="${i}">第${w.week}周 · ${w.focus}</button>`).join("")}</div><div class="plan-note"><b>${week.focus}</b><p>${week.instruction}</p></div><div class="training-stack">${week.sessions.map((s,i)=>`<article class="training-day"><div class="meal-head"><div><span class="badge">训练 ${i+1}</span><h3>${s.label}</h3></div><small>${s.type}</small></div>${s.exercises?.length?`<div class="exercise-list"><div class="exercise"><b>动作</b><span>组数</span><span>次数</span><span>RIR</span><span>休息</span></div>${s.exercises.map(e=>`<div class="exercise"><b>${e.name}<small> · ${e.pattern}</small></b><span>${e.sets}</span><span>${e.reps}</span><span>${e.rir}</span><span>${e.rest}</span></div>`).join("")}</div>`:""}<p class="muted">有氧：${s.cardio.mode} · ${s.cardio.minutes}分钟 · ${s.cardio.intensity}</p></article>`).join("")}</div>`;$$('[data-week]').forEach(b=>b.onclick=()=>{state.week=Number(b.dataset.week);renderTraining(plan)})}
function renderMeals(plan){
  if(plan.meals.conflicts.length){$("#mealsPanel").innerHTML=`<div class="notice"><b>无法安全生成</b><p>${plan.meals.conflicts.join("；")}。请调整硬性排除条件，或由营养专业人员设计。</p></div>`;return}
  const day=plan.meals.days[state.day];$("#mealsPanel").innerHTML=`<div class="day-selector">${plan.meals.days.map((d,i)=>`<button class="${i===state.day?"active":""}" data-day="${i}">第${d.day}天</button>`).join("")}</div><article class="meal-day"><div class="meal-head"><div><h3>第${day.day}天 · 三餐＋可选加餐</h3><p class="muted">全天 ${day.total.kcal} kcal · 蛋白质 ${day.total.protein} g · 碳水 ${day.total.carbs} g · 脂肪 ${day.total.fat} g</p></div><span class="badge">目标 ${plan.targets.calories} kcal</span></div>${day.meals.map((meal,mi)=>`<div class="meal-card"><div class="meal-head"><h3>${meal.name}</h3><div class="macro-row"><span>${meal.total.kcal} kcal</span><span>蛋白 ${meal.total.protein} g</span></div></div>${meal.items.map((x,ii)=>`<div class="food-line"><span><b>${x.food.name}</b><br><small>${x.food.state} · ${x.food.confidence}置信度 · 待专业复核</small></span><span>${x.food.carbs}g 碳水/100g</span><label><input class="meal-grams" data-meal="${mi}" data-item="${ii}" type="number" value="${x.grams}" min="10" max="800" step="5"> g</label><button class="text-button replace-food" data-meal="${mi}" data-item="${ii}">替换</button></div>`).join("")}<p class="muted">做法：${meal.method}</p></div>`).join("")}</article>`;
  $$('[data-day]').forEach(b=>b.onclick=()=>{state.day=Number(b.dataset.day);renderMeals(plan)});$$('.replace-food').forEach(b=>b.onclick=()=>{replaceMealItem(state.profile,day,Number(b.dataset.meal),Number(b.dataset.item));write(KEYS.plans,state.plans);renderMeals(plan);toast("已按同类食物等热量替换")});$$('.meal-grams').forEach(input=>input.onchange=()=>{const mi=Number(input.dataset.meal),ii=Number(input.dataset.item);day.meals[mi].items[ii].grams=Number(input.value);day.meals[mi].total=calculateMeal(day.meals[mi].items);day.total=calculateMeal(day.meals.flatMap(m=>m.items));write(KEYS.plans,state.plans);renderMeals(plan)});
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

function renderEvidence(){$("#referenceList").innerHTML=references.map((r,i)=>`<article class="reference"><div class="reference-index">${String(i+1).padStart(2,"0")}</div><div><h3>${r.title}</h3><p>${r.org} · ${r.note}</p></div><a href="${r.url}" target="_blank" rel="noopener">查看来源 ↗</a></article>`).join("");$("#foodCount").textContent=foods.length;$("#mealCount").textContent=mealTemplates.length;$("#dataDate").textContent=dataMeta.verifiedOn}
function renderVideos(filter="all"){$("#videoGrid").innerHTML=videos.filter(v=>filter==="all"||v.platform===filter).map(v=>`<article class="video-card"><div class="video-cover"><b>▶</b><span>${v.platform}</span></div><div class="video-body"><span class="reviewed">${v.status}</span><h3>${v.title}</h3><p>${v.author} · ${v.summary}</p><div class="video-metrics"><span>播放：${v.views}</span><span>点赞：${v.likes}</span></div><p>查询：${v.checkedOn}</p><a href="${v.url}" target="_blank" rel="noopener">打开来源 ↗</a></div></article>`).join("")}
$("#videoPlatform").onchange=e=>renderVideos(e.target.value);

function exportPayload(){return {schemaVersion:2,exportedAt:new Date().toISOString(),profile:state.profile,plans:state.plans,records:state.records}}
function downloadJson(){const blob=new Blob([JSON.stringify(exportPayload(),null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`衡燃减脂数据-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url)}
$("#exportData").onclick=downloadJson;$("#downloadBackup").onclick=downloadJson;$("#openSettings").onclick=()=>$("#syncDialog").showModal();
$("#importBackup").onchange=async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(!data.schemaVersion||!Array.isArray(data.plans)||!Array.isArray(data.records))throw new Error("备份格式不正确");state.profile=data.profile;state.plans=data.plans;state.records=data.records;write(KEYS.profile,state.profile);write(KEYS.plans,state.plans);write(KEYS.records,state.records);location.reload()}catch(err){toast(err.message)}};
$("#deleteLocal").onclick=()=>{if(confirm("这会删除本浏览器中的档案、方案和记录，且不可撤销。确定继续？")){Object.values(KEYS).forEach(k=>localStorage.removeItem(k));location.reload()}};

function finishPendingNavigation(){const target=pendingNavigation;pendingNavigation=null;if(target){if(target==="plan")ensurePlan();showPage(target)}}
$("#saveAndLeave").onclick=()=>{const active=$(".page.active")?.id,ok=active==="profile"?saveProfileAndGenerate({navigate:false}):active==="progress"?saveProgressRecord():true;if(ok){$("#unsavedDialog").close();finishPendingNavigation()}};
$("#discardAndLeave").onclick=()=>{const active=$(".page.active")?.id;if(active==="profile"){$("#profileForm").reset();fillForm(state.profile);setProfileDirty(false);refreshCompletion()}else if(active==="progress"){$("#progressForm").reset();$("#progressForm").elements.date.value=new Date().toISOString().slice(0,10);setProgressDirty(false)}$("#unsavedDialog").close();finishPendingNavigation()};
$("#cancelLeave").onclick=()=>{pendingNavigation=null;$("#unsavedDialog").close()};
window.addEventListener("beforeunload",event=>{if(profileDirty||progressDirty){event.preventDefault();event.returnValue=""}});
document.addEventListener("keydown",event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="s"){event.preventDefault();const active=$(".page.active")?.id;if(active==="profile")saveProfileAndGenerate({navigate:false});else if(active==="progress")saveProgressRecord()}});

const syncKeys={id:"hengran_sync_id",revision:"hengran_sync_revision",code:"hengran_recovery_code"};
function syncCredentials(){return {syncId:$("#syncIdInput").value.trim(),code:$("#recoveryInput").value.trim()||sessionStorage.getItem(syncKeys.code)||""}}
function setSyncStatus(text,error=false){const el=$("#syncStatus");el.textContent=text;el.style.color=error?"var(--danger)":"var(--green)"}
async function createCloud(){try{setSyncStatus("正在本地加密…");const code=createRecoveryCode(),syncId=crypto.randomUUID(),token=await authToken(code),bundle=await encryptPayload(exportPayload(),code);const result=await syncRequest("create",{syncId,authToken:token,bundle});localStorage.setItem(syncKeys.id,syncId);localStorage.setItem(syncKeys.revision,String(result.revision));sessionStorage.setItem(syncKeys.code,code);$("#syncIdInput").value=syncId;$("#recoveryInput").value=code;const blob=new Blob([`衡燃匿名同步恢复信息\n同步ID：${syncId}\n恢复码：${code}\n\n请离线保管。遗失后无法恢复。`],{type:"text/plain;charset=utf-8"}),a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download="衡燃恢复码.txt";a.click();URL.revokeObjectURL(url);setSyncStatus("云端档案已创建，恢复码文件已下载。") }catch(e){setSyncStatus(e.message,true)}}
async function pushCloud(){try{const {syncId,code}=syncCredentials();if(!syncId||!code)throw new Error("请填写同步ID和恢复码");setSyncStatus("正在加密并上传…");const token=await authToken(code),bundle=await encryptPayload(exportPayload(),code),revision=Number(localStorage.getItem(syncKeys.revision)||0);const result=await syncRequest("update",{syncId,authToken:token,revision,bundle});localStorage.setItem(syncKeys.id,syncId);localStorage.setItem(syncKeys.revision,String(result.revision));sessionStorage.setItem(syncKeys.code,code);setSyncStatus(`上传成功，修订号 ${result.revision}`)}catch(e){setSyncStatus(e.message,true)}}
async function restoreCloud(){try{const {syncId,code}=syncCredentials();if(!syncId||!code)throw new Error("请填写同步ID和恢复码");setSyncStatus("正在下载并解密…");const token=await authToken(code),result=await syncRequest("read",{syncId,authToken:token}),data=await decryptPayload(result.bundle,code);if(!data.schemaVersion||!Array.isArray(data.plans))throw new Error("解密成功，但数据结构不受支持");state.profile=data.profile;state.plans=data.plans;state.records=data.records||[];write(KEYS.profile,state.profile);write(KEYS.plans,state.plans);write(KEYS.records,state.records);localStorage.setItem(syncKeys.id,syncId);localStorage.setItem(syncKeys.revision,String(result.revision));sessionStorage.setItem(syncKeys.code,code);setSyncStatus("恢复成功，即将刷新页面");setTimeout(()=>location.reload(),700)}catch(e){setSyncStatus(`恢复失败：${e.message}`,true)}}
async function deleteCloud(){try{const {syncId,code}=syncCredentials();if(!syncId||!code)throw new Error("请填写同步ID和恢复码");if(!confirm("确定永久删除云端密文？本地数据不会同时删除。"))return;const token=await authToken(code);await syncRequest("delete",{syncId,authToken:token});localStorage.removeItem(syncKeys.id);localStorage.removeItem(syncKeys.revision);sessionStorage.removeItem(syncKeys.code);setSyncStatus("云端档案已删除") }catch(e){setSyncStatus(e.message,true)}}
$("#createCloud").onclick=createCloud;$("#pushCloud").onclick=pushCloud;$("#restoreCloud").onclick=restoreCloud;$("#deleteCloud").onclick=deleteCloud;

function renderAll(){renderOverview();renderPlan();renderRecords();renderTrend();refreshCompletion()}
fillForm(state.profile);setProfileDirty(false);$("#progressForm").elements.date.value=new Date().toISOString().slice(0,10);setProgressDirty(false);renderEvidence();renderVideos();if(state.profile&&!currentPlan())ensurePlan();renderAll();
$("#storageMode").textContent=syncConfigured()?"可用加密同步":"仅本地存储";$(".online-dot").classList.toggle("ready",syncConfigured());
$("#syncUnavailable").hidden=syncConfigured();$("#syncOnline").hidden=!syncConfigured();$("#syncIdInput").value=localStorage.getItem(syncKeys.id)||"";
const initial=location.hash.slice(1);if(initial&&document.getElementById(initial)?.classList.contains("page"))showPage(initial);

})();
