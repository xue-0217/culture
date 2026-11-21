import { MAX_CHAT_HISTORY } from './aiLimits';

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

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

async function requestAI<Result>(task: string, inputs: object): Promise<Result> {
  let response: Response;
  try {
    response = await fetch('/api/culture-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, ...inputs }),
    });
  } catch {
    throw new Error('无法连接创作服务，请检查网络后重试。');
  }
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    throw new Error(result?.error || '创作接口不可用，请检查服务配置。');
  }
  return result;
}

export async function generateStory(keywords: string, style: string): Promise<StoryResult> {
  const result = await requestAI<Pick<StoryResult, 'title' | 'content'>>('story', { keywords, style });
  return { ...result, keywords: keywords.split(/[+,，、；;\s]+/).filter(Boolean), style };
}

export async function generateFromText(prompt: string, style: string): Promise<PosterResult> {
  const result = await requestAI<Omit<PosterResult, 'imageUrl'>>('text-poem', { prompt, style });
  const seed = encodeURIComponent(prompt + style + Date.now());
  return {
    imageUrl: 'https://picsum.photos/seed/' + seed + '/1080/1920',
    title: style + '·' + result.title,
    poem: result.poem,
  };
}

export async function generateFromImage(imageUrl: string): Promise<PosterResult> {
  const result = await requestAI<Omit<PosterResult, 'imageUrl'>>('image-poem', { imageUrl });
  return { imageUrl, ...result };
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  const result = await requestAI<{ content: string }>('chat', { messages: messages.slice(-MAX_CHAT_HISTORY) });
  return result.content;
}

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
