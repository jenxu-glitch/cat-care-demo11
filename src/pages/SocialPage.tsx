import { useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Heart, MessageCircle, Star, Plus, X, Image, Lightbulb, ShoppingBag, AlertTriangle, HelpCircle, ChevronLeft } from 'lucide-react';
import { mockPosts } from '../data/mock';
import type { AppState } from '../App';
import type { SocialPost, PostType } from '../types';

const postTypeConfig: Record<PostType, { icon: typeof Heart; color: string; bg: string }> = {
  '晒猫': { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
  '经验': { icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50' },
  '好物': { icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  '避坑': { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  '求助': { icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
};

const filterTabs: { key: PostType | '全部'; label: string }[] = [
  { key: '全部', label: '全部' },
  { key: '晒猫', label: '晒猫' },
  { key: '求助', label: '求助' },
  { key: '经验', label: '经验' },
  { key: '好物', label: '好物' },
];

function Avatar({ name, size }: { name: string; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
  return (
    <div className={`${s} rounded-full bg-cream flex items-center justify-center text-deep-coffee/40 font-medium flex-shrink-0`}>
      {name.charAt(0)}
    </div>
  );
}

function ImageGrid({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="mb-3">
        <div className="w-full aspect-[16/10] bg-cream/60 rounded-2xl flex items-center justify-center">
          <Image size={28} className="text-coffee/30" />
        </div>
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="flex gap-1.5 mb-3">
        {images.slice(0, 2).map((_, i) => (
          <div key={i} className="flex-1 aspect-square bg-cream/60 rounded-2xl flex items-center justify-center">
            <Image size={22} className="text-coffee/30" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 mb-3">
      {images.slice(0, 3).map((_, i) => (
        <div key={i} className={`bg-cream/60 rounded-2xl flex items-center justify-center ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}>
          <Image size={i === 0 ? 32 : 18} className="text-coffee/30" />
        </div>
      ))}
    </div>
  );
}

function PostDetailPage({ post, onBack }: { post: SocialPost; onBack: () => void }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [favorited, setFavorited] = useState(post.favorited);
  const config = postTypeConfig[post.type];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      className="h-full overflow-y-auto"
    >
      <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-warm-bg/95 backdrop-blur-lg z-10 border-b border-cream/60">
        <button onClick={onBack} className="flex items-center gap-1 text-coffee/60 hover:text-deep-coffee transition-colors">
          <ChevronLeft size={18} />
          <span className="text-[13px] font-medium">返回</span>
        </button>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${config.bg} ${config.color} border-current/10`}>
          <config.icon size={11} />
          {post.type}
        </span>
        <div className="w-10" />
      </div>

      <div className="p-5">
        {/* Author */}
        <div className="flex items-center gap-2.5 mb-4">
          <Avatar name={post.author} />
          <div>
            <p className="text-[13px] font-semibold text-deep-coffee">{post.author}</p>
            <p className="text-[11px] text-coffee/40">{post.createdAt}</p>
          </div>
        </div>

        {/* Full content */}
        <p className="text-[14px] text-deep-coffee/90 leading-relaxed whitespace-pre-line mb-4">{post.content}</p>

        {/* Images */}
        <ImageGrid images={post.images} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-cream/60 rounded-full text-[11px] text-coffee/60">{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 text-coffee/50 border-t border-cream/60 pt-4">
          <button onClick={() => { setLiked(!liked); setLikes(prev => liked ? prev - 1 : prev + 1); }} className="flex items-center gap-1.5 transition-colors">
            <Heart size={17} className={liked ? 'fill-rose-400 text-rose-400' : ''} />
            <span className="text-[12px]">{likes}</span>
          </button>
          <button className="flex items-center gap-1.5">
            <MessageCircle size={17} />
            <span className="text-[12px]">{post.comments.length}</span>
          </button>
          <button onClick={() => setFavorited(!favorited)} className="flex items-center gap-1.5">
            <Star size={17} className={favorited ? 'fill-amber-400 text-amber-400' : ''} />
          </button>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-cream/60">
            <p className="text-[12px] font-medium text-coffee/45 mb-3">评论 {post.comments.length}</p>
            <div className="space-y-3">
              {post.comments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <Avatar name={c.author} size="sm" />
                  <div>
                    <span className="text-[11px] font-medium text-deep-coffee">{c.author}</span>
                    <p className="text-[12px] text-coffee/70">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PostCard({ post, onDetail }: { post: SocialPost; onDetail: () => void }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [favorited, setFavorited] = useState(post.favorited);
  const [showComments, setShowComments] = useState(false);
  const config = postTypeConfig[post.type];
  const isLong = post.content.length > 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onDetail}
      className="bg-white rounded-3xl border border-cream/80 p-4 shadow-[0_2px_16px_rgba(92,65,54,0.04)] cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={post.author} />
          <div>
            <p className="text-[13px] font-semibold text-deep-coffee">{post.author}</p>
            <p className="text-[11px] text-coffee/40">{post.createdAt}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${config.bg} ${config.color} border-current/10`}>
          <config.icon size={11} />
          {post.type}
        </span>
      </div>

      <div className="relative mb-3">
        <p className="text-[13px] text-deep-coffee/90 leading-relaxed whitespace-pre-line line-clamp-4">
          {post.content}
        </p>
        {isLong && (
          <span className="text-coffee/40 text-[12px]">……</span>
        )}
      </div>

      <ImageGrid images={post.images} />

      {post.tags.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {post.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-cream/60 rounded-full text-[11px] text-coffee/60">{tag}</span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-5 text-coffee/50" onClick={e => e.stopPropagation()}>
        <button onClick={() => { setLiked(!liked); setLikes(prev => liked ? prev - 1 : prev + 1); }} className="flex items-center gap-1.5 transition-colors">
          <Heart size={15} className={liked ? 'fill-rose-400 text-rose-400' : ''} />
          <span className="text-[11px]">{likes}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5">
          <MessageCircle size={15} />
          <span className="text-[11px]">{post.comments.length}</span>
        </button>
        <button onClick={() => setFavorited(!favorited)} className="flex items-center gap-1.5">
          <Star size={15} className={favorited ? 'fill-amber-400 text-amber-400' : ''} />
        </button>
      </div>

      <AnimatePresence>
        {showComments && post.comments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-cream/60 space-y-2.5">
              {post.comments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <Avatar name={c.author} size="sm" />
                  <div>
                    <span className="text-[11px] font-medium text-deep-coffee">{c.author}</span>
                    <p className="text-[12px] text-coffee/70">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CreatePost({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<PostType>('晒猫');
  const types: PostType[] = ['晒猫', '求助', '经验', '好物', '避坑'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-deep-coffee/30 backdrop-blur-sm" />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-[430px] w-full shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-cream/80">
          <button onClick={onClose}><X size={18} className="text-coffee/50" /></button>
          <span className="text-[14px] font-semibold text-deep-coffee">发布动态</span>
          <button disabled={!content.trim()} className="text-[14px] font-semibold text-warm-tan disabled:opacity-30">发布</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-1.5 flex-wrap">
            {types.map(t => {
              const cfg = postTypeConfig[t];
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    selectedType === t ? `${cfg.bg} ${cfg.color} border-current/10 border` : 'bg-cream/60 text-coffee/40'
                  }`}
                >
                  <cfg.icon size={11} />
                  {t}
                </button>
              );
            })}
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="分享你的养猫经验..."
            className="w-full resize-none text-[15px] leading-relaxed bg-transparent outline-none placeholder:text-coffee/30 text-deep-coffee min-h-[120px]"
            autoFocus
          />

          <button className="flex items-center gap-2 text-coffee/40 hover:text-coffee/60 transition-colors">
            <Image size={18} />
            <span className="text-[12px]">添加图片</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SocialPage({ state }: { state: AppState }) {
  const [showCreate, setShowCreate] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PostType | '全部'>('全部');
  const [detailViewPost, setDetailViewPost] = useState<SocialPost | null>(null);

  const { scrollYProgress } = useScroll({ container: state.scrollContainerRef });

  const filteredPosts = activeFilter === '全部' ? mockPosts : mockPosts.filter(p => p.type === activeFilter);

  return (
    <div className="pb-4 relative h-full">
      <AnimatePresence mode="wait">
        {detailViewPost ? (
          <PostDetailPage key="detail" post={detailViewPost} onBack={() => setDetailViewPost(null)} />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header with create button */}
            <div className="px-5 pt-4 pb-3 flex items-center justify-between">
              <div className="w-20" />
              <button
                onClick={() => setShowCreate(true)}
                className="w-9 h-9 rounded-full bg-deep-coffee text-white flex items-center justify-center shadow-sm hover:bg-deep-coffee/80 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Type filter tabs */}
            <div className="px-5 mb-4">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {filterTabs.map(tab => {
                  const active = activeFilter === tab.key;
                  const cfg = tab.key !== '全部' ? postTypeConfig[tab.key] : null;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all flex-shrink-0 ${
                        active
                          ? cfg ? `${cfg.bg} ${cfg.color} border-current/10 border` : 'bg-deep-coffee text-white'
                          : 'bg-cream/60 text-coffee/40 hover:text-coffee/50'
                      }`}
                    >
                      {cfg && <cfg.icon size={11} />}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post list */}
            <div className="relative">
              <div className="px-5 space-y-3">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} onDetail={() => setDetailViewPost(post)} />
                ))}
              </div>
              {/* Scroll progress indicator */}
              <motion.div
                className="absolute right-1 top-0 bottom-0 w-[2.5px] bg-coffee/10 rounded-full origin-top"
                style={{ scaleY: scrollYProgress }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create post modal */}
      <AnimatePresence>
        {showCreate && <CreatePost onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
}
