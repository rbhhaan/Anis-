import React, { useState, useEffect } from 'react';

export const BreathingWidget: React.FC = () => {
  const [phase, setPhase] = useState('شهيق'); // Inhale
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const cycle = () => {
      setPhase('شهيق (Inhale)');
      setScale(1.5);
      setTimeout(() => {
        setPhase('حبس (Hold)');
        setTimeout(() => {
          setPhase('زفير (Exhale)');
          setScale(1);
          setTimeout(() => {
            setPhase('راحة (Wait)');
          }, 4000);
        }, 4000);
      }, 4000);
    };

    cycle();
    const interval = setInterval(cycle, 16000); // 4-4-4-4 Box Breathing
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-4 p-6 bg-[#112240] rounded-2xl border border-[#64ffda] border-opacity-30 flex flex-col items-center justify-center shadow-lg">
      <h3 className="text-[#64ffda] text-sm font-bold mb-4 tracking-wider">تمرين التنفس الموجه</h3>
      <div 
        className="w-32 h-32 rounded-full border-4 border-[#64ffda] flex items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-[0_0_20px_rgba(100,255,218,0.3)]"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="text-white font-bold text-center text-xs opacity-80">{phase}</div>
      </div>
      <p className="text-gray-400 text-xs mt-6">اتبع الدائرة لتهدئة جهازك العصبي</p>
    </div>
  );
};