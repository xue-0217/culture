import { handleCultureAI } from '../api/culture-ai';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  CREATION_RATE_LIMIT: { limit(options: { key: string }): Promise<{ success: boolean }> };
  QWEN_API_KEY?: string;
  QWEN_MODEL?: string;
  DEEPSEEK_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname !== '/api/culture-ai') {
      return env.ASSETS.fetch(request);
    }

    if (request.method === 'POST') {
      const key = request.headers.get('CF-Connecting-IP') ?? 'unknown';
      const { success } = await env.CREATION_RATE_LIMIT.limit({ key });
      if (!success) {
        return Response.json(
          { error: '创作请求过于频繁，请稍后再试。' },
          { status: 429, headers: { 'Retry-After': '60' } },
        );
      }
    }

    return handleCultureAI(request, {
      QWEN_API_KEY: env.QWEN_API_KEY,
      QWEN_MODEL: env.QWEN_MODEL,
      DEEPSEEK_API_KEY: env.DEEPSEEK_API_KEY,
    });
  },
};
