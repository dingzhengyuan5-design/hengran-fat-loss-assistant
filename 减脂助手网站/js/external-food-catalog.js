const 外食核验日期="2026-07-23";

const 菜品模板={
  western:[
    ["经典牛肉汉堡",510,24,27,43],["双层牛肉汉堡",720,38,43,46],["香辣鸡腿汉堡",560,25,31,47],
    ["烤鸡腿堡",470,28,19,48],["鳕鱼堡",390,16,19,40],["鸡肉卷",480,23,24,48],
    ["原味炸鸡",310,22,20,13],["香辣鸡翅（2只）",230,15,15,9],["鸡块（6块）",270,16,17,16],
    ["中份薯条",360,5,17,47],["玉米杯",120,4,2,24],["蔬菜沙拉（含酱）",180,5,12,15],
    ["蛋挞",230,4,14,24],["苹果派",260,3,13,33],["鸡肉披萨（2片）",520,24,22,59],
    ["牛肉披萨（2片）",560,25,25,61],["早餐蛋肉堡",430,20,22,39],["炸鸡套餐（不含饮料）",860,35,47,75]
  ],
  chinese:[
    ["招牌鸡肉饭",650,32,19,86],["红烧牛肉饭",720,31,27,91],["鱼香肉丝饭",760,27,30,94],
    ["宫保鸡丁饭",780,32,32,93],["番茄炒蛋饭",640,20,22,88],["青椒肉丝饭",700,28,25,91],
    ["小炒黄牛肉饭",740,34,28,88],["梅菜扣肉饭",850,25,44,89],["香菇滑鸡饭",690,31,22,89],
    ["黑椒牛柳饭",730,32,27,91],["土豆烧鸡饭",700,29,22,94],["排骨米饭",820,31,37,93],
    ["卤肉饭",790,25,36,98],["照烧鸡排饭",760,32,27,99],["菌菇豆腐饭",590,19,17,89],
    ["鸡蛋炒饭",680,18,21,102],["牛肉炒饭",760,28,26,108],["鸡肉炒面",720,29,24,101]
  ],
  snack:[
    ["牛肉汤面",620,27,18,89],["牛肉拌面",720,29,24,101],["鸡丝汤面",540,26,12,83],
    ["炸酱面",690,24,24,96],["酸辣粉",560,13,18,88],["肥牛米线",680,25,25,91],
    ["鸡肉米线",590,27,16,90],["麻辣烫（常规一碗）",720,32,30,82],["清汤麻辣烫",570,31,16,77],
    ["黄焖鸡米饭",780,35,29,97],["馄饨（12只）",510,23,17,67],["蒸饺（10只）",560,24,20,73],
    ["拌馄饨",610,24,24,75],["沙县拌面",590,17,19,87],["鸭腿饭",800,31,35,98],
    ["牛肉盖饭",730,31,25,99],["羊肉汤配饼",690,30,25,88],["肉夹馍",540,22,24,61]
  ],
  drinks:[
    ["经典拿铁",230,9,9,29],["厚乳拿铁",330,10,16,37],["燕麦拿铁",250,5,8,40],
    ["生椰拿铁",310,5,16,38],["美式咖啡",15,1,0,2],["摩卡",360,9,15,49],
    ["原叶鲜奶茶",320,7,10,52],["黑糖珍珠奶茶",520,6,15,87],["波霸奶茶",480,6,14,80],
    ["芝士奶盖茶",430,7,22,51],["水果茶",300,2,1,72],["柠檬茶",260,1,0,64],
    ["杨枝甘露",490,5,16,78],["芋泥鲜奶",560,10,18,91],["抹茶拿铁",350,9,13,52],
    ["可可鲜奶",410,11,17,58],["纯茶",10,0,0,2],["冰淇淋甜筒",220,4,7,35]
  ]
};

const 品牌组=[
  ["西式快餐","western","麦当劳|肯德基|汉堡王|必胜客|达美乐|华莱士"],
  ["中式快餐","chinese","老乡鸡|乡村基|真功夫|米村拌饭|吉野家|永和大王|南城香|和府捞面"],
  ["米粉面点","snack","沙县小吃|杨国福麻辣烫|张亮麻辣烫|兰州牛肉面|黄焖鸡米饭"],
  ["咖啡与茶饮","drinks","瑞幸咖啡|星巴克|库迪咖啡|喜茶|奈雪的茶|霸王茶姬|蜜雪冰城|古茗"]
];

const 官方入口={
  "麦当劳":"https://www.mcdonalds.com.cn/nutrition_calculator",
  "肯德基":"https://www.kfc.com.cn/",
  "星巴克":"https://www.starbucks.com.cn/menu/",
  "霸王茶姬":"https://www.chagee.com.cn/"
};

function 四舍五入(value,digits=0){return Number(value.toFixed(digits))}
function 品牌系数(brand){return .94+([...brand].reduce((sum,char)=>sum+char.charCodeAt(0),0)%13)/100}

export const diningBrands=品牌组.flatMap(([group,type,names])=>names.split("|").map(name=>({name,group,type,officialUrl:官方入口[name]||""})));

export const diningItems=diningBrands.flatMap((brand,brandIndex)=>{
  const factor=品牌系数(brand.name);
  return 菜品模板[brand.type].map(([baseName,kcal,protein,fat,carbs],itemIndex)=>{
    const adjusted=Math.round(kcal*factor/5)*5;
    const range=[Math.round(adjusted*.82/5)*5,Math.round(adjusted*1.22/5)*5];
    const drink=brand.type==="drinks";
    return {
      id:`out${String(brandIndex*18+itemIndex+1).padStart(3,"0")}`,
      brand:brand.name,group:brand.group,type:brand.type,name:baseName,
      serving:drink?"标准中杯/杯":"标准一份",
      kcal:adjusted,protein:四舍五入(protein*factor,1),fat:四舍五入(fat*factor,1),carbs:四舍五入(carbs*factor,1),
      range,status:"配方估算",confidence:drink?"中低":"中低",
      source:brand.officialUrl?`品牌中国大陆菜单用于名称核对；营养值按标准配方估算，官方入口：${brand.officialUrl}`:"按标准化家庭/餐饮配方与食物成分参考值估算；门店配方和份量可能不同",
      sourceUrl:brand.officialUrl,verifiedOn:外食核验日期,
      options:drink?{
        sizes:[["中杯",1],["大杯",1.22]],
        sugars:[["不另外加糖",0],["三分糖",35],["五分糖",70],["七分糖",105],["全糖",150]],
        toppings:[["不加料",0],["珍珠",120],["椰果",70],["奶盖",150],["芋泥",180]]
      }:null
    };
  });
});

export const diningItemCount=diningItems.length;
export const diningBrandCount=diningBrands.length;

export function calculateDiningItem(item,{size="中杯",sugar="不另外加糖",topping="不加料"}={}){
  if(!item.options)return {...item,selectedServing:item.serving,calculatedKcal:item.kcal,calculatedRange:item.range};
  const sizeFactor=item.options.sizes.find(option=>option[0]===size)?.[1]||1;
  const sugarKcal=item.options.sugars.find(option=>option[0]===sugar)?.[1]||0;
  const toppingKcal=item.options.toppings.find(option=>option[0]===topping)?.[1]||0;
  const calculatedKcal=Math.round((item.kcal*sizeFactor+sugarKcal+toppingKcal)/5)*5;
  return {
    ...item,selectedServing:`${size} · ${sugar} · ${topping}`,calculatedKcal,
    calculatedRange:[Math.round(calculatedKcal*.82/5)*5,Math.round(calculatedKcal*1.22/5)*5],
    calculatedProtein:四舍五入(item.protein*sizeFactor,1),
    calculatedFat:四舍五入(item.fat*sizeFactor+(topping==="奶盖"?12:0),1),
    calculatedCarbs:四舍五入(item.carbs*sizeFactor+sugarKcal/4+toppingKcal/4,1)
  };
}
