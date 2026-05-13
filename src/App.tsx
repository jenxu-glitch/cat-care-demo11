import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, Cat } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { KnowledgePage } from './pages/KnowledgePage';
import { SocialPage } from './pages/SocialPage';
import { MyCatPage } from './pages/MyCatPage';
import { mockCards } from './data/mock';
import type { KnowledgeCard } from './types';

export type Tab = 'home' | 'knowledge' | 'social' | 'mycat';

export interface AppState {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  cards: KnowledgeCard[];
  setCards: (cards: KnowledgeCard[]) => void;
  userKnowledge: Record<string, { status: string; reviewCount: number }>;
  updateCardStatus: (cardId: string, status: 'GET' | '再看看') => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function useAppState(): AppState {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [cards, setCards] = useState<KnowledgeCard[]>(mockCards);
  const [userKnowledge, setUserKnowledge] = useState<Record<string, { status: string; reviewCount: number }>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const updateCardStatus = useCallback((cardId: string, status: 'GET' | '再看看') => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, status, reviewCount: c.reviewCount + 1 } : c));
    setUserKnowledge(prev => ({
      ...prev,
      [cardId]: { status, reviewCount: (prev[cardId]?.reviewCount ?? 0) + 1 },
    }));
  }, []);

  return { activeTab, setActiveTab, cards, setCards, userKnowledge, updateCardStatus, scrollContainerRef };
}

function MeowMindLogo({ size = 24, active = false }: { size?: number; active?: boolean }) {
  const color = active ? '#5C4136' : '#B8A89A';
  const w = size;
  const h = size * 0.72;
  const strokeW = 1.8;
  const earH = size * 0.22;
  const earW = size * 0.14;
  return (
    <svg width={w} height={h + earH} viewBox={`0 0 ${w} ${h + earH}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left ear tip */}
      <path d={`M${w * 0.12} ${h * 0.85} L${w * 0.22} ${h * 0.1} L${w * 0.32} ${h * 0.5}`} stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
      {/* Right ear tip */}
      <path d={`M${w * 0.68} ${h * 0.5} L${w * 0.78} ${h * 0.1} L${w * 0.88} ${h * 0.85}`} stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
      {/* M body */}
      <path d={`M${w * 0.07} ${h * 0.85} L${w * 0.25} ${h * 0.35} L${w * 0.5} ${h * 0.8} L${w * 0.75} ${h * 0.35} L${w * 0.93} ${h * 0.85}`} stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  const state = useAppState();

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-warm-bg">
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            ref={state.scrollContainerRef}
            key={state.activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="h-full overflow-y-auto"
          >
            {state.activeTab === 'home' && <HomePage state={state} />}
            {state.activeTab === 'knowledge' && <KnowledgePage state={state} />}
            {state.activeTab === 'social' && <SocialPage state={state} />}
            {state.activeTab === 'mycat' && <MyCatPage state={state} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="flex-shrink-0 flex items-center justify-around bg-warm-white/95 backdrop-blur-lg border-t border-cream/80 px-2 pb-safe">
        {/* Home tab - logo only */}
        <button
          onClick={() => state.setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-all duration-200 min-w-[60px] ${state.activeTab === 'home' ? 'text-deep-coffee' : 'text-coffee/40'}`}
        >
          <motion.div
            animate={{ scale: state.activeTab === 'home' ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <MeowMindLogo size={22} active={state.activeTab === 'home'} />
          </motion.div>
        </button>

        {/* Knowledge tab */}
        <button
          onClick={() => state.setActiveTab('knowledge')}
          className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-all duration-200 min-w-[60px] ${state.activeTab === 'knowledge' ? 'text-deep-coffee' : 'text-coffee/40'}`}
        >
          <motion.div
            animate={{ scale: state.activeTab === 'knowledge' ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <BookOpen size={21} strokeWidth={state.activeTab === 'knowledge' ? 2 : 1.5} />
          </motion.div>
          <span className={`text-[10px] font-medium tracking-wide ${state.activeTab === 'knowledge' ? 'opacity-100' : 'opacity-50'}`}>知识</span>
        </button>

        {/* Social tab */}
        <button
          onClick={() => state.setActiveTab('social')}
          className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-all duration-200 min-w-[60px] ${state.activeTab === 'social' ? 'text-deep-coffee' : 'text-coffee/40'}`}
        >
          <motion.div
            animate={{ scale: state.activeTab === 'social' ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <Users size={21} strokeWidth={state.activeTab === 'social' ? 2 : 1.5} />
          </motion.div>
          <span className={`text-[10px] font-medium tracking-wide ${state.activeTab === 'social' ? 'opacity-100' : 'opacity-50'}`}>社交</span>
        </button>

        {/* MyCat tab */}
        <button
          onClick={() => state.setActiveTab('mycat')}
          className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-all duration-200 min-w-[60px] ${state.activeTab === 'mycat' ? 'text-deep-coffee' : 'text-coffee/40'}`}
        >
          <motion.div
            animate={{ scale: state.activeTab === 'mycat' ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <Cat size={21} strokeWidth={state.activeTab === 'mycat' ? 2 : 1.5} />
          </motion.div>
          <span className={`text-[10px] font-medium tracking-wide ${state.activeTab === 'mycat' ? 'opacity-100' : 'opacity-50'}`}>我的猫</span>
        </button>
      </nav>
    </div>
  );
}
