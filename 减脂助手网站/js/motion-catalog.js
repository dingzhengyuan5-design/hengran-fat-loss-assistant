// 用户已否决旧版程序化关节模型。只有通过来源核对、逐帧审核并由用户确认的
// 真人比例动画才能进入此集合；当前正式站点不展示任何未确认动画。
export const motionExercises=[];

export const motionExerciseIds=new Set(motionExercises.map(item=>item.exerciseId));
export const motionExerciseCount=motionExercises.length;
export function getMotion(exerciseId){return motionExercises.find(item=>item.exerciseId===exerciseId)}
