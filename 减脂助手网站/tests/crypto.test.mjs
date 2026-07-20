import test from "node:test";
import assert from "node:assert/strict";
import {createRecoveryCode,authToken,encryptPayload,decryptPayload} from "../js/crypto-sync.js";

test("恢复码具有足够随机字节并分段展示",()=>{const code=createRecoveryCode();assert.match(code,/^[0-9a-f]{8}(?:-[0-9a-f]{8}){5}$/)});
test("密文可用正确恢复码往返且不包含明文",async()=>{const code=createRecoveryCode(),data={weight:85,preference:"不吃猪肉"},bundle=await encryptPayload(data,code);assert.ok(!bundle.ciphertext.includes("不吃猪肉"));assert.deepEqual(await decryptPayload(bundle,code),data);assert.equal((await authToken(code)).length,44)});
test("错误恢复码不能解密",async()=>{const bundle=await encryptPayload({weight:85},createRecoveryCode());await assert.rejects(()=>decryptPayload(bundle,createRecoveryCode()))});
