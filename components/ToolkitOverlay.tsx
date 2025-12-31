import React, { useState, useEffect } from 'react';
import { BreathingWidget } from './widgets/BreathingWidget';
import { AudioPlayerWidget } from './widgets/AudioPlayerWidget';

interface ToolkitOverlayProps {
  activeToolId: string | null;
  onClose: () => void;
}

// Sub-component: CBT Thought Challenge
const ThoughtChallenge = () => {
  const [step, setStep] = useState(1);
  const [thought, setThought] = useState('');
  const [distortion, setDistortion] = useState('');
  const [reframe, setReframe] = useState('');

  const distortions = [
    "التفكير الكارثي (توقع الأسوأ)",
    "الأبيض والأسود (إما نجاح كامل أو فشل)",
    "قراءة الأفكار (أعرف أنهم يكرهونني)",
    "الشخصنة (أنا السبب في كل شيء)",
    "التعميم المفرط"
  ];

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6 flex justify-between items-center text-[#64ffda] text-xs uppercase tracking-widest">
        <span>خطوة {step} من 3</span>
        <span>CBT Protocol</span>
      </div>

      {step === 1 && (
        <div className="animate-fade-in">
          <label className="block text-lg font-bold text-white mb-4">ما هي الفكرة السلبية التي تزعجك؟</label>
          <textarea 
            className="w-full bg-[#0a192f] border border-[#233554] rounded-xl p-4 text-white focus:border-[#64ffda] outline-none min-h-[120px]"
            placeholder="مثال: لن أنجح في هذا العمل أبداً..."
            value={thought}
            onChange={e => setThought(e.target.value)}
          />
          <button 
            onClick={() => setStep(2)} 
            disabled={!thought}
            className="mt-6 w-full bg-[#64ffda] text-[#0a192f] py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-[#52dabb] transition"
          >
            التالي: تحليل الفكرة
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <label className="block text-lg font-bold text-white mb-4">ما هو "خطأ التفكير" في هذه الجملة؟</label>
          <div className="space-y-2 mb-6">
            {distortions.map(d => (
              <button
                key={d}
                onClick={() => setDistortion(d)}
                className={`w-full text-right p-3 rounded-lg border transition-all ${distortion === d ? 'bg-[#64ffda] text-[#0a192f] border-[#64ffda]' : 'bg-[#112240] text-gray-300 border-transparent hover:border-[#64ffda]/30'}`}
              >
                {d}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setStep(3)} 
            disabled={!distortion}
            className="w-full bg-[#64ffda] text-[#0a192f] py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-[#52dabb] transition"
          >
            التالي: إعادة الصياغة
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <label className="block text-lg font-bold text-white mb-4">لنكتب الفكرة بشكل أكثر واقعية ولطفاً:</label>
          <div className="bg-[#112240] p-3 rounded-lg mb-4 text-sm text-gray-400">
            <span className="block text-red-400 text-xs mb-1">الفكرة القديمة:</span>
            "{thought}"
          </div>
          <textarea 
            className="w-full bg-[#0a192f] border border-[#233554] rounded-xl p-4 text-white focus:border-[#64ffda] outline-none min-h-[120px]"
            placeholder="مثال: الأمر صعب، لكنني واجهت تحديات سابقاً ونجحت. سأبذل جهدي..."
            value={reframe}
            onChange={e => setReframe(e.target.value)}
          />
          <button 
            onClick={onClose} 
            className="mt-6 w-full bg-[#64ffda] text-[#0a192f] py-3 rounded-xl font-bold hover:bg-[#52dabb] transition shadow-[0_0_20px_rgba(100,255,218,0.3)]"
          >
            ✨ إنهاء وحفظ التحدي
          </button>
        </div>
      )}
    </div>
  );
};

// Sub-component: Gratitude Journal
const GratitudeJournal = () => {
  const [items, setItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('hekma_gratitude');
    return saved ? JSON.parse(saved) : [];
  });
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem('hekma_gratitude', JSON.stringify(updated));
    setNewItem('');
  };

  return (
    <div className="w-full max-w-lg h-[60vh] flex flex-col">
      <h3 className="text-xl font-bold text-white mb-2">🌸 مذكرة الامتنان</h3>
      <p className="text-gray-400 text-sm mb-6">دوّن 3 أشياء بسيطة تشعر بالامتنان لوجودها اليوم.</p>
      
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          placeholder="أنا ممتن لـ..."
          className="flex-1 bg-[#0a192f] border border-[#233554] rounded-xl px-4 py-3 text-white focus:border-[#64ffda] outline-none"
        />
        <button 
          onClick={addItem}
          className="bg-[#64ffda] text-[#0a192f] px-6 rounded-xl font-bold hover:bg-[#52dabb] transition"
        >
          أضف
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
        {items.length === 0 && (
          <div className="text-center py-10 text-gray-500 opacity-50">
            القائمة فارغة.. ابدأ بأبسط الأشياء (قهوة، شمس، ابتسامة).
          </div>
        )}
        {items.map((item, idx) => (
          <div key={idx} className="bg-[#112240] p-4 rounded-xl border border-transparent hover:border-[#64ffda]/30 transition flex items-center gap-3 animate-slide-up">
            <span className="text-[#64ffda]">●</span>
            <span className="text-[#e6f1ff]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ToolkitOverlay: React.FC<ToolkitOverlayProps> = ({ activeToolId, onClose }) => {
  if (!activeToolId) return null;

  let content;
  // IDs match constants.ts
  switch (activeToolId) {
    case '1': // Breathing
      content = (
        <div className="flex flex-col items-center">
          <BreathingWidget />
          <p className="mt-8 text-center text-gray-300 max-w-md leading-relaxed">
            استمر في التنفس مع الدائرة لمدة 3 دقائق. هذا النمط (4-4-4-4) يرسل إشارات فورية للجهاز العصبي بانتهاء الخطر.
          </p>
        </div>
      );
      break;
    case '2': // Rain Audio
      content = (
        <div className="flex flex-col items-center w-full max-w-md">
           <div className="w-full scale-125 mb-8">
             <AudioPlayerWidget />
           </div>
           <p className="text-center text-gray-400 text-sm">
             يساعد الضوضاء الأبيض وصوت المطر على حجب الأفكار المشتتة وتهيئة الدماغ لحالة "ألفا" المريحة.
           </p>
        </div>
      );
      break;
    case '3': // CBT Thought Challenge
      content = <ThoughtChallenge />;
      break;
    case '4': // Gratitude
      content = <GratitudeJournal />;
      break;
    default:
      content = null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#020c1b] bg-opacity-95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative z-10 bg-[#112240] border border-[#64ffda] border-opacity-20 rounded-3xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col items-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2">
          ✕
        </button>
        {content}
      </div>
    </div>
  );
};

function onClose() {
  throw new Error('Function not implemented.');
}
