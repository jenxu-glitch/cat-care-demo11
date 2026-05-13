import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Syringe, Shield, AlertCircle, Plus, Camera, Cat, Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';
import { catProfiles, healthRecords, reminders } from '../data/mock';
import type { AppState } from '../App';
import type { CatProfile, RecordType } from '../types';

function CatProfileCard({ cat }: { cat: CatProfile }) {
  const ageMonths = Math.floor((new Date().getTime() - new Date(cat.birthday).getTime()) / (1000 * 60 * 60 * 24 * 30));
  const ageDisplay = ageMonths >= 12 ? `${Math.floor(ageMonths / 12)} 岁 ${ageMonths % 12} 个月` : `${ageMonths} 个月`;
  const latestWeight = cat.weightHistory[cat.weightHistory.length - 1]?.weight ?? null;

  return (
    <div className="bg-white rounded-3xl border border-cream/80 p-5 shadow-[0_2px_16px_rgba(92,65,54,0.04)]">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-cream/60 flex items-center justify-center">
            <Cat size={22} className="text-warm-tan/60" strokeWidth={1.5} />
          </div>
          <button className="absolute -bottom-0.5 -right-0.5 p-1 rounded-full bg-warm-tan text-white shadow-sm">
            <Camera size={10} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-deep-coffee">{cat.name}</h2>
            <button className="p-1.5 rounded-full text-coffee/40 hover:bg-cream transition-colors">
              <Edit3 size={13} />
            </button>
          </div>
          <div className="mt-1.5 flex flex-col gap-y-0.5 text-[11px]">
            <div className="text-coffee/60">品种 <span className="text-deep-coffee/80 ml-1">{cat.breed}</span></div>
            <div className="text-coffee/60">年龄 <span className="text-deep-coffee/80 ml-1">{ageDisplay}</span></div>
            <div className="text-coffee/60">
              性别 <span className="text-deep-coffee/80 ml-1">{cat.gender === 'female' ? '雌性' : '雄性'}{cat.neutered ? ' · 已绝育' : ''}</span>
            </div>
            <div className="text-coffee/60">体重 <span className="text-deep-coffee/80 font-medium ml-1">{latestWeight ? `${latestWeight} kg` : '--'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini form for adding health record
function AddRecordForm({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<RecordType>('疫苗');
  const [content, setContent] = useState('');
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
          <span className="text-[14px] font-semibold text-deep-coffee">添加健康记录</span>
          <button disabled={!content.trim()} className="text-[14px] font-semibold text-warm-tan disabled:opacity-30">保存</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            {(['疫苗', '驱虫', '行为'] as RecordType[]).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                  type === t ? 'bg-deep-coffee text-white' : 'bg-cream/60 text-coffee/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="描述记录内容..."
            className="w-full resize-none text-[14px] leading-relaxed bg-transparent outline-none placeholder:text-coffee/30 text-deep-coffee min-h-[80px]"
            autoFocus
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Mini form for adding reminder
function AddReminderForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
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
          <span className="text-[14px] font-semibold text-deep-coffee">添加提醒</span>
          <button disabled={!title.trim()} className="text-[14px] font-semibold text-warm-tan disabled:opacity-30">保存</button>
        </div>
        <div className="p-4">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="提醒事项..."
            className="w-full text-[14px] bg-transparent outline-none placeholder:text-coffee/30 text-deep-coffee"
            autoFocus
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function HealthRecords() {
  const [filter, setFilter] = useState<RecordType | '全部'>('全部');
  const [collapsed, setCollapsed] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const iconMap: Record<string, typeof Syringe> = { '疫苗': Syringe, '驱虫': Shield, '行为': AlertCircle };
  const colorMap: Record<string, string> = {
    '疫苗': 'text-blue-500 bg-blue-50',
    '驱虫': 'text-emerald-500 bg-emerald-50',
    '行为': 'text-amber-500 bg-amber-50',
  };

  const filtered = filter === '全部' ? healthRecords : healthRecords.filter(r => r.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 text-[14px] font-semibold text-deep-coffee"
        >
          健康记录
          {collapsed ? <ChevronDown size={15} className="text-coffee/40" /> : <ChevronUp size={15} className="text-coffee/40" />}
        </button>
        <button onClick={() => setShowAdd(true)} className="text-[12px] text-warm-tan font-medium flex items-center gap-1">
          <Plus size={11} /> 添加
        </button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-1.5 mb-3">
              {(['全部', '疫苗', '驱虫', '行为'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    filter === t ? 'bg-deep-coffee text-white' : 'bg-cream/60 text-coffee/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filtered.map(record => {
                const Icon = iconMap[record.type] ?? AlertCircle;
                return (
                  <div key={record.id} className="bg-white rounded-xl border border-cream/80 p-3 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorMap[record.type]}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-deep-coffee truncate">{record.content}</p>
                      <p className="text-[11px] text-coffee/40 mt-0.5">{record.date}</p>
                    </div>
                    {record.nextReminderDate && (
                      <span className="text-[10px] text-coffee/35 flex-shrink-0">下次: {record.nextReminderDate}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdd && <AddRecordForm onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </div>
  );
}

function Reminders() {
  const [enabledReminders, setEnabledReminders] = useState(reminders);
  const [showAdd, setShowAdd] = useState(false);

  const dueSoon = (date: string) => {
    const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 7;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-deep-coffee">提醒</h3>
        <button onClick={() => setShowAdd(true)} className="text-[12px] text-warm-tan font-medium flex items-center gap-1">
          <Plus size={11} /> 添加
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {enabledReminders.map(reminder => {
          const isDue = dueSoon(reminder.dueDate);
          return (
            <div
              key={reminder.id}
              className={`bg-white rounded-xl border p-3 transition-all ${
                isDue && reminder.enabled ? 'border-amber-300 bg-amber-50/30' : 'border-cream/80'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <Calendar size={13} className={isDue && reminder.enabled ? 'text-amber-500' : 'text-coffee/40'} />
                <button
                  onClick={() => setEnabledReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, enabled: !r.enabled } : r))}
                  className={`w-8 h-4 rounded-full transition-colors relative ${reminder.enabled ? 'bg-warm-tan' : 'bg-gray-200'}`}
                >
                  <motion.div animate={{ x: reminder.enabled ? 14 : 1 }} className="w-3 h-3 rounded-full bg-white absolute top-0.5 shadow-sm" />
                </button>
              </div>
              <p className="text-[12px] text-deep-coffee font-medium leading-snug">{reminder.title}</p>
              <p className={`text-[10px] mt-1 ${isDue && reminder.enabled ? 'text-amber-500 font-medium' : 'text-coffee/40'}`}>
                {reminder.dueDate}
              </p>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showAdd && <AddReminderForm onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </div>
  );
}

function CarePlan() {
  return (
    <div className="bg-white rounded-2xl border border-cream/80 p-4 shadow-[0_2px_16px_rgba(92,65,54,0.04)]">
      <h3 className="text-[14px] font-semibold text-deep-coffee mb-3">近期照护计划</h3>
      <ul className="space-y-2.5">
        <li className="flex gap-2.5 text-[13px] text-coffee/80 leading-relaxed">
          <span className="w-1 h-1 rounded-full bg-warm-tan mt-1.5 flex-shrink-0" />
          三天后补充猫砂，建议选择无尘豆腐砂。
        </li>
        <li className="flex gap-2.5 text-[13px] text-coffee/80 leading-relaxed">
          <span className="w-1 h-1 rounded-full bg-warm-tan mt-1.5 flex-shrink-0" />
          本周增加 2 次高强度互动，缓解夜间精力过剩。
        </li>
        <li className="flex gap-2.5 text-[13px] text-coffee/80 leading-relaxed">
          <span className="w-1 h-1 rounded-full bg-warm-tan mt-1.5 flex-shrink-0" />
          连续记录 7 天饮水与排泄，供 AI 问答判断使用。
        </li>
      </ul>
    </div>
  );
}

export function MyCatPage({ state: _state }: { state: AppState }) {
  const cat = catProfiles[0];

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-3" />

      <div className="px-5 space-y-4">
        <CatProfileCard cat={cat} />
        <HealthRecords />
        <Reminders />
        <CarePlan />
      </div>
    </div>
  );
}
