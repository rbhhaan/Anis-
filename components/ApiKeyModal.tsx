import React, { useState } from 'react';

interface ApiKeyModalProps {
  onKeySet: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onKeySet }) => {
  const [keyInput, setKeyInput] = useState('');

  const handleSave = () => {
    if (keyInput.trim().length > 10) {
      localStorage.setItem('USER_GEMINI_KEY', keyInput.trim());
      // Reload specific parts or notify parent
      window.location.reload(); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a192f] bg-opacity-95 backdrop-blur-md">
      <div className="bg-[#112240] border border-[#64ffda] border-opacity-30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border border-[#64ffda] flex items-center justify-center bg-[#64ffda] bg-opacity-10">
             <span className="text-3xl">🔑</span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-center text-[#e6f1ff] mb-2">مطلوب مفتاح الدخول</h2>
        <p className="text-center text-gray-400 text-sm mb-6 leading-relaxed">
          لأن هذا الموقع يعمل بشكل مستقل (Static)، يرجى إدخال مفتاح Gemini API الخاص بك. سيتم حفظه على جهازك فقط.
        </p>

        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="لصق مفتاح API هنا..."
          className="w-full bg-[#0a192f] border border-[#233554] rounded-xl p-4 text-white focus:border-[#64ffda] outline-none mb-4 text-center dir-ltr"
        />

        <button
          onClick={handleSave}
          disabled={!keyInput}
          className="w-full bg-[#64ffda] text-[#0a192f] py-3 rounded-xl font-bold hover:bg-[#52dabb] transition disabled:opacity-50"
        >
          بدء الجلسة
        </button>
        
        <div className="mt-4 text-center">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-xs text-[#64ffda] underline hover:text-white">
                احصل على مفتاح مجاني من Google AI Studio
            </a>
        </div>
      </div>
    </div>
  );
};