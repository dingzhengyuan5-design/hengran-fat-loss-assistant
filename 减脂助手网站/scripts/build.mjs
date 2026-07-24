import {readFile,writeFile} from "node:fs/promises";

const 根目录=new URL("../",import.meta.url);
const 文件=["js/catalog.js","js/curated-exercise-guides.js","js/exercise-catalog.js","js/motion-catalog.js","js/recipe-catalog.js","js/external-food-catalog.js","js/single-food-catalog.js","js/engine.js","js/crypto-sync.js","js/app.js"];
const 内容=[];

for(const 路径 of 文件){
  let 代码=await readFile(new URL(路径,根目录),"utf8");
  代码=代码
    .replace(/^import .*?;\s*$/gm,"")
    .replace(/^export\s+async\s+function\s+/gm,"async function ")
    .replace(/^export\s+(?=(const|let|var|function|class)\b)/gm,"")
    .replace(/^export\s*\{[^}]+\};?\s*$/gm,"");
  内容.push(`\n/* 来源：${路径} */\n${代码.trim()}\n`);
}

const 头部=`/* 衡燃减脂助手浏览器发布包\n * 此文件由 scripts/build.mjs 自动生成，请勿直接编辑。\n * 生成时间不写入文件，以保证构建结果可复现。\n */\n(()=>{\n"use strict";\n`;
const 尾部="\n})();\n";
await writeFile(new URL("js/app.bundle.js",根目录),头部+内容.join("")+尾部,"utf8");
console.log("构建完成：js/app.bundle.js（支持 file:// 与 HTTP）");
