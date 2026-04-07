import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Image as ImageIcon, Upload, Download, RefreshCw, Type, BookOpen, Copy, Share2, MessageCircle, X, Send, History, Plus, Trash2, Clock } from 'lucide-react';
import { generateFromImage, PosterResult, generateStory, StoryResult, chatWithAI, ChatMessage, ChatSession, getChatSessions, createChatSession, updateChatSession, deleteChatSession, clearAllChatSessions } from '../services/aiService';

const STORY_STYLES = ['童话', '历史', '纪实', '武侠', '科幻'];

export default function Create() {
  const [mode, setMode] = useState<'story' | 'image2poem'>('story');
  const [keywords, setKeywords] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STORY_STYLES[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyResult, setStoryResult] = useState<StoryResult | null>(null);
  const [posterResult, setPosterResult] = useState<PosterResult | null>(null);

  // AI 助手相关状态
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
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

  const handleModeChange = (newMode: 'story' | 'image2poem') => {
    setMode(newMode);
    // 清空之前的结果
    setStoryResult(null);
    setPosterResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setPosterResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    // 校验输入
    if (mode === 'story') {
      if (!keywords.trim()) {
        alert('请输入关键词');
        return;
      }
    } else {
      if (!uploadedImage) {
        alert('请上传图片');
        return;
      }
    }

    setIsGenerating(true);
    setStoryResult(null);
    setPosterResult(null);

    try {
      if (mode === 'story') {
        const res = await generateStory(keywords, selectedStyle);
        setStoryResult(res);
      } else {
        const res = await generateFromImage(uploadedImage);
        setPosterResult(res);
      }
    } catch (error) {
      console.error('生成失败:', error);
      alert(`生成失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!posterResult) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution for poster
    canvas.width = 1080;
    canvas.height = 1920;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = posterResult.imageUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });

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
    ctx.fillText('AI 文化共创平台', 80, canvas.height - 80);

    // Trigger download
    const link = document.createElement('a');
    link.download = `AI_Poster_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyStory = () => {
    if (!storyResult) return;
    navigator.clipboard.writeText(`${storyResult.title}\n\n${storyResult.content}`);
  };

  // 聊天功能
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput.trim()
    };

    // 如果是新会话，创建会话
    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession = createChatSession(userMessage.content);
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
      setChatSessions(getChatSessions());
    }

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await chatWithAI([...chatMessages, userMessage]);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('聊天错误:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，发生了错误，请稍后再试。'
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 开始新对话
  const handleNewChat = () => {
    setChatMessages([]);
    setCurrentSessionId(null);
    setChatInput('');
  };

  // 切换到指定会话
  const handleSelectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setChatMessages(session.messages);
    setShowHistory(false);
  };

  // 删除会话
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
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
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-4">AI 文化创作</h1>
          <p className="text-ink-light tracking-widest text-sm leading-relaxed">
            输入关键词生成文化故事，或上传风景照赋诗，体验 AI 文化共创的魅力。
          </p>
        </div>

        <div className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-ink/5">
          {/* Mode Toggle */}
          <div className="flex p-1 bg-rice rounded-xl border border-ink/5">
            <button
              onClick={() => handleModeChange('story')}
              className={`flex-1 py-3 text-sm tracking-widest rounded-lg transition-all ${
                mode === 'story' ? 'bg-white shadow-sm font-medium text-china-red' : 'text-ink-light hover:text-ink'
              }`}
            >
              故事生成
            </button>
            <button
              onClick={() => handleModeChange('image2poem')}
              className={`flex-1 py-3 text-sm tracking-widest rounded-lg transition-all ${
                mode === 'image2poem' ? 'bg-white shadow-sm font-medium text-china-red' : 'text-ink-light hover:text-ink'
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
                  <label className="block text-sm font-medium mb-3 tracking-widest text-ink flex items-center gap-2">
                    <Type className="w-4 h-4" /> 关键词
                  </label>
                  <textarea
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="例如：京剧 + 少年 + 成长"
                    className="w-full h-32 p-4 bg-rice/50 border border-ink/10 rounded-2xl focus:outline-none focus:border-china-red focus:ring-1 focus:ring-china-red transition-all resize-none"
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
                        className={`py-2 px-2 rounded-xl border text-xs tracking-widest transition-all ${
                          selectedStyle === style
                            ? 'border-china-red bg-china-red/5 text-china-red font-medium'
                            : 'border-ink/10 text-ink-light hover:border-ink/30 hover:bg-ink/5'
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
                    <ImageIcon className="w-4 h-4" /> 上传风景照
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-ink/20 rounded-2xl flex flex-col items-center justify-center hover:border-china-red hover:bg-china-red/5 transition-all relative overflow-hidden group cursor-pointer"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {uploadedImage ? (
                      <img src={uploadedImage} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                    ) : null}
                    <div className="flex flex-col items-center text-ink-light group-hover:text-china-red transition-colors">
                      <Upload className="w-8 h-8 mb-4" />
                      <p className="font-medium tracking-widest mb-2">{uploadedImage ? '点击更换图片' : '点击上传照片'}</p>
                      <p className="text-xs opacity-70">支持 JPG, PNG 格式</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (mode === 'story' ? !keywords.trim() : !uploadedImage)}
            className="w-full py-4 bg-ink text-rice rounded-2xl font-serif tracking-widest text-lg flex items-center justify-center gap-2 hover:bg-china-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                创作中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {mode === 'story' ? '生成故事' : '生成诗词'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel: Results */}
      <div className="w-full lg:w-2/3 h-[700px] bg-white rounded-3xl shadow-sm border border-ink/5 p-8 flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-2">
          <AnimatePresence mode="wait">
          {!storyResult && !posterResult && !isGenerating ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-ink-light opacity-50"
            >
              <BookOpen className="w-16 h-16 mb-4 stroke-1" />
              <p className="font-serif tracking-widest">等待灵感降临...</p>
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
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-china-red animate-pulse" />
              </div>
              <p className="font-serif tracking-widest text-ink animate-pulse">
                {mode === 'story' ? 'AI 正在编织故事...' : 'AI正在融合图文意境...'}
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
              <div className="bg-rice/30 rounded-2xl p-8 md:p-12 border border-ink/10 mb-6">
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
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCopyStory}
                  className="px-6 py-3 bg-ink text-rice rounded-full font-serif tracking-widest flex items-center justify-center gap-2 hover:bg-china-red transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  复制故事
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
                  AI 文化共创平台
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="px-8 py-4 bg-china-red text-white rounded-full font-serif tracking-widest text-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Download className="w-5 h-5" />
                下载高清海报
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
        </div>
      </div>

      {/* 浮动AI助手 */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* 聊天窗口 */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-20 right-0 w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-ink/10 flex flex-col overflow-hidden"
            >
              {/* 聊天头部 */}
              <div className="bg-gradient-to-r from-china-red to-red-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-serif font-bold text-lg">AI创作助手</h3>
                    <p className="text-white/70 text-xs">文化共创 · 灵感启发</p>
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
                        <Sparkles className="w-12 h-12 mb-3 stroke-1" />
                        <p className="font-serif text-sm tracking-widest">你好！我是AI创作助手</p>
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
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="问我关于文化创作的问题..."
                    className="flex-1 px-4 py-3 bg-rice/50 border border-ink/10 rounded-xl focus:outline-none focus:border-china-red focus:ring-1 focus:ring-china-red transition-all text-sm"
                    disabled={isChatLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="w-12 h-12 bg-china-red text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 浮动AI按钮 */}
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 bg-gradient-to-br from-china-red to-red-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center group"
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
                key="sparkles"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="w-8 h-8 text-white group-hover:animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
