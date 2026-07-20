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

export const foods = 类别.flatMap((group, groupIndex) => group.names.map((name, index) => {
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

export const mealTemplates = Array.from({length:80},(_,i)=>{
  const meal = i<20?"早餐":i<50?"午餐":"晚餐";
  const isBreakfast=meal==="早餐";
  const items=isBreakfast
    ? [{foodId:breakfast[i%breakfast.length],grams:220},{foodId:"f136",grams:250},{foodId:fruits[i%fruits.length],grams:150}]
    : [{foodId:staples[i%staples.length],grams:180},{foodId:proteins[i%proteins.length],grams:150},{foodId:vegetables[i%vegetables.length],grams:250}];
  return {id:`m${String(i+1).padStart(3,"0")}`,name:`${meal}模板 ${i+1}`,meal,items,method:isBreakfast?"主食加热；搭配蛋白与水果；无额外加糖。":"主食称熟重；蛋白少油烹调；蔬菜快炒或焯拌。",maxMinutes:i%3===0?10:25,budget:i%4===0?"medium":"low",source:"国家卫健委成人肥胖食养指南菜单结构，按食物交换原则组合",verifiedOn:核验日期,reviewStatus:"待营养专业逐套审核"};
});

export const references = [
  {title:"成人肥胖食养指南（2024年版）",org:"国家卫生健康委员会",note:"提供肥胖人群食养原则、能量分级菜单与食物交换思路。",url:"https://www.nhc.gov.cn/sps/c100088/202402/9ba512ba8e314a47a181db11d2fa188d/files/1743476135429_97340.pdf"},
  {title:"肥胖症诊疗指南（2024年版）",org:"国家卫生健康委员会",note:"用于中国成人BMI分类与风险边界。",url:"https://www.nhc.gov.cn/wjw/c100378/202410/bcf804e19e0c4246b5aea6cd338b55e1.shtml"},
  {title:"中国居民膳食指南（2022）",org:"中国营养学会",note:"用于食物多样性、谷薯、蔬果与平衡膳食结构。",url:"https://dg.cnsoc.org/article/04/J4-AsD_DR3OLQMnHG0-jZA.html"},
  {title:"WHO身体活动与久坐行为指南",org:"世界卫生组织",note:"成人每周有氧活动与肌力活动的公共健康建议。",url:"https://www.who.int/publications/i/item/9789240015128"},
  {title:"ACSM减重与体重反弹预防立场文件",org:"American College of Sports Medicine",note:"体力活动剂量与体重管理的经典立场文件。",url:"https://pubmed.ncbi.nlm.nih.gov/19127177/"},
  {title:"FoodData Central 下载与数据说明",org:"USDA",note:"部分食物营养参考值及每100克换算规则。",url:"https://fdc.nal.usda.gov/download-datasets/"},
  {title:"蛋白质摄入与抗阻训练荟萃分析",org:"British Journal of Sports Medicine",note:"支持抗阻训练人群蛋白质摄入的参考区间；不是越高越好。",url:"https://pubmed.ncbi.nlm.nih.gov/28698222/"},
  {title:"饮食与运动对体重及瘦体重影响的随机试验",org:"New England Journal of Medicine",note:"说明能量限制结合运动对体重组成和体能的影响。",url:"https://pubmed.ncbi.nlm.nih.gov/28514618/"}
];

export const videos = [
  {platform:"YouTube",author:"Jeff Nippard",title:"科学减脂的训练与营养框架",url:"https://www.youtube.com/@JeffNippard",views:"频道数据待API更新",likes:"—",checkedOn:核验日期,status:"待正式API核验",summary:"可用于理解热量缺口、蛋白质和抗阻训练的关系。"},
  {platform:"YouTube",author:"Renaissance Periodization",title:"减脂期如何安排训练量",url:"https://www.youtube.com/@RenaissancePeriodization",views:"频道数据待API更新",likes:"—",checkedOn:核验日期,status:"待正式API核验",summary:"强调疲劳管理与逐步调整。"},
  {platform:"哔哩哔哩",author:"健身运动营养科普",title:"健身新手的减肥减脂完全手册",url:"https://www.bilibili.com/video/BV1AM411r7z3/",views:"约228.5万（单条公开页快照）",likes:"约12.2万",checkedOn:核验日期,status:"人工已核验",summary:"长视频梳理减脂理论；热度不等同于医学证据。"},
  {platform:"哔哩哔哩",author:"帅soserious",title:"到底哪种运动最减脂？",url:"https://www.bilibili.com/video/BV1qq4y1E7GN/",views:"约113.3万（单条公开页快照）",likes:"约4.1万",checkedOn:核验日期,status:"人工已核验",summary:"比较常见运动方式；具体训练仍需按关节与恢复能力筛选。"},
  {platform:"哔哩哔哩",author:"叔贵",title:"无跑跳减脂训练",url:"https://www.bilibili.com/video/BV1aU4y1G7ek/",views:"约395.2万（公开页快照）",likes:"约2.5万",checkedOn:核验日期,status:"人工已核验",summary:"低冲击跟练样本；“不伤膝腰”不能对所有人作绝对保证。"},
  {platform:"抖音",author:"待白名单确认",title:"高热度减脂内容样本",url:"https://www.douyin.com/search/%E7%A7%91%E5%AD%A6%E5%87%8F%E8%84%82",views:"不自动抓取",likes:"不自动抓取",checkedOn:核验日期,status:"仅人工导入",summary:"没有稳定合法公开统计接口时不自动更新。"},
  {platform:"小红书",author:"待白名单确认",title:"中式减脂餐内容样本",url:"https://www.xiaohongshu.com/explore",views:"不自动抓取",likes:"不自动抓取",checkedOn:核验日期,status:"仅人工导入",summary:"只纳入人工核验的作者、链接与查询时间。"}
];

export const dataMeta = {verifiedOn:核验日期,foodCount:foods.length,mealCount:mealTemplates.length,version:"2026.07-a",reviewStatus:"待营养专业逐条审核",disclaimer:"营养值为离线规划参考快照，尤其外卖和混合菜误差较大。正式发布前应由营养专业人员逐条审核。"};
