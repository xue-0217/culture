import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { mockFeed, featuredFeed } from '../data/mockData';

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  // 合并所有帖子数据
  const allPosts = [...mockFeed, ...featuredFeed];
  const post = allPosts.find(p => p.id === postId);

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; user: string; content: string; time: string }>>([]);

  // 从 localStorage 读取点赞和收藏状态
  useEffect(() => {
    if (!postId) return;
    const savedLikes = JSON.parse(localStorage.getItem('likes') || '{}');
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    setLiked(savedLikes[postId] || false);
    setBookmarked(savedBookmarks[postId] || false);
  }, [postId]);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

    // 保存到 localStorage
    const likes = JSON.parse(localStorage.getItem('likes') || '{}');
    likes[postId || '1'] = newLiked;
    localStorage.setItem('likes', JSON.stringify(likes));
  };

  const handleBookmark = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);

    // 保存到 localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    bookmarks[postId || '1'] = newBookmarked;
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  const handleComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      user: '我',
      content: commentText,
      time: '刚刚'
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

  if (!post) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <p className="text-ink-light">帖子不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-ink-light hover:text-china-red transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：图片 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-ink/5 overflow-hidden"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full aspect-[4/3] object-cover"
              />
            </motion.div>
          </div>

          {/* 右侧：详情 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-ink/5 p-6"
            >
              <h1 className="text-2xl font-serif font-bold mb-4">{post.title}</h1>
              <p className="text-ink-light leading-relaxed mb-6">{post.description}</p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-china-red/10 text-china-red text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 创作者信息 */}
              <div className="flex items-center gap-3 pt-4 border-t border-ink/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-china-red to-gold flex items-center justify-center text-rice font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-xs text-ink-light">创作者</p>
                </div>
              </div>
            </motion.div>

            {/* 统计信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-ink/5 p-6"
            >
              <div className="flex items-center justify-around text-center">
                <div className="flex flex-col items-center gap-1">
                  <Eye className="w-5 h-5 text-ink-light" />
                  <span className="text-sm font-medium">{post.views || 0}</span>
                  <span className="text-xs text-ink-light">浏览</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Heart className="w-5 h-5 text-ink-light" />
                  <span className="text-sm font-medium">{likeCount}</span>
                  <span className="text-xs text-ink-light">点赞</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <MessageCircle className="w-5 h-5 text-ink-light" />
                  <span className="text-sm font-medium">{(post.comments || 0) + comments.length}</span>
                  <span className="text-xs text-ink-light">评论</span>
                </div>
              </div>
            </motion.div>

            {/* 操作按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-3"
            >
              <button
                onClick={handleLike}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                  liked
                    ? 'bg-china-red/10 border-china-red text-china-red'
                    : 'border-ink/10 text-ink-light hover:border-china-red hover:text-china-red'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{liked ? '已赞' : '点赞'}</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                  bookmarked
                    ? 'bg-gold/10 border-gold text-gold'
                    : 'border-ink/10 text-ink-light hover:border-gold hover:text-gold'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                <span className="text-sm">{bookmarked ? '已收藏' : '收藏'}</span>
              </button>

              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-ink/10 text-ink-light hover:border-china-red hover:text-china-red transition-all">
                <Share2 className="w-5 h-5" />
                <span className="text-sm">分享</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* 评论区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-3xl shadow-sm border border-ink/5 p-6"
        >
          <h2 className="text-xl font-serif font-bold mb-6">评论 ({(post.comments || 0) + comments.length})</h2>

          {/* 发表评论 */}
          <div className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="发表你的评论..."
              className="w-full p-4 bg-rice/50 border border-ink/10 rounded-2xl focus:outline-none focus:border-china-red focus:ring-1 focus:ring-china-red transition-all resize-none"
              rows={3}
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="mt-3 px-6 py-2 bg-china-red text-white rounded-full text-sm tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发表评论
            </button>
          </div>

          {/* 评论列表 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-ink-light">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 stroke-1 opacity-50" />
                <p>还没有评论，快来抢沙发吧~</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-rice/30 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-china-red to-gold flex items-center justify-center text-rice font-bold flex-shrink-0">
                    {comment.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.user}</span>
                      <span className="text-xs text-ink-light">{comment.time}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
