import {
  MAX_IMAGE_BYTES, MAX_STORY_KEYWORDS, MAX_CHAT_MESSAGE, MAX_CHAT_HISTORY,
  SUPPORTED_IMAGE_TYPES,
} from '../src/services/aiLimits';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string | ({ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } })[];
};

const styles = new Map([
  ['童话', '充满想象力和童趣，语言生动活泼'],
  ['历史', '注重历史背景和文化内涵，语言古朴典雅'],
  ['纪实', '贴近现实，语言朴实真挚'],
  ['武侠', '融合传统文化元素，语言富有江湖气息'],
  ['科幻', '将传统文化与未来科技结合'],
]);
const poemFormat = '写一首四句七言诗，并给出四字标题。只返回 JSON，格式为 {"title":"四字标题","poem":["第一句","第二句","第三句","第四句"]}。';
const maxEncodedImage = Math.ceil(MAX_IMAGE_BYTES / 3) * 4;
const maxBodyBytes = maxEncodedImage + 4096;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isText(value: unknown, maxLength = Infinity): value is string {
  return typeof value === 'string' && !!value.trim() && value.length <= maxLength;
}

async function readPayload(request: Request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    throw new ApiError(415, '请求需使用 JSON 格式。');
  }
  if (Number(request.headers.get('content-length')) > maxBodyBytes) {
    throw new ApiError(413, '图片过大，请选择 3 MB 以内的图片。');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, '请求内容为空。');

  const decoder = new TextDecoder();
  let size = 0;
  let body = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBodyBytes) {
      void reader.cancel().catch(() => {});
      throw new ApiError(413, '图片过大，请选择 3 MB 以内的图片。');
    }
    body += decoder.decode(value, { stream: true });
  }
  try {
    const payload: unknown = JSON.parse(body + decoder.decode());
    if (isObject(payload)) return payload;
  } catch {
    // An invalid JSON body is a client error.
  }
  throw new ApiError(400, '请求内容不是有效的 JSON。');
}

function validImage(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const separator = value.indexOf(',');
  const match = /^data:([^;]+);base64$/.exec(value.slice(0, separator));
  if (!match || !SUPPORTED_IMAGE_TYPES.includes(match[1])) return false;
  const data = value.slice(separator + 1);
  if (!data.length || data.length > maxEncodedImage || data.length % 4 !== 0 || /[^A-Za-z\d+/=]/.test(data)) {
    return false;
  }
  const prefix = Buffer.from(data.slice(0, 16), 'base64');
  switch (match[1]) {
    case 'image/jpeg':
      return prefix[0] === 0xff && prefix[1] === 0xd8 && prefix[2] === 0xff;
    case 'image/png':
      return prefix.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
    case 'image/webp':
      return prefix.toString('ascii', 0, 4) === 'RIFF' && prefix.toString('ascii', 8, 12) === 'WEBP';
    default:
      return false;
  }
}

function prepareTask(payload: Record<string, unknown>): {
  provider: 'qwen' | 'deepseek'; messages: Message[]; maxTokens: number; temperature: number;
} {
  switch (payload.task) {
    case 'story': {
      if (!isText(payload.keywords, MAX_STORY_KEYWORDS) || typeof payload.style !== 'string') {
        throw new ApiError(400, '请输入 1 到 500 字的故事关键词并选择风格。');
      }
      const style = styles.get(payload.style);
      if (!style) throw new ApiError(400, '请选择有效的故事风格。');
      return {
        provider: 'deepseek', maxTokens: 2400, temperature: 0.9,
        messages: [
          { role: 'system', content: '你是一位中国文化作家。写一篇500到800字的中文短篇故事，讲完整的故事并融入传统文化。只返回 JSON，包含非空字符串字段 title 和 content。' },
          { role: 'user', content: `关键词：${payload.keywords.trim()}\n风格：${payload.style}，${style}` },
        ],
      };
    }
    case 'image-poem':
      if (!validImage(payload.imageUrl)) throw new ApiError(400, '请选择 3 MB 以内的 JPG、PNG 或 WebP 图片。');
      return {
        provider: 'qwen', maxTokens: 600, temperature: 0.8,
        messages: [
          { role: 'system', content: `你是一位中国古典诗人。根据画面里可辨认的景物和气氛作诗，避免把无法确认的地点或人物当作事实。${poemFormat}` },
          { role: 'user', content: [
            { type: 'image_url', image_url: { url: payload.imageUrl } },
            { type: 'text', text: '请根据这张图片的意境创作一首诗。' },
          ] },
        ],
      };
    case 'text-poem':
      if (!isText(payload.prompt, MAX_CHAT_MESSAGE) || !isText(payload.style, 50)) {
        throw new ApiError(400, '请输入有效的描述和风格。');
      }
      return {
        provider: 'deepseek', maxTokens: 600, temperature: 0.8,
        messages: [
          { role: 'system', content: poemFormat },
          { role: 'user', content: `风格：${payload.style}\n描述：${payload.prompt}` },
        ],
      };
    case 'chat': {
      const history: unknown[] | undefined = Array.isArray(payload.messages) ? payload.messages : undefined;
      if (!history?.length || history.length > MAX_CHAT_HISTORY) throw new ApiError(400, '对话消息数量无效。');
      const messages: Message[] = history.map(message => {
        if (!isObject(message) || (message.role !== 'user' && message.role !== 'assistant') ||
          !isText(message.content, MAX_CHAT_MESSAGE)) throw new ApiError(400, '对话消息格式或长度无效。');
        return { role: message.role, content: message.content };
      });
      if (messages.at(-1)?.role !== 'user') throw new ApiError(400, '请输入要发送的问题。');
      return {
        provider: 'deepseek', maxTokens: 1000, temperature: 0.7,
        messages: [
          { role: 'system', content: '你是一位中国文化创作助手，擅长传统文化、文化创作和数字艺术。请用中文回答，明确区分事实、推测与创作建议。' },
          ...messages,
        ],
      };
    }
    default:
      throw new ApiError(400, '不支持的创作类型。');
  }
}

export async function handleCultureAI(request: Request, env: NodeJS.ProcessEnv = process.env) {
  if (request.method !== 'POST') {
    return Response.json({ error: '请使用 POST 提交创作请求。' }, { status: 405, headers: { Allow: 'POST' } });
  }
  try {
    const payload = await readPayload(request);
    const task = prepareTask(payload);
    const qwenKey = env.QWEN_API_KEY?.trim();
    const deepSeekKey = env.DEEPSEEK_API_KEY?.trim();
    const canUseQwenFallback = payload.task === 'story' || payload.task === 'chat';
    const qwen = task.provider === 'qwen' || (canUseQwenFallback && !deepSeekKey && Boolean(qwenKey));
    const name = qwen ? '千问' : 'DeepSeek';
    const key = qwen ? qwenKey : deepSeekKey;
    if (!key) throw new ApiError(503, `${name} 创作服务尚未配置，请联系站点维护者。`);
    const response = await fetch(
      qwen ? 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions' : 'https://api.deepseek.com/chat/completions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(25_000),
        body: JSON.stringify({
          model: qwen ? env.QWEN_MODEL?.trim() || 'qwen3.8-flash' : 'deepseek-flash',
          messages: task.messages,
          max_tokens: task.maxTokens,
          temperature: task.temperature,
          ...(qwen ? { enable_thinking: false } : { thinking: { type: 'disabled' } }),
          ...(payload.task === 'chat' ? {} : { response_format: { type: 'json_object' } }),
        }),
      },
    );
    if (!response.ok) {
      void response.body?.cancel().catch(() => {});
      const details = response.status === 401 || response.status === 403
        ? '，请检查服务端密钥及模型权限'
        : response.status === 429 ? '，服务繁忙或已达到模型限额' : '';
      throw new ApiError(response.status === 429 ? 429 : 502, `${name} 调用失败（HTTP ${response.status}）${details}。`);
    }

    const completion = await response.json();
    const content: unknown = completion?.choices?.[0]?.message?.content;
    if (!isText(content)) throw new ApiError(502, '模型没有返回内容，请重试。');
    if (payload.task === 'chat') return Response.json({ content });

    let result: unknown;
    try {
      result = JSON.parse(content.trim().replace(/^```(?:json)?\s*|\s*```$/gi, ''));
    } catch {
      throw new ApiError(502, '模型返回的格式异常，请重试。');
    }
    if (isObject(result) && isText(result.title)) {
      if (payload.task === 'story' && isText(result.content)) {
        return Response.json({ title: result.title.trim(), content: result.content.trim() });
      }
      if (payload.task !== 'story' && Array.isArray(result.poem) && result.poem.length === 4 &&
        result.poem.every(line => isText(line))) {
        return Response.json({ title: result.title.trim(), poem: result.poem.map(line => line.trim()) });
      }
    }
    throw new ApiError(502, '模型返回的作品不完整，请重试。');
  } catch (error) {
    if (error instanceof ApiError) return Response.json({ error: error.message }, { status: error.status });
    if (error instanceof Error && error.name === 'TimeoutError') {
      return Response.json({ error: '模型响应超时，请稍后重试。' }, { status: 504 });
    }
    return Response.json({ error: '创作服务暂时无法连接，请稍后重试。' }, { status: 502 });
  }
}

export default {
  fetch(request: Request) {
    return handleCultureAI(request);
  },
};
