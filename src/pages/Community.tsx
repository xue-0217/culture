import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { mockFeed } from '../data/mockData';
import { Heart, MessageCircle, Share2, Filter, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';

const FILTERS = ['推荐', '最新', '热门', '关注'];

export default function Community() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // 从 localStorage 读取点赞状态
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('likes') || '{}');
    setLikedPosts(savedLikes);
  }, []);

  // 处理点赞
  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const newLiked = !likedPosts[postId];
    const updatedLikes = { ...likedPosts, [postId]: newLiked };
    setLikedPosts(updatedLikes);

    // 保存到 localStorage
    localStorage.setItem('likes', JSON.stringify(updatedLikes));
  };

  // 根据过滤器筛选和排序内容
  const getFilteredFeed = () => {
    let filteredFeed = [...mockFeed];

    switch (activeFilter) {
      case '最新':
        // 按ID降序（假设ID越大越新）
        filteredFeed.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case '热门':
        // 按点赞数从高到低排序
        filteredFeed.sort((a, b) => b.likes - a.likes);
        break;
      case '关注':
        // 关注功能需��用户登录，这里暂时显示空状态或全部内容
        // 为了演示，我们显示所有内容并打乱顺序
        filteredFeed = filteredFeed.slice(0, 0); // 空数组，显示空状态
        break;
      case '推荐':
      default:
        // 默认推荐排序，可以按浏览量和点赞数的综合指标
        filteredFeed.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }

    return filteredFeed;
  };

  const filteredFeed = getFilteredFeed();

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-4">文化共创社区</h1>
          <p className="text-ink-light tracking-widest text-sm">在这里，每一次分享都是对传统的致敬与创新。</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-ink/10 shadow-sm">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm tracking-widest transition-all ${
                activeFilter === filter
                  ? 'bg-ink text-rice font-medium'
                  : 'text-ink-light hover:text-ink'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFeed.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-ink-light opacity-60">
            <Bookmark className="w-16 h-16 mb-4 stroke-1" />
            <p className="font-serif text-lg tracking-widest mb-2">还没有关注任何创作者</p>
            <p className="text-sm">浏览社区内容，发现你喜欢的创作者</p>
          </div>
        ) : (
          filteredFeed.map((item, index) => (
            <Link
              key={item.id}
              to={`/post/${item.id}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-ink/5 group hover:shadow-xl transition-shadow h-full flex flex-col"
              >
              <div className="relative aspect-[4/5] overflow-hidden flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium tracking-widest text-ink">
                  {item.type === 'art' ? '艺术' : item.type === 'history' ? '历史' : '数字'}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-ink/10 flex items-center justify-center text-xs font-serif">
                      {item.author[0]}
                    </div>
                    <span className="text-sm font-medium text-ink truncate">{item.author}</span>
                  </div>
                  <button className="text-ink-light hover:text-china-red transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-china-red transition-colors line-clamp-1">{item.title}</h3>
                <p className="text-ink-light text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
                  {item.description}
                </p>

                <div className="flex items-center gap-6 border-t border-ink/5 pt-4 flex-shrink-0">
                  <button
                    onClick={(e) => handleLike(e, item.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      likedPosts[item.id]
                        ? 'text-china-red'
                        : 'text-ink-light hover:text-china-red'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPosts[item.id] ? 'fill-current' : ''}`} />
                    <span className="text-sm">{item.likes + (likedPosts[item.id] ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center gap-2 text-ink-light hover:text-ink transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{Math.floor(item.likes / 10)}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </Link>
          ))
        )}
      </div>
    </div>
  );
}
