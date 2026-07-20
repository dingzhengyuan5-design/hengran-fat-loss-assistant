const encoder=new TextEncoder(),decoder=new TextDecoder();
const b64=bytes=>btoa(String.fromCharCode(...bytes));
const fromB64=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
export function createRecoveryCode(){const bytes=crypto.getRandomValues(new Uint8Array(24));return [...bytes].map(b=>b.toString(16).padStart(2,"0")).join("").match(/.{1,8}/g).join("-")}
export async function authToken(recoveryCode){const digest=await crypto.subtle.digest("SHA-256",encoder.encode(`衡燃认证-v1:${recoveryCode.replaceAll("-","")}`));return b64(new Uint8Array(digest))}
async function derive(code,salt){
  const material=await crypto.subtle.importKey("raw",encoder.encode(code.replaceAll("-","")),"HKDF",false,["deriveKey"]);
  return crypto.subtle.deriveKey({name:"HKDF",hash:"SHA-256",salt,info:encoder.encode("衡燃匿名同步-v1")},material,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
}
export async function encryptPayload(payload,recoveryCode){const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await derive(recoveryCode,salt),cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,encoder.encode(JSON.stringify(payload)));return {ciphertext:b64(new Uint8Array(cipher)),iv:b64(iv),salt:b64(salt),schemaVersion:1}}
export async function decryptPayload(bundle,recoveryCode){const key=await derive(recoveryCode,fromB64(bundle.salt)),plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:fromB64(bundle.iv)},key,fromB64(bundle.ciphertext));return JSON.parse(decoder.decode(plain))}
export function syncConfigured(){return Boolean(window.APP_CONFIG?.syncEndpoint&&window.APP_CONFIG?.publicSiteUrl)}
export async function syncRequest(action,body){
  if(!syncConfigured())throw new Error("尚未配置云同步");
  const response=await fetch(window.APP_CONFIG.syncEndpoint,{method:"POST",headers:{"content-type":"application/json","x-site-origin":location.origin},body:JSON.stringify({action,...body})});
  if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||`同步失败（${response.status}）`)}return response.json();
}
