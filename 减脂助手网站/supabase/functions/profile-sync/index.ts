import {createClient} from "https://esm.sh/@supabase/supabase-js@2";

const 允许来源=(Deno.env.get("ALLOWED_ORIGINS")||"").split(",").map(x=>x.trim()).filter(Boolean);
const headers=(origin:string)=>({"access-control-allow-origin":origin,"access-control-allow-headers":"content-type, x-site-origin","access-control-allow-methods":"POST, OPTIONS","vary":"Origin","content-type":"application/json; charset=utf-8"});
const reply=(origin:string,status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers:headers(origin)});
const hash=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,"0")).join("");

Deno.serve(async request=>{
  const origin=request.headers.get("origin")||"";
  if(!允许来源.includes(origin))return reply(origin||"null",403,{error:"来源未获允许"});
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:headers(origin)});
  if(request.method!=="POST")return reply(origin,405,{error:"只允许POST"});
  try{
    const url=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if(!url||!key)return reply(origin,500,{error:"服务端配置不完整"});
    const client=createClient(url,key,{auth:{persistSession:false}}),body=await request.json();
    const {action,syncId,authToken,bundle,revision}=body;
    if(!["create","read","update","delete"].includes(action)||typeof syncId!=="string"||typeof authToken!=="string")return reply(origin,400,{error:"请求参数不完整"});
    if(authToken.length>200||JSON.stringify(bundle||{}).length>2_000_000)return reply(origin,413,{error:"请求过大"});
    const ip=request.headers.get("x-forwarded-for")?.split(",")[0]||"unknown",bucket=await hash(`${ip}:${syncId}`);
    const quota=await client.rpc("consume_sync_quota",{p_bucket:bucket,p_limit:60});
    if(quota.error||quota.data!==true)return reply(origin,429,{error:"请求过于频繁，请稍后再试"});
    const authHash=await hash(authToken);
    if(action==="create"){
      if(!bundle?.ciphertext||!bundle?.iv||!bundle?.salt)return reply(origin,400,{error:"密文包不完整"});
      const created=await client.from("encrypted_profiles").insert({sync_id:syncId,auth_hash:authHash,bundle,revision:1}).select("revision,updated_at").single();
      if(created.error)return reply(origin,created.error.code==="23505"?409:500,{error:created.error.code==="23505"?"同步ID已存在":"创建失败"});
      return reply(origin,201,created.data);
    }
    const current=await client.from("encrypted_profiles").select("auth_hash,bundle,revision,updated_at").eq("sync_id",syncId).maybeSingle();
    if(current.error)return reply(origin,500,{error:"读取失败"});if(!current.data)return reply(origin,404,{error:"云端档案不存在"});if(current.data.auth_hash!==authHash)return reply(origin,401,{error:"恢复码不正确"});
    if(action==="read")return reply(origin,200,{bundle:current.data.bundle,revision:current.data.revision,updatedAt:current.data.updated_at});
    if(action==="delete"){const removed=await client.from("encrypted_profiles").delete().eq("sync_id",syncId).eq("auth_hash",authHash);return removed.error?reply(origin,500,{error:"删除失败"}):reply(origin,200,{deleted:true})}
    if(!Number.isInteger(revision)||revision!==current.data.revision)return reply(origin,409,{error:"云端版本已变化，请先恢复最新版本",currentRevision:current.data.revision});
    if(!bundle?.ciphertext||!bundle?.iv||!bundle?.salt)return reply(origin,400,{error:"密文包不完整"});
    const updated=await client.from("encrypted_profiles").update({bundle,revision:revision+1,updated_at:new Date().toISOString()}).eq("sync_id",syncId).eq("revision",revision).select("revision,updated_at").single();
    return updated.error?reply(origin,409,{error:"版本冲突，请先恢复最新版本"}):reply(origin,200,updated.data);
  }catch(error){return reply(origin,500,{error:error instanceof Error?error.message:"未知错误"})}
});
