import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Camera, Sparkles, AlertTriangle, CheckCircle2, BookOpen, Menu, X } from 'lucide-react';
import { mockAIResponses } from '../data/mock';
import { catProfiles } from '../data/mock';
import type { AppState } from '../App';
import type { AIResponse } from '../types';

const quickPrompts = [
  '食欲明显下降，什么情况该立刻就医？',
  '夜间频繁叫醒，怎么区分焦虑与生理需求？',
  '软便反复出现，如何先做家庭排查？',
];

const catName = catProfiles[0]?.name || '猫咪';

const mockHistory = [
  { id: 'h1', query: '猫咪吐毛球怎么办？', date: '2026-05-10', summary: '正常现象，加强梳毛和化毛膏' },
  { id: 'h2', query: '猫咪软便反复怎么排查？', date: '2026-05-08', summary: '暂停新食物，添加益生菌，排查寄生虫' },
  { id: 'h3', query: '猫咪换粮后拉肚子', date: '2026-05-05', summary: '退回旧粮，稳定后采用7日换粮法' },
];

function MeowMindLogo({ size = 24 }: { size?: number }) {
  const w = size;
  const h = size * 0.72;
  const earH = size * 0.22;
  const strokeW = 1.8;
  return (
    <svg width={w} height={h + earH} viewBox={`0 0 ${w} ${h + earH}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={`M${w * 0.12} ${h * 0.85} L${w * 0.22} ${h * 0.1} L${w * 0.32} ${h * 0.5}`} stroke="#5C4136" strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${w * 0.68} ${h * 0.5} L${w * 0.78} ${h * 0.1} L${w * 0.88} ${h * 0.85}`} stroke="#5C4136" strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${w * 0.07} ${h * 0.85} L${w * 0.25} ${h * 0.35} L${w * 0.5} ${h * 0.8} L${w * 0.75} ${h * 0.35} L${w * 0.93} ${h * 0.85}`} stroke="#5C4136" strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomePage({ state }: { state: AppState }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleAsk = (text: string) => {
    setInput(text);
    setShowAI(true);
    handleSend(text);
  };

  const handleSend = (text?: string) => {
    const query = (text || input).trim();
    if (!query || loading) return;
    setLoading(true);
    setResponse(null);

    const match = Object.entries(mockAIResponses).find(([key]) => query.includes(key));

    setTimeout(() => {
      const res = match ? match[1] : mockAIResponses.default;
      setResponse(res);
      setLoading(false);
    }, 1500 + Math.random() * 1200);
  };

  const handleGenerateCard = () => {
    if (response?.generatedCard && !state.cards.find(c => c.id === response.generatedCard!.id)) {
      state.setCards([response.generatedCard, ...state.cards]);
    }
    state.setActiveTab('knowledge');
  };

  const riskStyles: Record<string, string> = {
    '高危': 'bg-red-50 text-red-600 border-red-200',
    '中等': 'bg-amber-50 text-amber-600 border-amber-200',
    '安全': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };

  return (
    <div className="flex flex-col min-h-full relative">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-start">
          <button
            onClick={() => setShowMenu(true)}
            className="w-8 h-8 rounded-full bg-cream/60 flex items-center justify-center hover:bg-cream transition-colors"
          >
            <Menu size={15} className="text-coffee/50" />
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-5 py-4 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-cream/60 flex items-center justify-center mb-4">
          <MeowMindLogo size={26} />
        </div>
        <h2 className="text-xl font-semibold text-deep-coffee leading-snug">
          嗨！今天 {catName} 状态怎么样？
        </h2>
        <p className="text-sm text-coffee/50 mt-2 leading-relaxed max-w-xs mx-auto">
          随时帮你看懂猫咪健康、饮食与行为变化
        </p>
      </div>

      {/* Quick prompts */}
      {!showAI && (
        <div className="px-5 space-y-2 mb-4">
          {quickPrompts.map((text, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleAsk(text)}
              className="w-full text-left bg-white rounded-2xl px-4 py-3.5 text-[14px] text-deep-coffee/80 leading-snug truncate border border-cream/80 hover:border-warm-tan/30 hover:shadow-[0_2px_16px_rgba(92,65,54,0.06)] transition-all duration-200"
            >
              {text}
            </motion.button>
          ))}
        </div>
      )}

      {/* AI Response */}
      <div className="px-5 flex-1">
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-cream/80 p-5 mb-4 shadow-[0_2px_16px_rgba(92,65,54,0.04)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-warm-tan/60"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                    />
                  ))}
                </div>
                <span className="text-sm text-coffee/45">分析中...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {response && showAI && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-cream/80 p-5 mb-4 shadow-[0_2px_16px_rgba(92,65,54,0.04)] space-y-4"
            >
              {/* Conclusion */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={13} className="text-warm-tan" />
                  <span className="text-[11px] font-medium text-coffee/45 tracking-wide uppercase">结论</span>
                </div>
                <p className="text-[15px] text-deep-coffee font-medium leading-relaxed">{response.conclusion}</p>
              </div>

              {/* Risk */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${riskStyles[response.riskLevel]}`}>
                <AlertTriangle size={11} />
                {response.riskLevel}风险
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {response.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 bg-cream/60 rounded-full text-[11px] text-coffee/50">{tag}</span>
                ))}
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 size={13} className="text-sage" />
                  <span className="text-[11px] font-medium text-coffee/45 tracking-wide uppercase">操作建议</span>
                </div>
                <ol className="space-y-1.5">
                  {response.operationSteps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-[13px] text-coffee/80 leading-relaxed">
                      <span className="text-warm-tan font-medium flex-shrink-0">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Sources */}
              <div className="flex items-center gap-1.5 text-[11px] text-coffee/40">
                <BookOpen size={11} />
                {response.sources.map((s, i) => (
                  <span key={i}>{s.title}{i < response.sources.length - 1 ? '  ·  ' : ''}</span>
                ))}
              </div>

              {response.generatedCard && (
                <button
                  onClick={handleGenerateCard}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-warm-tan/8 to-cream text-warm-tan text-[13px] font-semibold hover:from-warm-tan/15 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={13} />
                  生成知识卡片
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Composer Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-warm-bg/95 backdrop-blur-lg px-3 py-3">
        <div className="bg-white rounded-2xl border border-cream/80 shadow-[0_2px_16px_rgba(92,65,54,0.04)] flex items-center gap-1.5 p-1.5">
          <button className="w-9 h-9 rounded-xl bg-cream/50 flex items-center justify-center text-coffee/40 hover:text-coffee/60 transition-colors">
            <Camera size={17} />
          </button>
          <button className="w-9 h-9 rounded-xl bg-cream/50 flex items-center justify-center text-coffee/40 hover:text-coffee/60 transition-colors">
            <Mic size={17} />
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="发消息给 AI..."
            className="flex-1 h-9 bg-transparent outline-none text-[14px] text-deep-coffee placeholder:text-coffee/35 px-1"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-deep-coffee flex items-center justify-center text-white disabled:opacity-20 transition-opacity hover:bg-deep-coffee/80"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Menu Drawer */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50"
            onClick={() => setShowMenu(false)}
          >
            <div className="absolute inset-0 bg-deep-coffee/30 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-white rounded-r-3xl shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-cream/80">
                <span className="text-[14px] font-semibold text-deep-coffee">菜单</span>
                <button onClick={() => setShowMenu(false)}>
                  <X size={18} className="text-coffee/50" />
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-[calc(100%-60px)] overflow-y-auto">
                <p className="text-[11px] font-medium text-coffee/45 tracking-wide uppercase mb-2">历史对话</p>
                {mockHistory.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setShowMenu(false); handleAsk(item.query); }}
                    className="w-full text-left bg-cream/40 rounded-xl p-3.5 hover:bg-cream transition-colors"
                  >
                    <p className="text-[13px] text-deep-coffee font-medium">{item.query}</p>
                    <p className="text-[12px] text-coffee/50 mt-1 line-clamp-1">{item.summary}</p>
                    <p className="text-[10px] text-coffee/35 mt-1.5">{item.date}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
