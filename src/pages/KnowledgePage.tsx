import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle2, BookOpen, Brain, ThumbsUp, RotateCcw, ChevronDown, ChevronUp, TrendingUp, Search, X } from 'lucide-react';
import type { AppState } from '../App';
import type { KnowledgeCard, CardCategory, QuizQuestion } from '../types';

const categories: { key: CardCategory; label: string }[] = [
  { key: '医', label: '医' },
  { key: '食', label: '食' },
  { key: '行', label: '行' },
  { key: '养', label: '养' },
];

const catConfig: Record<CardCategory, { bg: string; text: string; border: string }> = {
  '医': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  '食': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  '行': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  '养': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
};

const statusPriority: Record<string, number> = { '未处理': 0, '再看看': 1, 'GET': 2 };

// ─── Card Detail (in-place expanded version) ───────────────────────

function ExpandedCardDetail({ card, onCollapse, onStatus, onQuizComplete }: {
  card: KnowledgeCard;
  onCollapse: () => void;
  onStatus: (status: 'GET' | '再看看') => void;
  onQuizComplete: () => void;
}) {
  const [quizOpen, setQuizOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const quiz: QuizQuestion | undefined = card.quizQuestions[currentQuiz];

  const handleQuizSubmit = () => {
    if (selectedAnswer === null || !quiz) return;
    const correct = selectedAnswer === quiz.answer;
    setQuizResult(correct);
    if (correct) {
      setTimeout(() => {
        if (currentQuiz < card.quizQuestions.length - 1) {
          setCurrentQuiz(prev => prev + 1);
          setSelectedAnswer(null);
          setQuizResult(null);
        } else {
          onQuizComplete();
          onStatus('GET');
        }
      }, 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="pt-5 pb-4 space-y-5">
        {/* AI Summary */}
        <div className="bg-gradient-to-r from-warm-tan/[0.04] to-cream rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={13} className="text-warm-tan" />
            <span className="text-[11px] font-medium text-coffee/45 tracking-wide uppercase">AI 总结</span>
          </div>
          <p className="text-[14px] text-deep-coffee leading-relaxed">{card.aiSummary}</p>
        </div>

        {/* Reason */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Brain size={13} className="text-blue-400" />
            <span className="text-[11px] font-medium text-coffee/45 tracking-wide uppercase">原因解释</span>
          </div>
          <p className="text-[14px] text-coffee/80 leading-relaxed">{card.reasonExplanation}</p>
        </div>

        {/* Steps */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 size={13} className="text-sage" />
            <span className="text-[11px] font-medium text-coffee/45 tracking-wide uppercase">操作建议</span>
          </div>
          <ol className="space-y-2">
            {card.operationSteps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-[13px] text-coffee/80 leading-relaxed bg-cream/40 rounded-xl p-3">
                <span className="text-warm-tan font-semibold flex-shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Risk */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle size={13} className="text-amber-500" />
            <span className="text-[11px] font-medium text-coffee/45 tracking-wide uppercase">风险判断</span>
          </div>
          <div className="space-y-1.5">
            {card.riskJudgment.map((r, i) => (
              <p key={i} className="text-[13px] text-coffee/80 leading-relaxed">{r}</p>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen size={13} className="text-coffee/40" />
            <span className="text-[11px] font-medium text-coffee/45 tracking-wide uppercase">来源</span>
          </div>
          <div className="space-y-1">
            {card.sources.map((s, i) => (
              <div key={i} className="text-[12px] text-coffee/40 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-coffee/20 flex-shrink-0" />
                <span className="text-coffee/40 text-[10px] uppercase tracking-wide">{s.type}</span>
                {s.title}
              </div>
            ))}
          </div>
        </div>

        {/* Quiz */}
        {quiz && (
          <div>
            <button
              onClick={(e) => { e.stopPropagation(); setQuizOpen(!quizOpen); }}
              className="w-full flex items-center justify-between p-3 bg-amber-50/40 rounded-xl border border-amber-100/50"
            >
              <div className="flex items-center gap-1.5">
                <Brain size={13} className="text-amber-500" />
                <span className="text-[12px] font-medium text-amber-700">
                  微测验 ({currentQuiz + 1}/{card.quizQuestions.length})
                </span>
              </div>
              {quizOpen ? <ChevronUp size={15} className="text-amber-400" /> : <ChevronDown size={15} className="text-amber-400" />}
            </button>
            <AnimatePresence>
              {quizOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 space-y-3">
                    <p className="text-[13px] text-deep-coffee font-medium">{quiz.question}</p>
                    <div className="space-y-1.5">
                      {quiz.options.map((opt, i) => {
                        const isSelected = selectedAnswer === i;
                        const isCorrect = quizResult !== null && i === quiz.answer;
                        const isWrong = quizResult !== null && isSelected && !isCorrect;
                        return (
                          <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); if (quizResult === null) setSelectedAnswer(i); }}
                            className={`w-full text-left p-2.5 rounded-lg text-[13px] transition-all ${
                              isCorrect ? 'bg-emerald-100 text-emerald-700 font-medium' :
                              isWrong ? 'bg-red-100 text-red-600' :
                              isSelected ? 'bg-amber-100 text-amber-700' :
                              'bg-cream/60 text-coffee/60 hover:bg-cream'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizResult === false && <p className="text-[12px] text-red-500">再试一次</p>}
                    {quizResult === true && <p className="text-[12px] text-emerald-600">正确</p>}
                    {quizResult === null && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleQuizSubmit(); }}
                        disabled={selectedAnswer === null}
                        className="w-full py-2 rounded-lg bg-amber-500 text-white text-[13px] font-medium disabled:opacity-30 hover:bg-amber-600 transition-colors"
                      >
                        提交
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={(e) => { e.stopPropagation(); setStatusFeedback('再看看'); onStatus('再看看'); }}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all ${
              statusFeedback === '再看看'
                ? 'bg-gray-100 text-gray-400 border border-gray-200'
                : 'border border-amber-200 text-amber-600 hover:bg-amber-50'
            }`}
          >
            <RotateCcw size={14} />
            再看看
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setStatusFeedback('GET'); onStatus('GET'); }}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all ${
              statusFeedback === 'GET'
                ? 'bg-gradient-to-r from-sage to-emerald-400 text-white'
                : 'bg-cream/60 text-coffee/60 border border-cream hover:bg-cream'
            }`}
          >
            <ThumbsUp size={14} />
            GET
          </button>
        </div>

        <button onClick={onCollapse} className="w-full text-center text-[12px] text-coffee/40 py-1">
          收起详情
        </button>
      </div>
    </motion.div>
  );
}

// ─── Knowledge Page ─────────────────────────────────────────────────

function ringSlice<T>(arr: T[], start: number, count: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < count && i < arr.length; i++) {
    result.push(arr[(start + i) % arr.length]);
  }
  return result;
}

export function KnowledgePage({ state }: { state: AppState }) {
  const [activeCategory, setActiveCategory] = useState<CardCategory>('医');
  const [expanded, setExpanded] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedListIds, setExpandedListIds] = useState<Set<string>>(new Set());
  const dragOffsetXRef = useRef(0);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const expandRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const exitXRef = useRef(0);

  const allCards = useMemo(() => state.cards, [state.cards]);

  const categoryCards = useMemo(() => {
    return allCards
      .filter(c => c.category === activeCategory)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [allCards, activeCategory]);

  const allSortedCards = useMemo(() => {
    return [...allCards].sort((a, b) => {
      const pa = statusPriority[a.status] ?? 0;
      const pb = statusPriority[b.status] ?? 0;
      if (pa !== pb) return pa - pb;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [allCards]);

  const stackCards = useMemo(() => ringSlice(categoryCards, focusIndex, 4), [categoryCards, focusIndex]);
  const focusCard = stackCards.length > 0 ? stackCards[0] : null;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allCards.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.aiSummary.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [allCards, searchQuery]);

  const handleSearchSelect = (card: KnowledgeCard) => {
    setActiveCategory(card.category);
    setFocusIndex(0);
    setSearchOpen(false);
    setSearchQuery('');
    setExpanded(false);
    setTimeout(() => {
      const el = document.getElementById(`knowledge-card-${card.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!focusCard || categoryCards.length === 0) return;
    const status = direction === 'left' ? 'GET' : '再看看';
    state.updateCardStatus(focusCard.id, status);
    setExpanded(false);
    setFocusIndex(prev => (prev + 1) % categoryCards.length);
  };

  const handleStatus = (status: 'GET' | '再看看') => {
    if (!focusCard || categoryCards.length === 0) return;
    state.updateCardStatus(focusCard.id, status);
    setExpanded(false);
    setFocusIndex(prev => (prev + 1) % categoryCards.length);
    setTimeout(() => {
      state.scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const handleListClick = (cardId: string) => {
    setExpandedListIds(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  // Stats
  const getCount = allCards.filter(c => c.status === 'GET').length;
  const reviewCount = allCards.filter(c => c.status === '再看看').length;
  const pendingCount = allCards.filter(c => c.status === '未处理').length;

  return (
    <div className="pb-6">
      {/* Search bar + category tabs area */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex gap-1.5 p-1 bg-cream/50 rounded-2xl">
            {categories.map(cat => {
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => { setActiveCategory(cat.key); setExpanded(false); setFocusIndex(0); }}
                  className={`flex-1 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    active ? 'bg-white text-deep-coffee shadow-[0_1px_4px_rgba(92,65,54,0.08)]' : 'text-coffee/40 hover:text-coffee/50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { setSearchOpen(!searchOpen); if (!searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
              searchOpen ? 'bg-deep-coffee text-white' : 'bg-cream/50 text-coffee/40 hover:text-coffee/50'
            }`}
          >
            {searchOpen ? <X size={17} /> : <Search size={17} />}
          </button>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-2">
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="搜索知识卡片..."
                  className="w-full h-10 bg-cream/40 rounded-xl px-4 text-[14px] text-deep-coffee placeholder:text-coffee/35 outline-none border border-cream/60 focus:border-warm-tan/30 transition-colors"
                />
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-white rounded-2xl border border-cream/80 shadow-[0_4px_20px_rgba(92,65,54,0.08)] overflow-hidden">
                    {searchResults.map(card => {
                      const catCfg = catConfig[card.category];
                      return (
                        <button
                          key={card.id}
                          onClick={() => handleSearchSelect(card)}
                          className="w-full text-left p-3 hover:bg-cream/40 transition-colors flex items-center gap-3 border-b border-cream/60 last:border-b-0"
                        >
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border flex-shrink-0 ${catCfg.bg} ${catCfg.text} ${catCfg.border}`}>
                            {card.category}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13px] text-deep-coffee truncate">{card.title}</p>
                            <p className="text-[11px] text-coffee/40 truncate mt-0.5">{card.summary}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact stats */}
        <div className="bg-white rounded-2xl border border-cream/80 py-2.5 px-4 shadow-[0_2px_16px_rgba(92,65,54,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TrendingUp size={12} className="text-warm-tan" />
              <span className="text-[10px] font-medium text-deep-coffee">掌握率</span>
            </div>
            <div className="flex items-center gap-3 text-center">
              <span className="text-xs font-bold text-emerald-600">{getCount}<span className="text-[9px] text-emerald-600/50 ml-0.5">掌握</span></span>
              <span className="text-xs font-bold text-amber-600">{reviewCount}<span className="text-[9px] text-amber-600/50 ml-0.5">复习</span></span>
              <span className="text-xs font-bold text-coffee/50">{pendingCount}<span className="text-[9px] text-coffee/40 ml-0.5">待处理</span></span>
            </div>
            <span className="text-[10px] text-coffee/50 font-medium tabular-nums">
              {allCards.length > 0 ? Math.round((getCount / allCards.length) * 100) : 0}%
            </span>
          </div>
          <div className="h-0.5 bg-cream/80 rounded-full mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${allCards.length > 0 ? (getCount / allCards.length) * 100 : 0}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-sage to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Focus Card Stack */}
      <div ref={expandRef} className="px-5 mb-1" onClick={() => { if (expanded) setExpanded(false); }}>
        {stackCards.length > 0 && focusCard ? (
          <div className="relative" style={{ height: expanded ? 'auto' : 340 }}>
            <AnimatePresence mode="popLayout">
              {stackCards.map((card, index) => {
                const catCfg = catConfig[card.category];
                const cardStatus = card.status;
                const isTop = index === 0;
                const showGetHint = isTop && dragDirection === 'left';
                const showReviewHint = isTop && dragDirection === 'right';

                return (
                  <motion.div
                    key={card.id}
                    id={`knowledge-card-${card.id}`}
                    layout
                    onClick={(e: React.MouseEvent) => {
                      if (isTop) {
                        e.stopPropagation();
                        setExpanded(!expanded);
                      }
                    }}
                    drag={isTop && !expanded ? 'x' : undefined}
                    dragConstraints={{ left: -150, right: 150 }}
                    dragElastic={0.8}
                    dragSnapToOrigin={true}
                    onDrag={(_e, info) => {
                      dragOffsetXRef.current = info.offset.x;
                      const newDir = info.offset.x > 40 ? 'right' : info.offset.x < -40 ? 'left' : null;
                      if (newDir !== dragDirection) setDragDirection(newDir);
                    }}
                    onDragEnd={(_e, info) => {
                      setDragDirection(null);
                      if (Math.abs(info.offset.x) > 80) {
                        exitXRef.current = info.offset.x > 0 ? 500 : -500;
                        handleSwipe(info.offset.x > 0 ? 'right' : 'left');
                      }
                    }}
                    exit={{ opacity: 0, x: exitXRef.current, transition: { duration: 0.25, ease: 'easeOut' } }}
                    initial={{ opacity: 0, scale: 0.94, y: 10 }}
                    animate={{
                      x: 0,
                      opacity: index === 0 || !expanded ? 1 - index * 0.12 : 0,
                      scale: 1 - index * 0.04,
                      y: expanded ? 0 : index * 8,
                      zIndex: 100 - index,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{
                      position: index > 0 ? 'absolute' : 'relative',
                      top: index > 0 ? index * 8 : 0,
                      left: 0,
                      right: 0,
                    }}
                    className={`bg-white rounded-3xl border border-cream/80 shadow-[0_2px_16px_rgba(92,65,54,0.06)] ${isTop && !expanded ? 'cursor-grab active:cursor-grabbing' : ''} overflow-hidden`}
                  >
                    {/* Drag hint overlays */}
                    <AnimatePresence>
                      {showGetHint && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-emerald-50 to-transparent flex items-center justify-start pl-4 rounded-l-3xl z-10 pointer-events-none"
                        >
                          <span className="text-emerald-600 text-[14px] font-bold tracking-wide">GET</span>
                        </motion.div>
                      )}
                      {showReviewHint && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-amber-50 to-transparent flex items-center justify-end pr-4 rounded-r-3xl z-10 pointer-events-none"
                        >
                          <span className="text-amber-600 text-[14px] font-bold tracking-wide">再看看</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${catCfg.bg} ${catCfg.text} ${catCfg.border}`}>
                        {card.category}
                      </span>
                      {card.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] text-coffee/40">{tag}</span>
                      ))}
                      {cardStatus === 'GET' && (
                        <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                          已掌握
                        </span>
                      )}
                      {cardStatus === '再看看' && (
                        <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                          待复习
                        </span>
                      )}
                    </div>

                    <h3 className="text-[16px] font-semibold text-deep-coffee mb-3 leading-tight line-clamp-2">{card.title}</h3>

                    <p className="text-[13px] text-coffee/60 leading-relaxed line-clamp-6">{card.summary}</p>

                    <div className="flex items-center justify-between mt-6 pt-3 border-t border-cream/60">
                      <div className="flex items-center gap-1.5 text-[11px] text-coffee/40">
                        <BookOpen size={11} />
                        <span>{card.sources[0]?.title ?? ''}</span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expanded && index === 0 && (
                      <div className="px-5" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <ExpandedCardDetail
                          card={card}
                          onCollapse={() => setExpanded(false)}
                          onStatus={handleStatus}
                          onQuizComplete={() => {}}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-coffee/30">
            <BookOpen size={28} />
            <p className="text-[13px] mt-3">当前分类暂无卡片</p>
            <p className="text-[11px] mt-1">尝试切换分类或通过首页 AI 问答生成</p>
          </div>
        )}
      </div>

      {/* Knowledge List — all cards across categories */}
      <div className="px-5 mb-6">
        <p className="text-[12px] font-medium text-coffee/45 tracking-wide uppercase mb-2">全部知识</p>
        <div className="space-y-1.5">
          {allSortedCards.map(card => {
            const catCfg = catConfig[card.category];
            const statusLabel = card.status === 'GET' ? '已掌握' : card.status === '再看看' ? '待复习' : '';
            const isExpanded = expandedListIds.has(card.id);
            return (
              <div key={card.id}>
                <button
                  onClick={() => handleListClick(card.id)}
                  className={`w-full text-left rounded-xl p-3 transition-all flex items-center gap-3 bg-white border border-cream/80 shadow-[0_1px_4px_rgba(92,65,54,0.04)] ${
                    isExpanded ? 'bg-cream/60 border-warm-tan/30' : 'hover:border-warm-tan/30 hover:shadow-[0_2px_12px_rgba(92,65,54,0.06)]'
                  }`}
                >
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border flex-shrink-0 ${catCfg.bg} ${catCfg.text} ${catCfg.border}`}>
                    {card.category}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] truncate ${card.status === 'GET' ? 'text-coffee/40' : 'text-deep-coffee/80'}`}>{card.title}</p>
                    <p className="text-[11px] text-coffee/40 mt-0.5">{card.createdAt}</p>
                  </div>
                  {statusLabel && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                      card.status === 'GET' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {statusLabel}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <div className="bg-white rounded-2xl border border-cream/60 mx-2 mb-1 px-4" onClick={() => handleListClick(card.id)}>
                      <ExpandedCardDetail
                        card={card}
                        onCollapse={() => handleListClick(card.id)}
                        onStatus={(status) => {
                          state.updateCardStatus(card.id, status);
                          handleListClick(card.id);
                        }}
                        onQuizComplete={() => {}}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
