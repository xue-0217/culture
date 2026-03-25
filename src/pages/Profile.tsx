import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Bookmark, Heart } from 'lucide-react';
import { mockFeed } from '../data/mockData';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'posts', label: '我的作品', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'saved', label: '收藏夹', icon: <Bookmark className="w-4 h-4" /> },
  { id: 'likes', label: '赞过', icon: <Heart className="w-4 h-4" /> }
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);

  useEffect(() => {
    // 从 localStorage 读取收藏和点赞的数据
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    const likes = JSON.parse(localStorage.getItem('likes') || '{}');

    // 筛选出收藏的帖子
    const saved = mockFeed.filter(item => bookmarks[item.id]);
    setSavedPosts(saved);

    // 筛选出点赞的帖子
    const liked = mockFeed.filter(item => likes[item.id]);
    setLikedPosts(liked);
  }, []);

  const renderPosts = (posts: any[], emptyMessage: string) => {
    if (posts.length === 0) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-ink-light opacity-50">
          <ImageIcon className="w-16 h-16 mb-4 stroke-1" />
          <p className="font-serif tracking-widest">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((item, index) => (
          <Link
            key={item.id}
            to={`/post/${item.id}`}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium tracking-widest text-ink shadow-sm">
                  {item.type === 'art' ? '艺术' : item.type === 'history' ? '历史' : '数字'}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-serif font-bold mb-2 group-hover:text-china-red transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-ink-light text-sm line-clamp-2 mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-light tracking-widest">
                    {activeTab === 'likes' ? '已点赞' : '已收藏'}
                  </span>
                  <div className="flex items-center gap-3 text-ink-light">
                    <span className="flex items-center gap-1 text-sm">
                      <Heart className="w-4 h-4" />
                      {item.likes}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-ink/5 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-china-red/10 via-gold/10 to-ink/5"></div>
        
        <div className="relative z-10 w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-rice">
          <img
            src="https://picsum.photos/seed/avatar/200/200"
            alt="User Avatar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 flex-1 text-center md:text-left">
          <h1 className="text-3xl font-serif font-bold mb-2">文化探索者</h1>
          <p className="text-ink-light tracking-widest text-sm mb-6">ID: 8942 · 加入于 2026</p>
          <div className="flex items-center justify-center md:justify-start gap-8 text-center">
            <div>
              <div className="text-2xl font-serif font-bold text-ink">12</div>
              <div className="text-xs text-ink-light tracking-widest">作品</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-ink">348</div>
              <div className="text-xs text-ink-light tracking-widest">获赞</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-ink">56</div>
              <div className="text-xs text-ink-light tracking-widest">关注</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-ink/10 mb-12">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-sm tracking-widest transition-colors relative ${
              activeTab === tab.id ? 'text-china-red font-medium' : 'text-ink-light hover:text-ink'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-china-red"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'posts' && renderPosts([], '暂无作品')}
        {activeTab === 'saved' && renderPosts(savedPosts, '还没有收藏任何作品')}
        {activeTab === 'likes' && renderPosts(likedPosts, '还没有点赞任何作品')}
      </div>
    </div>
  );
}
