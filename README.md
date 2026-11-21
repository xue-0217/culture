# 文织万象

用 React 和 Vite 构建的线上展览与创作工坊。用户可以阅读展签、浏览工艺图鉴与文化专题，或带着展品图片和关键词进入工坊，生成并下载诗词海报或故事。创作助手的对话记录保存在当前浏览器。

## 本地运行

需要 Node.js 22.12 或更新版本。

```sh
npm ci
npm run dev
```

打开 http://localhost:3000。浏览展览和工艺图鉴无需 API 密钥。

## 配置 AI 创作

复制 `.env.example` 为 `.env.local`，按需填写密钥。修改后重启开发服务。

| 变量 | 用途 |
| --- | --- |
| `QWEN_API_KEY` | 阿里云百炼华北 2（北京）地域的 API 密钥。用于看图作诗，未配置 DeepSeek 密钥时也用于故事生成和创作助手 |
| `QWEN_MODEL` | 选填，默认为 `qwen3.8-flash` |
| `DEEPSEEK_API_KEY` | 故事生成与 AI 助手使用的 DeepSeek 密钥 |

看图作诗支持在工坊使用展品图片，或上传单张 3 MB 以内的 JPG、PNG 或 WebP。点击生成后，网站服务端会将图片发送给阿里云百炼。

浏览器请求本站的 `/api/culture-ai`。密钥由服务端读取。已有的本地 `VITE_QWEN_API_KEY` 和 `VITE_DEEPSEEK_API_KEY` 配置需要迁移到上表对应的变量。如果过去曾用这些前端变量发布真实密钥，请在提供商控制台轮换密钥。

## 检查与预览

```sh
npm run lint
npm run build
npm run preview
```

Vite 本地开发和预览均提供 AI 接口。使用 Vercel 时，`api/culture-ai.ts` 作为服务端函数运行，在部署环境配置同名密钥。其他静态托管需要额外部署该服务端接口。对公网启用计费模型前，应配置站点访问控制或请求配额。
