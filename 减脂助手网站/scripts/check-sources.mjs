import {mkdir,writeFile,readFile} from "node:fs/promises";
import {references,videos,dataMeta} from "../js/catalog.js";

const now=new Date().toISOString(),checks=[],whitelist=JSON.parse(await readFile("data/video-whitelist.json","utf8"));
for(const ref of references){try{const response=await fetch(ref.url,{method:"HEAD",redirect:"follow"});checks.push({title:ref.title,url:ref.url,status:response.status,ok:response.ok})}catch(error){checks.push({title:ref.title,url:ref.url,status:null,ok:false,error:error.message})}}
let youtube=[];
if(process.env.YOUTUBE_API_KEY&&whitelist.youtubeVideoIds.length){const endpoint=new URL("https://youtube.googleapis.com/youtube/v3/videos");endpoint.searchParams.set("part","snippet,statistics");endpoint.searchParams.set("id",whitelist.youtubeVideoIds.join(","));endpoint.searchParams.set("key",process.env.YOUTUBE_API_KEY);const response=await fetch(endpoint);if(!response.ok)throw new Error(`YouTube官方API失败：${response.status}`);youtube=(await response.json()).items.map(x=>({id:x.id,title:x.snippet.title,channel:x.snippet.channelTitle,viewCount:x.statistics.viewCount,likeCount:x.statistics.likeCount,commentCount:x.statistics.commentCount,queriedAt:now}))}
const report={generatedAt:now,dataVersion:dataMeta.version,note:"自动任务只报告差异，不自动修改健康结论。视频指标需白名单与人工审核。",sources:checks,videos:videos.map(v=>({platform:v.platform,author:v.author,url:v.url,status:v.status})),youtubeApiConfigured:Boolean(process.env.YOUTUBE_API_KEY),youtube};
await mkdir("data/待审核",{recursive:true});await writeFile("data/待审核/月度来源检查.json",JSON.stringify(report,null,2),"utf8");
if(checks.some(x=>!x.ok))console.warn("部分来源不可达；保留上次已审核快照，不发布空数据。");
