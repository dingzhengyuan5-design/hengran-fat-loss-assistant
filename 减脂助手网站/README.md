# 衡燃 · 在线个性化减脂助手

这是面向18～64岁一般健康成人的静态优先网站。核心方案生成、记录、导入导出可离线使用；配置 Supabase 后可启用端到端加密的匿名同步。

## 本地运行

现在可以直接双击 `index.html` 使用，所有核心交互在 `file://` 下也可运行。若要测试云同步、模拟正式部署或避免浏览器对本地文件的个别限制，建议在本目录启动静态服务器：

```powershell
python -m http.server 8000
```

浏览 `http://127.0.0.1:8000/`。

验证：

```powershell
npm run build
npm test
npm run validate
```

## 公网部署

仓库根目录的 GitHub Actions 会验证 `减脂助手网站/` 并发布到 GitHub Pages。需要在仓库 Settings → Pages 中将 Source 设为 GitHub Actions。根目录原有 `index.html` 不会被覆盖。

## Supabase 匿名密文同步

1. 新建 Supabase 项目，执行 `supabase/schema.sql`。
2. 部署 `supabase/functions/profile-sync` Edge Function。
3. 为函数设置 `ALLOWED_ORIGINS`（逗号分隔的正式来源）、`SUPABASE_URL` 与 `SUPABASE_SERVICE_ROLE_KEY`。
4. 复制 `config.example.js` 为 `config.js`，仅填写函数公开地址和正式站点地址。不要把 service role key 写进前端或 Git 仓库。
5. 正式部署时将 CORS 限定到 GitHub Pages/自定义域名。

恢复码在浏览器中派生加密密钥和独立认证令牌；服务端只保存认证令牌的哈希、密文包、同步ID和修订号。恢复码遗失无法找回。

## 数据边界

- 内置300条食物和80套餐结构满足首版交互与筛选测试，但营养值是离线参考快照，不是临床数据库。
- 单一食物也会因品种、品牌、含水与烹调改变。外卖及混合菜误差更大，界面会显示较低置信度。
- 月度工作流只生成待审核报告和PR，不自动改写健康结论；来源不可达时保留上次快照。
- YouTube指标需要 `YOUTUBE_API_KEY`，且视频ID必须先加入 `data/video-whitelist.json`；B站条目保存人工核验快照；抖音和小红书不使用隐藏接口。

## 目录

- `js/engine.js`：代谢、训练、饮食、趋势与调整规则
- `js/catalog.js`：食物、套餐、文献和视频快照
- `js/crypto-sync.js`：浏览器加密与同步请求
- `supabase/`：密文表与 Edge Function
- `tests/`：规则与数据验证

本项目不是医疗器械，不提供疾病诊断或个体化医疗处方。
