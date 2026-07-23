import {exerciseLibrary} from "./exercise-catalog.js";

const 复杂模式=new Set(["squat","hinge","push","lunge"]);

export const motionExercises=exerciseLibrary.filter(exercise=>exercise.motionApproved&&exercise.motionKey).map(exercise=>({
  exerciseId:exercise.id,name:exercise.name,visualKey:exercise.motionKey,
  mode:复杂模式.has(exercise.motionKey)?"multi-angle":"single-angle",
  fps:36,duration:复杂模式.has(exercise.motionKey)?9:4.5,
  status:"拟真人动画已通过轨迹初审",reviewStatus:"动作步骤已逐项复核，动画仍不替代现场教练判断"
}));

export const motionExerciseIds=new Set(motionExercises.map(item=>item.exerciseId));
export const motionExerciseCount=motionExercises.length;
export function getMotion(exerciseId){return motionExercises.find(item=>item.exerciseId===exerciseId)}
