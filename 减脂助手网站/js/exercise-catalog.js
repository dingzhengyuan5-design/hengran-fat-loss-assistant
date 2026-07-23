const 动作核验日期="2026-07-23";

const 动作模式说明={
  squat:{label:"蹲",primary:["股四头肌","臀大肌"],secondary:["内收肌","核心"],visualKey:"squat",steps:["双脚稳定站立，脚尖与膝盖方向一致。","吸气并保持躯干稳定，髋膝同时屈曲下沉。","脚掌三点均匀受力，呼气站起至自然直立。"],cues:["膝盖沿脚尖方向移动","全脚掌持续接触地面","下蹲深度服从无痛和躯干稳定"],errors:["膝盖明显内扣","脚跟抬起或重心冲向脚尖","腰背失去中立位"],breathing:"下沉前吸气并建立腹压，站起越过最难点时呼气。",standard:"从正面观察膝盖不内扣；从侧面观察脚跟不抬、躯干受控。"},
  hinge:{label:"髋铰链",primary:["臀大肌","腘绳肌"],secondary:["竖脊肌","核心"],visualKey:"hinge",steps:["双脚稳定，膝盖微屈，肋骨与骨盆保持叠放。","臀部向后移动，负重贴近身体，脊柱保持自然。","臀部发力将髋向前送，回到直立但不过度后仰。"],cues:["想象用臀部向后关门","小腿尽量接近垂直","负重贴近身体移动"],errors:["把动作做成深蹲","腰椎弯曲代偿","站起时过度挺腰"],breathing:"下降前吸气建立腹压，站起接近顶端时缓慢呼气。",standard:"应主要感到臀腿后侧受力，而不是腰部锐痛或强烈挤压。"},
  push:{label:"水平推",primary:["胸大肌","肱三头肌"],secondary:["三角肌前束","核心"],visualKey:"push",steps:["肩胛稳定，手腕与前臂保持对齐。","受控下降或屈肘，肘部不要极端外展。","推离支撑面并保持躯干整体稳定。"],cues:["手腕位于肘部上方","肩膀远离耳朵","推起时身体不扭转"],errors:["肘部接近水平外张","塌腰或耸肩","借反弹完成动作"],breathing:"下降吸气，推起越过最难点时呼气。",standard:"每次重复路径一致，肩前侧无夹痛，最后几次仍能控制离心。"},
  pull:{label:"水平拉",primary:["背阔肌","菱形肌"],secondary:["斜方肌","肱二头肌"],visualKey:"pull",steps:["先建立稳定躯干和中立腕位。","肘部向后移动，肩胛自然后缩，不用耸肩抢动作。","缓慢伸肘回到起点，保持负重受控。"],cues:["用肘部带动而不是只用手拉","胸廓稳定不后仰","回程也保持张力"],errors:["耸肩拉动","躯干大幅摆动","回程直接放掉负重"],breathing:"拉向身体时呼气，受控回程时吸气。",standard:"顶端能短暂停顿，颈部放松，动作主要来自肩关节和肩胛。"},
  vertical:{label:"垂直推拉",primary:["背阔肌","三角肌"],secondary:["肱二头肌","肱三头肌","核心"],visualKey:"vertical",steps:["保持肋骨与骨盆叠放，握距允许肩部舒适。","沿垂直或略向前的路径推起或下拉。","在无痛范围内完成全程并受控返回。"],cues:["避免用腰椎后仰换取幅度","肩胛随手臂自然旋转","前臂尽量与阻力方向一致"],errors:["过度挺腰","头部前伸","用惯性启动"],breathing:"发力阶段呼气，返回阶段吸气。",standard:"动作路径平稳，肩部无夹痛，躯干不明显摆动。"},
  single:{label:"单腿",primary:["臀大肌","股四头肌"],secondary:["臀中肌","核心"],visualKey:"lunge",steps:["建立稳定站距，骨盆朝向正前方。","前侧脚掌稳定，髋膝受控屈曲。","前脚向下踩地站起，保持左右稳定。"],cues:["前膝沿脚尖方向移动","骨盆保持水平","先减小幅度再追求负重"],errors:["膝盖内扣","跨步过窄导致失衡","后脚过度发力"],breathing:"下降吸气，站起呼气。",standard:"左右两侧动作轨迹接近，前脚脚跟不抬，躯干不突然侧倒。"},
  core:{label:"核心稳定",primary:["腹横肌","腹斜肌"],secondary:["腹直肌","臀肌"],visualKey:"core",steps:["先调整肋骨与骨盆位置，保持自然呼吸。","在躯干不代偿的前提下移动四肢或抵抗外力。","到达可控终点后缓慢返回。"],cues:["动作幅度服从腰背稳定","保持呼吸而非长时间憋气","想象腰腹形成360度支撑"],errors:["腰部明显拱起或塌陷","用速度掩盖失控","颈部过度紧张"],breathing:"保持连续呼吸，在最困难阶段缓慢呼气。",standard:"腰背位置稳定、呼吸不中断，目标肌群有张力但无锐痛。"},
  carry:{label:"负重行走",primary:["握力","核心"],secondary:["斜方肌","臀腿"],visualKey:"carry",steps:["站直并建立稳定握持，肩膀自然下沉。","以短而稳定的步幅行走，躯干保持垂直。","在握力或姿态下降前安全放下负重。"],cues:["头顶向上延伸","肋骨不要外翻","步幅稳定不急促"],errors:["身体向一侧倾斜","耸肩含胸","疲劳后继续拖行"],breathing:"保持自然节律呼吸，不连续憋气。",standard:"行走路径平稳，负重不撞击身体，最后一步仍能安全控制。"},
  isolation:{label:"单关节训练",primary:["局部目标肌群"],secondary:["稳定肌群"],visualKey:"isolation",steps:["调整器械轴线和关节位置，选择可控负荷。","目标关节在稳定轨迹内完成发力。","缓慢返回，不让配重撞击。"],cues:["固定非目标关节","使用完整且无痛的活动范围","优先控制而非追求重量"],errors:["借助全身摆动","关节锁死撞击","回程失控"],breathing:"发力呼气，回程吸气。",standard:"目标肌群持续受力，轨迹重复一致，没有明显甩动。"},
  cardio:{label:"有氧与敏捷",primary:["心肺系统","下肢"],secondary:["核心","协调性"],visualKey:"cardio",steps:["先用低强度建立节奏和关节温度。","按计划维持谈话测试对应强度。","逐步减速，不突然停止。"],cues:["落地轻柔","保持可重复节奏","大基数优先低冲击版本"],errors:["一开始冲刺","疲劳后动作失控","用疼痛换取心率"],breathing:"保持有节律的自然呼吸；不能说短句时通常已超过中等强度。",standard:"强度与计划一致，关节无持续疼痛，结束后能在数分钟内逐步恢复。"},
  mobility:{label:"热身与活动度",primary:["关节活动度","姿势控制"],secondary:["稳定肌群"],visualKey:"mobility",steps:["进入轻微拉伸或活动范围，不追求疼痛。","保持稳定呼吸并缓慢增加幅度。","受控返回，不弹震。"],cues:["幅度服从当日状态","动作慢且可控","区分牵拉感与锐痛"],errors:["快速弹震","憋气硬压","在疼痛区间停留"],breathing:"全程缓慢自然呼吸。",standard:"动作后活动更轻松，不出现麻木、锐痛或不稳定感。"}
};

const 动作分组=[
  ["squat","下肢力量","徒手深蹲|箱式徒手深蹲|靠墙静蹲|相扑徒手深蹲|深蹲触椅|抱胸深蹲|高脚杯深蹲|双哑铃前蹲|哑铃相扑深蹲|壶铃高脚杯深蹲|杠铃后蹲|杠铃前蹲|安全杠深蹲|史密斯深蹲|史密斯箱式深蹲|哈克深蹲|腿举|地雷管深蹲"],
  ["hinge","髋部力量","徒手髋铰链|早安式徒手练习|臀桥|单腿臀桥|臀桥行进|青蛙泵|哑铃罗马尼亚硬拉|双哑铃硬拉|哑铃臀推|壶铃硬拉|壶铃摆动|杠铃罗马尼亚硬拉|传统硬拉|相扑硬拉|杠铃臀推|绳索拉臀|器械腿弯举|健身球腿弯举"],
  ["push","胸部与推力","墙壁俯卧撑|高位俯卧撑|跪姿俯卧撑|标准俯卧撑|窄距俯卧撑|宽距俯卧撑|肩胛俯卧撑|暂停俯卧撑|下斜俯卧撑|地板哑铃卧推|哑铃卧推|上斜哑铃卧推|哑铃飞鸟|弹力带胸推|弹力带夹胸|杠铃卧推|上斜杠铃卧推|窄握杠铃卧推|史密斯卧推|器械推胸|蝴蝶机夹胸|绳索夹胸"],
  ["pull","背部与拉力","毛巾等长划船|桌边反向划船|低杠反向划船|门框划船|弹力带划船|弹力带面拉|单臂哑铃划船|双臂哑铃划船|胸托哑铃划船|俯卧哑铃划船|杠铃俯身划船|潘德雷划船|T杠划船|地雷管单臂划船|坐姿绳索划船|宽握坐姿划船|器械高位划船|器械低位划船|反向飞鸟|绳索面拉|TRX划船|胸托器械划船"],
  ["vertical","垂直推拉","墙壁滑动|跪姿弹力带下拉|弹力带直臂下压|悬垂肩胛下沉|辅助引体向上|反手引体向上|正手引体向上|高位下拉|中立握下拉|反手高位下拉|直臂下压|单臂高位下拉|半跪姿哑铃推举|坐姿哑铃推举|阿诺德推举|站姿杠铃推举|地雷管推举|器械肩推"],
  ["single","单腿与稳定","扶墙分腿蹲|扶墙反向箭步蹲|静态分腿蹲|反向箭步蹲|前向箭步蹲|侧向箭步蹲|行走箭步蹲|保加利亚分腿蹲|低台阶踏步|高台阶踏步|侧向台阶踏步|台阶下放|单腿坐站|辅助单腿深蹲|手枪深蹲退阶|单腿罗马尼亚硬拉徒手|哑铃单腿罗马尼亚硬拉|单腿腿举|滑盘反向箭步蹲|交叉后撤箭步蹲"],
  ["core","核心训练","仰卧腹式呼吸|骨盆后倾练习|死虫|死虫脚跟点地|死虫弹力带版|鸟狗|鸟狗划船|前臂平板支撑|高位平板支撑|膝支撑平板|侧桥屈膝版|侧桥|侧桥抬腿|仰卧交替抬腿|仰卧屈膝抬腿|反向卷腹|卷腹|健身球卷腹|熊爬静止|熊爬前后移动|Pallof抗旋转|半跪姿Pallof推|绳索伐木|绳索反向伐木|农夫行走核心版|悬垂举膝|健腹轮跪姿|仰卧触踝|登山者慢速版|平板支撑肩碰"],
  ["carry","负重与全身","原地高抬腿慢走|农夫行走|单侧提重行走|前抱式负重行走|双壶铃架式行走|过顶负重行走|雪橇推行|雪橇后拖|低台阶连续踏步|沙袋熊抱行走|行李箱提重踏步|战绳交替波浪"],
  ["isolation","局部强化","徒手提踵|单腿提踵|坐姿提踵|器械站姿提踵|胫骨前肌抬脚|器械腿屈伸|俯卧腿弯举|坐姿腿弯举|髋外展器械|髋内收器械|弹力带侧向走|蚌式开合|侧卧髋外展|哑铃侧平举|绳索侧平举|哑铃前平举|俯身反向飞鸟|哑铃弯举|锤式弯举|杠铃弯举|绳索弯举|绳索下压|哑铃颈后臂屈伸|仰卧臂屈伸|绳索过顶臂屈伸|腕屈伸"],
  ["cardio","有氧与体能","平地快走|户外变速走|跑步机坡度走|椭圆机|固定单车|卧式单车|划船机|登阶机|游泳|水中快走|原地踏步|低冲击开合步|拳击步伐|跳绳低弹跳版|战绳双臂波浪"],
  ["mobility","热身与活动度","猫牛式|胸椎旋转|开书式旋转|墙壁胸椎伸展|肩胛绕环|弹力带拉伸肩|肩袖外旋热身|髋关节绕环|九十度髋旋转|世界最佳拉伸|跪姿髋屈肌拉伸|腘绳肌动态伸展|内收肌摇摆|踝背屈靠墙练习|小腿拉伸|儿童式呼吸|下犬式|深蹲停留扶助版|臀肌梨状肌拉伸"]
];

function 推断器械(name){
  if(/器械|史密斯|哈克|腿举|绳索|高位下拉|坐姿划船|蝴蝶机|雪橇|登阶机|椭圆机|划船机|固定单车|卧式单车/.test(name))return {equipment:["gym"],tool:"固定器械"};
  if(/杠铃|T杠|潘德雷|安全杠/.test(name))return {equipment:["gym"],tool:"杠铃"};
  if(/哑铃/.test(name))return {equipment:["home","gym"],tool:"哑铃"};
  if(/壶铃/.test(name))return {equipment:["home","gym"],tool:"壶铃"};
  if(/弹力带/.test(name))return {equipment:["home","gym"],tool:"弹力带"};
  if(/TRX/.test(name))return {equipment:["home","gym"],tool:"悬挂训练带"};
  if(/引体|悬垂|低杠/.test(name))return {equipment:["home","gym"],tool:"单杠"};
  if(/台阶|箱/.test(name))return {equipment:["none","home","gym"],tool:"稳固台阶"};
  if(/战绳/.test(name))return {equipment:["gym"],tool:"战绳"};
  if(/游泳|水中/.test(name))return {equipment:["gym"],tool:"泳池"};
  return {equipment:["none","home","gym"],tool:"徒手"};
}
function 推断难度(name){
  if(/手枪|健腹轮|悬垂|正手引体|反手引体|传统硬拉|前蹲|后蹲|过顶|高台阶|战绳|壶铃摆动/.test(name))return "进阶";
  if(/墙壁|扶墙|退阶|屈膝版|呼吸|坐站|静止|慢速|拉伸|活动|热身|平地快走/.test(name))return "入门";
  return "基础";
}
function 推断限制(pattern,name){
  const result=[];
  if(["squat","single"].includes(pattern)||/跳绳|登阶|踏步|箭步|跑步/.test(name))result.push("knee");
  if(pattern==="hinge"||/俯身|硬拉|划船机|健腹轮/.test(name))result.push("back");
  if(["push","vertical"].includes(pattern)||/侧平举|前平举|臂屈伸|战绳|悬垂|引体/.test(name))result.push("shoulder");
  return [...new Set(result)];
}

export const exerciseLibrary=动作分组.flatMap(([pattern,category,names])=>names.split("|").map(name=>{
  const guide=动作模式说明[pattern],gear=推断器械(name);
  return {name,pattern,group:pattern,category,equipment:gear.equipment,tool:gear.tool,difficulty:推断难度(name),limits:推断限制(pattern,name),primaryMuscles:guide.primary,secondaryMuscles:guide.secondary,steps:guide.steps,cues:guide.cues,errors:guide.errors,breathing:guide.breathing,standard:guide.standard,visualKey:guide.visualKey,verifiedOn:动作核验日期,source:"ACSM 2026抗阻训练原则与ACE动作库分类框架；本站中文动作说明为教学性整理",reviewStatus:"结构化教学示意，非个体动作诊断"};
})).map((exercise,index)=>({...exercise,id:`ex${String(index+1).padStart(3,"0")}`}));

for(const exercise of exerciseLibrary){
  const same=exerciseLibrary.filter(item=>item.group===exercise.group&&item.id!==exercise.id);
  const easier=same.filter(item=>item.difficulty==="入门");
  const harder=same.filter(item=>item.difficulty==="进阶");
  exercise.alternatives=[...(easier.length?easier:same).slice(0,2),...(harder.length?harder:same).slice(0,1)].map(item=>item.name);
}

export const exerciseLibraryCount=exerciseLibrary.length;
export const bodyweightExerciseCount=exerciseLibrary.filter(item=>item.tool==="徒手").length;
export function getExerciseByName(name){return exerciseLibrary.find(item=>item.name===name)}
export function exerciseById(id){return exerciseLibrary.find(item=>item.id===id)}
