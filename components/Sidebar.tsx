import React from 'react';
import { TOOLKIT_ITEMS } from '../constants';

interface SidebarProps {
  onToolSelect: (toolId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onToolSelect, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 right-0 w-80 h-full z-50 
        bg-[#112240]/95 backdrop-blur-xl border-l border-[#64ffda] border-opacity-10 
        transform transition-transform duration-300 ease-out shadow-2xl
        flex flex-col p-6
        lg:relative lg:translate-x-0 lg:bg-transparent lg:shadow-none lg:z-20
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Mobile Header (Close Button) */}
        <div className="flex justify-between items-center mb-6 lg:mb-6">
          <h2 className="text-xl font-bold text-[#e6f1ff] flex items-center gap-2">
            <span className="text-[#64ffda]">◆</span> لوحة الروح
          </h2>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg active:bg-[#233554]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mood Pulse */}
        <div className="mb-8 p-4 bg-[#0a192f] lg:bg-[#112240] rounded-xl border border-[#233554]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">نبض المشاعر</span>
            <span className="text-xs text-[#64ffda]">مستقر</span>
          </div>
          <div className="h-16 flex items-end gap-1">
             {[40, 60, 30, 80, 50, 70, 40].map((h, i) => (
               <div key={i} className="flex-1 bg-[#64ffda] opacity-20 hover:opacity-100 transition-all duration-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
             ))}
          </div>
        </div>

        {/* Toolkit */}
        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">صيدلية بلا دواء</h3>
        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
          {TOOLKIT_ITEMS.map((item) => (
            <button 
              key={item.id} 
              onClick={() => {
                onToolSelect(item.id);
                onClose(); // Close sidebar on mobile after selection
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#0a192f] lg:bg-[#112240] hover:bg-[#233554] border border-transparent hover:border-[#64ffda] hover:border-opacity-30 transition-all group active:scale-95"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <div className="text-right">
                <div className="text-sm font-medium text-[#e6f1ff]">{item.title}</div>
                <div className="text-[10px] text-gray-500">{item.type === 'audio' ? 'استماع • 10د' : 'تمرين ذاتي'}</div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-6 border-t border-[#233554]">
          <p className="text-[10px] text-center text-gray-500">
            جميع المحادثات مشفرة ومحفوظة محلياً لخصوصيتك التامة.
          </p>
        </div>
      </div>
    </>
  );
};