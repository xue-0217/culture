export interface PosterResult {
  imageUrl: string;
  title: string;
  poem: string[];
}

export interface StoryResult {
  title: string;
  content: string;
  keywords: string[];
  style: string;
}

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const QWEN_API_KEY = import.meta.env.VITE_QWEN_API_KEY || '';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

const STORY_STYLES = {
  '童话': '以童话风格创作，充满想象力和童趣，语言生动活泼',
  '历史': '以历史小说风格创作，注重历史背景和文化内涵，语言古朴典雅',
  '纪实': '以纪实文学风格创作，贴近现实，语言朴实真挚',
  '武侠': '以武侠小说风格创作，融合传统文化元素，语言富有江湖气息',
  '科幻': '以科幻风格创作，将传统文化与未来科技结合，语言富有想象力'
};

async function generateStoryFromKeywords(
  keywords: string,
  style: string
): Promise<StoryResult> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY 未配置');
  }

  const stylePrompt = STORY_STYLES[style as keyof typeof STORY_STYLES] || STORY_STYLES['童话'];

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一位擅长创作中国文化故事的作家。请根据用户提供的关键词，创作一个500-800字的短篇故事。${stylePrompt}\n\n要求：\n1. 故事要有完整的起承转合\n2. 融入中国传统文化元素\n3. 语言优美，富有感染力\n4. 给故事一个合适的标题\n\n请直接返回JSON格式，不要包含任何其他文字。格式：{"title":"故事标题","content":"故事内容（500-800字）"}`
        },
        {
          role: 'user',
          content: `关键词：${keywords}\n风格：${style}`
        }
      ],
      temperature: 0.9,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API 调用失败: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '{}';

  try {
    // 去除可能的 markdown 代码块标记
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.slice(7);
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    const result = JSON.parse(cleanedContent);
    return {
      title: result.title || '文化故事',
      content: result.content || '故事生成失败',
      keywords: keywords.split(/[\s+，、]+/).filter(k => k.trim()),
      style: style
    };
  } catch (e) {
    console.error('解析 DeepSeek 响应失败:', content);
    throw new Error('AI 响应格式错误');
  }
}

async function callDeepSeekAPI(prompt: string, imageData?: string): Promise<{ title: string; poem: string[] }> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY 未配置');
  }

  const messages: Array<{ role: string; content: any }> = [
    {
      role: 'system',
      content: '你是一位精通中国古典文学的诗人。请根据用户的描述或图片，创作一首四句七言诗（绝句格式），并给出一个简洁的四字标题。请直接返回JSON格式，不要包含任何其他文字。格式：{"title":"四字标题","poem":["第一句","第二句","第三句","第四句"]}'
    }
  ];

  if (imageData) {
    // 发送图片数据
    messages.push({
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: imageData
          }
        },
        {
          type: 'text',
          text: prompt
        }
      ]
    });
  } else {
    // 只有文本
    messages.push({
      role: 'user',
      content: prompt
    });
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.8,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API 调用失败: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '{}';

  console.log('API响应:', {
    hasChoices: !!data.choices,
    choicesLength: data.choices?.length,
    hasContent: !!content,
    contentPreview: content.substring(0, 100)
  });

  try {
    // 去除可能的 markdown 代码块标记
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.slice(7);
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    console.log('清理后的内容:', cleanedContent);

    const result = JSON.parse(cleanedContent);
    return {
      title: result.title || '意境',
      poem: Array.isArray(result.poem) && result.poem.length === 4
        ? result.poem
        : ['第一句', '第二句', '第三句', '第四句']
    };
  } catch (e) {
    console.error('解析 DeepSeek 响应失败:', content);
    throw new Error('AI 响应格式错误: ' + (e instanceof Error ? e.message : '未知错误'));
  }
}

// 调用阿里千问API（用于看图作诗）
async function callQwenAPI(imageData: string): Promise<{ title: string; poem: string[] }> {
  if (!QWEN_API_KEY) {
    throw new Error('QWEN_API_KEY 未配置');
  }

  console.log('调用阿里千问API:', {
    hasApiKey: !!QWEN_API_KEY,
    apiKeyPrefix: QWEN_API_KEY.substring(0, 10) + '...',
    hasImageData: !!imageData
  });

  const messages = [
    {
      role: 'system',
      content: '你是一位精通中国古典文学的诗人。请根据用户上传的图片，创作一首四句七言诗（绝句格式），并给出一个简洁的四字标题。请直接返回JSON格式，不要包含任何其他文字。格式：{"title":"四字标题","poem":["第一句","第二句","第三句","第四句"]}'
    },
    {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: imageData
          }
        },
        {
          type: 'text',
          text: '请根据这张图片的意境创作一首诗。'
        }
      ]
    }
  ];

  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model: 'qwen-vl-max-latest',
      messages: messages,
      temperature: 0.8,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`阿里千问API 调用失败: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '{}';

  console.log('阿里千问API响应:', {
    hasChoices: !!data.choices,
    choicesLength: data.choices?.length,
    hasContent: !!content,
    contentPreview: content.substring(0, 100)
  });

  try {
    // 去除可能的 markdown 代码块标记
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.slice(7);
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    console.log('清理后的内容:', cleanedContent);

    const result = JSON.parse(cleanedContent);
    return {
      title: result.title || '意境',
      poem: Array.isArray(result.poem) && result.poem.length === 4
        ? result.poem
        : ['第一句', '第二句', '第三句', '第四句']
    };
  } catch (e) {
    console.error('解析阿里千问响应失败:', content);
    throw new Error('AI 响应格式错误: ' + (e instanceof Error ? e.message : '未知错误'));
  }
}

// 故事生成功能
export async function generateStory(
  keywords: string,
  style: string
): Promise<StoryResult> {
  return await generateStoryFromKeywords(keywords, style);
}

// 海报生成功能（保留原有功能）
export async function generateFromText(prompt: string, style: string): Promise<PosterResult> {
  const aiResult = await callDeepSeekAPI(
    `请根据以下描述创作一首诗，风格：${style}。描述：${prompt}`
  );

  const seed = encodeURIComponent(prompt + style + Date.now());
  return {
    imageUrl: `https://picsum.photos/seed/${seed}/1080/1920`,
    title: `${style}·${aiResult.title}`,
    poem: aiResult.poem
  };
}

export async function generateFromImage(imageUrl: string): Promise<PosterResult> {
  const aiResult = await callQwenAPI(imageUrl);

  return {
    imageUrl: imageUrl,
    title: aiResult.title,
    poem: aiResult.poem
  };
}

// 聊天接口
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// 会话接口
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// AI助手聊天功能
export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY 未配置');
  }

  const apiMessages = [
    {
      role: 'system',
      content: '你是一位专业的中国文化创作助手，擅长回答关于文化创作、传统文化、AI艺术创作等方面的问题。你的回答应该专业、友好、富有启发性。请用中文回答。'
    },
    ...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  ];

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API 调用失败: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '抱歉，我暂时无法回答这个问题。';
}

// 本地存储键名
const CHAT_SESSIONS_KEY = 'ai_chat_sessions';

// 获取所有会话
export function getChatSessions(): ChatSession[] {
  try {
    const stored = localStorage.getItem(CHAT_SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 保存会话列表
function saveChatSessions(sessions: ChatSession[]): void {
  try {
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('保存聊天记录失败:', error);
  }
}

// 创建新会话
export function createChatSession(firstMessage: string): ChatSession {
  const newSession: ChatSession = {
    id: Date.now().toString(),
    title: firstMessage.slice(0, 20) + (firstMessage.length > 20 ? '...' : ''),
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const sessions = getChatSessions();
  sessions.unshift(newSession);
  saveChatSessions(sessions);

  return newSession;
}

// 更新会话
export function updateChatSession(sessionId: string, messages: ChatMessage[]): void {
  const sessions = getChatSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);

  if (sessionIndex !== -1) {
    sessions[sessionIndex].messages = messages;
    sessions[sessionIndex].updatedAt = Date.now();

    // 如果有第一条用户消息，更新标题
    if (messages.length > 0 && messages[0].role === 'user') {
      sessions[sessionIndex].title = messages[0].content.slice(0, 20) + (messages[0].content.length > 20 ? '...' : '');
    }

    // 将更新的会话移到最前面
    const updatedSession = sessions.splice(sessionIndex, 1)[0];
    sessions.unshift(updatedSession);

    saveChatSessions(sessions);
  }
}

// 删除会话
export function deleteChatSession(sessionId: string): void {
  const sessions = getChatSessions().filter(s => s.id !== sessionId);
  saveChatSessions(sessions);
}

// 清空所有会话
export function clearAllChatSessions(): void {
  localStorage.removeItem(CHAT_SESSIONS_KEY);
}
