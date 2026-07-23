import {exerciseLibrary} from "./exercise-catalog.js";

const 每组动画数=8;
const 复杂模式=new Set(["squat","hinge","push","pull","vertical","single"]);
const 组内序号=new Map();

export const motionExercises=exerciseLibrary.filter(exercise=>{
  const index=组内序号.get(exercise.group)||0;
  组内序号.set(exercise.group,index+1);
  return index<每组动画数;
}).map(exercise=>({
  exerciseId:exercise.id,name:exercise.name,visualKey:exercise.visualKey,
  mode:复杂模式.has(exercise.group)?"multi-angle":"single-angle",
  fps:60,duration:复杂模式.has(exercise.group)?9:4.5,
  status:"首批程序化高帧率教学动画",reviewStatus:"动作模式已结构化；发布前仍需逐项人工复核"
}));

export const motionExerciseIds=new Set(motionExercises.map(item=>item.exerciseId));
export const motionExerciseCount=motionExercises.length;
export function getMotion(exerciseId){return motionExercises.find(item=>item.exerciseId===exerciseId)}
