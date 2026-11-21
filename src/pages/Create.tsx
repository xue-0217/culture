import { useState, useRef, useEffect, type ChangeEvent, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Upload, Download, RefreshCw, Type, BookOpen, Copy, Share2, MessageCircle, X, Send, History, Plus, Trash2, Clock } from 'lucide-react';
import { generateFromImage, PosterResult, generateStory, StoryResult, chatWithAI, ChatMessage, ChatSession, getChatSessions, createChatSession, updateChatSession, deleteChatSession, clearAllChatSessions } from '../services/aiService';
import { MAX_CHAT_MESSAGE, MAX_IMAGE_BYTES, MAX_STORY_KEYWORDS, SUPPORTED_IMAGE_TYPES } from '../services/aiLimits';
import { findExhibit, type Exhibit } from '../data/exhibition';

const STORY_STYLES = ['童话', '历史', '纪实', '武侠', '科幻'];
type CreationMode = 'story' | 'image2poem';

function CreationIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" focusable="false">
      <path
        d="M13.1 27.4H6.9a1.7 1.7 0 0 1-1.7-1.7V5.9a1.7 1.7 0 0 1 1.7-1.7h10.6l5.5 5.6h-5.5V4.2M9.3 14h5.9m-5.9 4.6h3.6m12.7-4.7 4.1 4.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 26.7l1.8-7.5 6.5-3.5 4.2 4.2-3.2 6.1-8.7 1.7 4.8-4.8a1.25 1.25 0 1 0-.85-.85z"
        fill="currentColor"
      />
    </svg>
  );
}

function MoonPoemIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9 17C15 8 23 4 34 5c14-1 24 12 25 26 1 18-12 28-27 28C14 59 5 47 5 33c0-6 1-11 4-16ZM38 13c-3 8 3 17 11 17-5 6-14 7-19 1-5-7-1-15 8-18ZM13 39c10-4 18 3 28 0 5-1 9-1 11 1-4 1-8 3-13 4-9 2-17-3-26-2-2 0-2-2 0-3Zm8 9c7-2 12 3 22 0 2 0 3 1 1 2-5 4-17 4-23 1-2-1-2-2 0-3Z"
      />
    </svg>
  );
}

function InkstoneIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path
        fillRule="evenodd"
        d="M7 34c6-7 29-6 42-4 6 1 10 4 10 10 0 7-4 13-10 14-10 2-28 4-39-1-6-3-7-14-3-19Zm5 3c8-5 25-3 35-2 4 1 8 3 7 6-5 6-31 8-41 3-3-1-4-5-1-7Z"
      />
      <path d="M38 8c1 5 8 10 8 15 0 6-8 9-12 4-5-5 0-12 4-19ZM14 41c5-2 9-1 13 0-4 2-9 3-12 2-1-1-2-1-1-2Z" />
    </svg>
  );
}

export default function Create() {
  const [params] = useSearchParams();
  const { state } = useLocation();
  const exhibit = findExhibit(params.get('work'));
  const returnTo = exhibit ? `/exhibitions/${exhibit.id}` : state?.returnTo ?? '/';
  const initialMode = params.get('mode') === 'poem' ? 'image2poem' : 'story';
  return (
    <>
      <header className="workshop-navigation wrap">
        <Link to={returnTo} className="text-link"><ArrowLeft size={17} aria-hidden="true" /> 返回</Link>
      </header>
      <Workshop key={`${exhibit?.id ?? ''}:${initialMode}`} exhibit={exhibit} initialMode={initialMode} />
    </>
  );
}

function readImageAsDataUrl(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('无法读取图片，请重新选择。'));
    };
    reader.onerror = () => reject(new Error('无法读取图片，请重新选择。'));
    reader.readAsDataURL(file);
  });
}

function Workshop({ exhibit, initialMode }: { exhibit?: Exhibit; initialMode: CreationMode }) {
  const [mode, setMode] = useState<CreationMode>(initialMode);
  const GenerateIcon = mode === 'story' ? CreationIcon : MoonPoemIcon;
  const [keywords, setKeywords] = useState(exhibit?.keywords ?? '');
  const [selectedStyle, setSelectedStyle] = useState(STORY_STYLES[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(exhibit?.detailImage ?? null);
  const poemPreviewHint = uploadedImage
    ? '点击「生成诗词」，照片和诗句会在这里排成海报。'
    : '选一张照片，把画面里的光影写成诗。';
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReadingImage, setIsReadingImage] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [storyResult, setStoryResult] = useState<StoryResult | null>(null);
  const [posterResult, setPosterResult] = useState<PosterResult | null>(null);
  const [downloadError, setDownloadError] = useState('');

  // AI 助手相关状态
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const activeChat = useRef<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 历史记录相关状态
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  // 加载历史会话
  useEffect(() => {
    setChatSessions(getChatSessions());
  }, []);

  // 当消息变化时保存会话
  useEffect(() => {
    if (chatMessages.length > 0 && currentSessionId) {
      updateChatSession(currentSessionId, chatMessages);
      setChatSessions(getChatSessions());
    }
  }, [chatMessages, currentSessionId]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModeChange = (newMode: CreationMode) => {
    setMode(newMode);
    setGenerationError('');
    setDownloadError('');
    // 清空之前的结果
    setStoryResult(null);
    setPosterResult(null);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    e.currentTarget.value = '';
    setUploadedImage(null);
    setPosterResult(null);
    setDownloadError('');
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES || file.size === 0) {
      setGenerationError('请选择 3 MB 以内的 JPG、PNG 或 WebP 图片。');
      return;
    }
    setGenerationError('');
    setIsReadingImage(true);
    try {
      setUploadedImage(await readImageAsDataUrl(file));
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : '无法读取图片，请重新选择。');
    } finally {
      setIsReadingImage(false);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating || isReadingImage) return;
    setGenerationError('');
    setDownloadError('');
    setIsGenerating(true);
    setStoryResult(null);
    setPosterResult(null);

    try {
      if (mode === 'story') {
        const res = await generateStory(keywords, selectedStyle);
        setStoryResult(res);
      } else if (uploadedImage) {
        let imageUrl = uploadedImage;
        if (uploadedImage === exhibit?.detailImage) {
          const response = await fetch(exhibit.detailImage);
          if (!response.ok) throw new Error('展品图片暂时无法读取，请重试或上传自己的照片。');
          imageUrl = await readImageAsDataUrl(await response.blob());
        }
        const result = await generateFromImage(imageUrl);
        setPosterResult({ ...result, imageUrl: uploadedImage });
      }
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : '创作失败，请重试。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!posterResult) return;
    setDownloadError('');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution for poster
    canvas.width = 1080;
    canvas.height = 1920;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = posterResult.imageUrl;

    try {
      await img.decode();
    } catch {
      setDownloadError('海报图片加载失败，请重新生成后再试。');
      return;
    }

    // Draw cover image (cover aspect ratio)
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // Draw gradient overlay for text readability
    const gradient = ctx.createLinearGradient(canvas.width, 0, 0, 0);
    gradient.addColorStop(0, 'rgba(0,0,0,0.85)');
    gradient.addColorStop(0.4, 'rgba(0,0,0,0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Text (Vertical layout simulation)
    ctx.fillStyle = '#F9F9F6';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let currentX = canvas.width - 150;
    const startY = 200;

    // Title
    ctx.font = 'bold 90px "Noto Serif SC", serif';
    for (let i = 0; i < posterResult.title.length; i++) {
      ctx.fillText(posterResult.title[i], currentX, startY + i * 110);
    }

    // Poem
    currentX -= 180;
    ctx.font = '50px "Noto Serif SC", serif';
    posterResult.poem.forEach((line) => {
      for (let i = 0; i < line.length; i++) {
        ctx.fillText(line[i], currentX, startY + 150 + i * 80);
      }
      currentX -= 100;
    });

    // Footer / Watermark
    ctx.font = '30px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(249, 249, 246, 0.5)';
    ctx.textAlign = 'left';
    ctx.fillText('文织万象', 80, canvas.height - 80);

    // Trigger download
    const link = document.createElement('a');
    link.download = `文织万象-诗词海报-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyStory = () => {
    if (!storyResult) return;
    navigator.clipboard.writeText(`${storyResult.title}\n\n${storyResult.content}`);
  };

  const handleDownloadStory = () => {
    if (!storyResult) return;
    const text = new Blob([`${storyResult.title}\n\n${storyResult.content}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(text);
    const link = document.createElement('a');
    link.download = `文织万象-故事-${Date.now()}.txt`;
    link.href = url;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // 聊天功能
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    setChatError('');

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput.trim()
    };

    // 如果是新会话，创建会话
    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession = createChatSession(userMessage.content);
      sessionId = newSession.id;
      activeChat.current = sessionId;
      setCurrentSessionId(sessionId);
      setChatSessions(getChatSessions());
    }

    const pendingMessages = [...chatMessages, userMessage];
    setChatMessages(pendingMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await chatWithAI(pendingMessages);
      const completedMessages: ChatMessage[] = [...pendingMessages, { role: 'assistant', content: response }];
      if (activeChat.current === sessionId) {
        setChatMessages(completedMessages);
      } else if (sessionId) {
        updateChatSession(sessionId, completedMessages);
        setChatSessions(getChatSessions());
      }
    } catch (error) {
      if (activeChat.current === sessionId) {
        setChatMessages(chatMessages);
        if (sessionId) updateChatSession(sessionId, chatMessages);
        setChatSessions(getChatSessions());
        setChatInput(userMessage.content);
        setChatError(error instanceof Error ? error.message : '发送失败，请重试。');
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  // 开始新对话
  const handleNewChat = () => {
    activeChat.current = null;
    setChatError('');
    setChatMessages([]);
    setCurrentSessionId(null);
    setChatInput('');
  };

  // 切换到指定会话
  const handleSelectSession = (session: ChatSession) => {
    activeChat.current = session.id;
    setChatError('');
    setCurrentSessionId(session.id);
    setChatMessages(session.messages);
    setShowHistory(false);
  };

  // 删除会话
  const handleDeleteSession = (sessionId: string, e: MouseEvent) => {
    e.stopPropagation();
    deleteChatSession(sessionId);
    const updatedSessions = getChatSessions();
    setChatSessions(updatedSessions);

    // 如果删除的是当前会话，开始新对话
    if (sessionId === currentSessionId) {
      handleNewChat();
    }
  };

  // 清空所有历史
  const handleClearAll = () => {
    if (window.confirm('确定要清空所有聊天记录吗？此操作不可恢复。')) {
      clearAllChatSessions();
      setChatSessions([]);
      handleNewChat();
    }
  };

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  return (
    <div className="wrap page-shell workshop-columns grid gap-8 lg:grid-cols-[minmax(300px,1fr)_minmax(0,1.7fr)] lg:gap-12">
      {/* Left Panel: Controls */}
      <div className="min-w-0 flex flex-col gap-8">
        <header className="page-intro">
          <h1>创作工坊</h1>
          <p>输入关键词写故事，或上传一张照片作诗。</p>
          {exhibit && <Link className="text-link" to={`/exhibitions/${exhibit.id}`}>创作灵感 · {exhibit.title}</Link>}
        </header>

        <div className="paper-panel space-y-6 p-5 sm:p-7">
          {/* Mode Toggle */}
          <div className="flex gap-1 border-b border-ink/20">
            <button
              onClick={() => handleModeChange('story')}
              disabled={isGenerating || isReadingImage}
              aria-pressed={mode === 'story'}
              className={`flex-1 min-h-11 px-2 py-2 text-sm transition-colors ${
                mode === 'story' ? 'bg-moss text-paper font-medium' : 'text-ink-light hover:bg-rice hover:text-ink'
              }`}
            >
              故事生成
            </button>
            <button
              onClick={() => handleModeChange('image2poem')}
              disabled={isGenerating || isReadingImage}
              aria-pressed={mode === 'image2poem'}
              className={`flex-1 min-h-11 px-2 py-2 text-sm transition-colors ${
                mode === 'image2poem' ? 'bg-moss text-paper font-medium' : 'text-ink-light hover:bg-rice hover:text-ink'
              }`}
            >
              看图作诗
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'story' ? (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="story-keywords" className="block text-sm font-medium mb-3 tracking-widest text-ink flex items-center gap-2">
                    <Type className="w-4 h-4" /> 关键词
                  </label>
                  <textarea
                    id="story-keywords"
                    maxLength={MAX_STORY_KEYWORDS}
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="例如：京剧 + 少年 + 成长"
                    className="w-full h-32 p-4 bg-rice/70 border border-ink/20 focus:border-moss resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3 tracking-widest text-ink flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> 故事风格
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {STORY_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        aria-pressed={selectedStyle === style}
                        className={`min-h-11 py-2 px-2 border text-sm transition-colors ${
                          selectedStyle === style
                            ? 'border-moss bg-moss/10 text-moss font-medium'
                            : 'border-ink/15 text-ink-light hover:border-moss hover:bg-rice'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="image2poem"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-3 tracking-widest text-ink flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> {uploadedImage === exhibit?.detailImage ? '使用展品图片' : '上传照片'}
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept={SUPPORTED_IMAGE_TYPES.join(',')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isGenerating || isReadingImage}
                    className="w-full h-48 border border-dashed border-ink/35 flex flex-col items-center justify-center hover:border-moss hover:bg-moss/5 transition-colors relative overflow-hidden"
                  >
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                    ) : null}
                    <span className="relative flex flex-col items-center text-ink-light">
                      <Upload className="w-8 h-8 mb-4" />
                      <span className="font-medium tracking-widest mb-2">{isReadingImage ? '读取图片中…' : uploadedImage ? '点击更换图片' : '点击上传照片'}</span>
                      <span className="text-xs">JPG、PNG 或 WebP，最大 3 MB</span>
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isReadingImage || (mode === 'story' ? !keywords.trim() : !uploadedImage)}
            className="w-full min-h-12 py-3 bg-ink text-paper flex items-center justify-center gap-2 hover:bg-moss transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                创作中...
              </>
            ) : (
              <>
                <GenerateIcon className="w-5 h-5" />
                {mode === 'story' ? '生成故事' : '生成诗词'}
              </>
            )}
          </button>
          {generationError && <p role="alert" className="text-sm text-china-red">{generationError}</p>}
        </div>
      </div>

      {/* Right Panel: Results */}
      <div className="paper-panel min-w-0 min-h-72 lg:min-h-[660px] p-5 sm:p-8 flex flex-col relative">
        <h2 className="pb-4 mb-4 border-b border-ink/20 text-xl font-extrabold text-moss">
          {mode === 'story' ? '故事预览' : '诗词海报预览'}
        </h2>
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
          {!storyResult && !posterResult && !isGenerating ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-52 lg:min-h-[470px] flex flex-col items-center justify-center text-ink-light text-center"
            >
              <BookOpen className="w-16 h-16 mb-4 stroke-1" />
              <p>{mode === 'story' ? '从几个关键词开始，写成的故事会在这里展开。' : poemPreviewHint}</p>
            </motion.div>
          ) : isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-rice rounded-full"></div>
                <div className="absolute inset-0 border-4 border-china-red rounded-full border-t-transparent animate-spin"></div>
                <GenerateIcon className="absolute inset-0 m-auto w-8 h-8 text-china-red animate-pulse" />
              </div>
              <p className="font-serif tracking-widest text-ink animate-pulse">
                {mode === 'story' ? '正在写故事…' : '正在看图作诗…'}
              </p>
            </motion.div>
          ) : storyResult ? (
            <motion.div
              key="story"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl"
            >
              {/* Story Display */}
              <div className="bg-rice/50 p-4 sm:p-8 border border-ink/15 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-serif font-bold text-ink">{storyResult.title}</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-china-red/10 text-china-red text-xs tracking-widest rounded-full">
                      {storyResult.style}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {storyResult.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-ink/5 text-ink-light text-xs tracking-widest rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-ink leading-relaxed whitespace-pre-wrap font-serif">
                    {storyResult.content}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleCopyStory}
                  className="px-6 py-3 bg-ink text-rice rounded-full font-serif tracking-widest flex items-center justify-center gap-2 hover:bg-china-red transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  复制故事
                </button>
                <button onClick={handleDownloadStory} className="text-link">
                  <Download size={17} aria-hidden="true" /> 下载故事
                </button>
              </div>
            </motion.div>
          ) : posterResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              {/* Poster Preview */}
              <div className="relative w-full max-w-[400px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl mb-8 group">
                <img
                  src={posterResult.imageUrl}
                  alt={posterResult.title}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/30 to-transparent pointer-events-none" />

                {/* Vertical Text Layout */}
                <div
                  className="absolute top-12 right-8 bottom-12 flex flex-row-reverse gap-6 text-rice font-serif pointer-events-none"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  <h2 className="text-3xl font-bold tracking-[0.3em] drop-shadow-lg">{posterResult.title}</h2>
                  <div className="flex flex-row-reverse gap-4 mt-8">
                    {posterResult.poem.map((line, i) => (
                      <p key={i} className="text-xl tracking-[0.3em] leading-relaxed drop-shadow-md">{line}</p>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 text-rice/60 text-xs tracking-widest font-sans pointer-events-none">
                  文织万象
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="px-8 py-4 bg-china-red text-white rounded-full font-serif tracking-widest text-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Download className="w-5 h-5" />
                下载高清海报
              </button>
              {downloadError && <p className="mt-3 text-sm text-china-red" role="alert">{downloadError}</p>}
            </motion.div>
          ) : null}
        </AnimatePresence>
        </div>
      </div>

      {/* 浮动AI助手 */}
      <div className="fixed bottom-5 right-5 z-50 sm:bottom-8 sm:right-8">
        {/* 聊天窗口 */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-20 right-0 w-[min(380px,calc(100vw-40px))] h-[min(500px,65dvh)] bg-paper shadow-xl border border-ink/25 flex flex-col overflow-hidden"
            >
              {/* 聊天头部 */}
              <div className="bg-moss px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <InkstoneIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-paper font-serif font-bold text-lg">创作助手</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors relative"
                    title="历史记录"
                  >
                    <History className="w-4 h-4 text-white" />
                    {chatSessions.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-china-red text-xs rounded-full flex items-center justify-center font-bold">
                        {chatSessions.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* 聊天消息区域 */}
              <div className="flex-1 flex overflow-hidden relative">
                {/* 主聊天区域 */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-rice/30">
                    {chatMessages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-ink-light opacity-60">
                        <p className="font-serif text-sm">可以请我介绍一种工艺，或帮你梳理创作思路。</p>
                        <p className="text-xs mt-2">问我关于文化创作的任何问题</p>
                      </div>
                    )}
                    {chatMessages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-china-red text-white rounded-br-sm'
                              : 'bg-white text-ink rounded-bl-sm border border-ink/10'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {isChatLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 border border-ink/10">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* 历史记录全屏覆盖层 */}
                <AnimatePresence>
                  {showHistory && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-white z-10 flex flex-col"
                    >
                      <div className="p-4 border-b border-ink/10 flex items-center justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-lg text-ink">历史记录</h4>
                          <p className="text-xs text-ink-light mt-1">
                            共 {chatSessions.length} 个对话
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleNewChat}
                            className="px-4 py-2 bg-china-red text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            新对话
                          </button>
                          {chatSessions.length > 0 && (
                            <button
                              onClick={handleClearAll}
                              className="px-4 py-2 bg-white border border-ink/10 text-ink-light hover:text-red-600 hover:border-red-300 rounded-lg transition-all flex items-center gap-2 text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              清空全部
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
                        {chatSessions.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-ink-light opacity-50">
                            <Clock className="w-16 h-16 mb-3 stroke-1" />
                            <p className="font-serif text-sm tracking-widest">暂无历史记录</p>
                            <p className="text-xs mt-2">开始一段新对话，记录会自动保存</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
                            {chatSessions.map((session) => (
                              <motion.div
                                key={session.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-4 rounded-xl border cursor-pointer transition-all group hover:shadow-md ${
                                  currentSessionId === session.id
                                    ? 'bg-china-red/5 border-china-red'
                                    : 'bg-white border-ink/10 hover:border-china-red/30'
                                }`}
                                onClick={() => handleSelectSession(session)}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-base text-ink mb-2 truncate">
                                      {session.title}
                                    </h5>
                                    <div className="flex items-center gap-3 text-xs text-ink-light mb-2">
                                      <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3" />
                                        {session.messages.length} 条消息
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(session.updatedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    {session.messages.length > 0 && (
                                      <p className="text-xs text-ink-light/70 line-clamp-2">
                                        {session.messages[session.messages.length - 1].content.slice(0, 80)}...
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={(e) => handleDeleteSession(session.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-ink-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                                    title="删除"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 聊天输入框 */}
              <div className="p-4 bg-white border-t border-ink/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    aria-label="发送给创作助手的消息"
                    maxLength={MAX_CHAT_MESSAGE}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing) void handleSendMessage();
                    }}
                    placeholder="问我关于文化创作的问题..."
                    className="flex-1 px-4 py-3 bg-rice/50 border border-ink/10 rounded-xl focus:outline-none focus:border-china-red focus:ring-1 focus:ring-china-red transition-all text-sm"
                    disabled={isChatLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    aria-label="发送消息"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="w-12 h-12 bg-china-red text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {chatError && <p role="alert" className="mt-2 text-sm text-china-red">{chatError}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 浮动AI按钮 */}
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label={isChatOpen ? '关闭创作助手' : '打开创作助手'}
          aria-expanded={isChatOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-moss hover:bg-ink transition-colors flex items-center justify-center group"
        >
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-8 h-8 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="inkstone"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <InkstoneIcon className="w-8 h-8 text-white group-hover:animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
