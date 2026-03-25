import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { featuredFeed } from '../data/mockData';
import { ArrowRight, Heart, Share2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Global subtle paper/noise texture */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=100&w=2560&auto=format&fit=crop"
            alt="Chinese Traditional Architecture Background"
            className="w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rice/40 to-rice"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif font-black mb-6 leading-tight text-ink"
          >
            重塑<span className="text-china-red">传统</span><br />
            共创<span className="text-gold">数字</span>未来
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-ink-light mb-10 font-light tracking-wide max-w-2xl mx-auto"
          >
            融合前沿AI与深厚文化底蕴<br/>让每一位创作者都能参与文化的再生与传播
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/create"
              className="group relative px-8 py-4 bg-ink text-rice rounded-full overflow-hidden flex items-center gap-2 hover:bg-china-red transition-colors duration-300"
            >
              <span className="font-serif tracking-widest text-lg z-10">开始AI创作</span>
              <ArrowRight className="w-5 h-5 z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 border border-ink/20 text-ink rounded-full hover:border-ink transition-colors duration-300 font-serif tracking-widest text-lg"
            >
              探索专题
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Feed Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-1">本周精选</h2>
            <p className="text-ink-light/60 text-xs tracking-wider">EDITORS' PICKS</p>
          </div>
          <Link to="/community" className="group flex items-center gap-2 text-sm text-ink-light hover:text-china-red transition-colors">
            <span>浏览全部</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal Cards Layout */}
        <div className="space-y-5">
          {featuredFeed.map((item, index) => (
            <Link
              key={item.id}
              to={`/post/${item.id}`}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-ink/5"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image Section */}
                  <div className="w-full sm:w-[40%] aspect-[16/10] sm:aspect-auto relative overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wider ${
                        item.type === 'art' ? 'bg-china-red/90 text-white' :
                        item.type === 'history' ? 'bg-gold/90 text-white' :
                        'bg-ink/90 text-white'
                      }`}>
                        {item.type === 'art' ? '艺术' : item.type === 'history' ? '历史' : '数字'}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full sm:w-[60%] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center text-sm font-serif font-medium text-ink">
                            {item.author[0]}
                          </div>
                          <span className="text-sm text-ink-light">{item.author}</span>
                        </div>
                        <span className="text-xs text-ink-light/60">{Math.floor(Math.random() * 7 + 1)}天前</span>
                      </div>

                      <h3 className="text-lg font-serif font-bold mb-2 group-hover:text-china-red transition-colors line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-ink-light text-sm line-clamp-2 leading-relaxed mb-3">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {item.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-ink/5 text-ink-light rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-ink/5">
                      <div className="flex items-center gap-4 text-ink-light text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {item.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          分享
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-china-red text-xs font-medium tracking-wider">
                        阅读
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
