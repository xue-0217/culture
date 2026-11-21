import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { Readable } from 'node:stream';
import { defineConfig, loadEnv, type Plugin, type Connect } from 'vite';
import { handleCultureAI } from './api/culture-ai';

function cultureApi(env: NodeJS.ProcessEnv): Plugin {
  const install = (server: { middlewares: Connect.Server }) => {
    server.middlewares.use('/api/culture-ai', async (req, res) => {
      const headers = new Headers();
      for (const [name, value] of Object.entries(req.headers)) {
        if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
      }
      const options: RequestInit & { duplex?: 'half' } = { method: req.method, headers };
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        options.body = Readable.toWeb(req) as unknown as BodyInit;
        options.duplex = 'half';
      }
      try {
        const response = await handleCultureAI(new Request('http://localhost/api/culture-ai', options), env);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(req.method === 'HEAD' ? undefined : await response.text());
      } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '本地创作接口暂不可用。' }));
      }
    });
  };
  return { name: 'culture-ai', configureServer: install, configurePreviewServer: install };
}

export default defineConfig(({mode}) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  return {
    envPrefix: [],
    plugins: [react(), tailwindcss(), cultureApi(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
