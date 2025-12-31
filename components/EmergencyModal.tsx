import React, { useState, useMemo } from 'react';
import { EMERGENCY_RESOURCES } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<{name: string, number: string, desc: string}[]>([]);

  // Instant Filter logic: Checks Country, Name, and Description
  const filteredResources = useMemo(() => {
    if (!searchTerm.trim()) return EMERGENCY_RESOURCES;
    const term = searchTerm.toLowerCase().trim();
    return EMERGENCY_RESOURCES.filter(resource =>
      resource.country.toLowerCase().includes(term) || 
      resource.desc.toLowerCase().includes(term) ||
      resource.name.includes(term)
    );
  }, [searchTerm]);

  const handleSmartSearch = async () => {
    if (!searchTerm) return;
    setAiLoading(true);
    setAiResults([]); // Clear previous results

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Optimized Prompt for Speed: Request less data, use fewer tokens
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Find 1 official mental health emergency hotline in "${searchTerm}". Return ONLY JSON: [{"name": "Name", "number": "Phone", "desc": "Short description"}].`,
            config: {
                tools: [{ googleSearch: {} }] // Enable search tool
            }
        });
        
        const responseText = response.text || "";
        
        // Robust extraction logic (JSON or Regex fallback)
        let extractedData = [];
        try {
            // Try to find JSON array in the text
            const jsonMatch = responseText.match(/\[.*\]/s);
            if (jsonMatch) {
                extractedData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found");
            }
        } catch (e) {
            // Fallback: Create a result from the raw text if short, or generic error
            if (responseText.length < 200 && /\d/.test(responseText)) {
                 extractedData = [{ name: "نتيجة بحث AI", number: responseText, desc: "تم الاستخراج من النص" }];
            } else {
                 extractedData = [{ name: `بحث: ${searchTerm}`, number: "انقر للبحث في جوجل", desc: "لم يستطع الذكاء الاصطناعي تحديد رقم دقيق." }];
            }
        }

        setAiResults(extractedData);

    } catch (e) {
        console.error(e);
        setAiResults([{ name: "خطأ في البحث", number: "---", desc: "تأكد من الاتصال بالإنترنت" }]);
    } finally {
        setAiLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#020c1b] bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#112240] border border-[#233554] rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden text-[#e6f1ff]">
        
        {/* Header */}
        <div className="p-6 border-b border-red-900/30 bg-red-900/10">
          <div className="flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                بروتوكول الطوارئ
                </h2>
                <p className="text-red-300/60 text-sm">
                نحن هنا لحمايتك.
                </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1 rounded-lg">
                ✕
            </button>
          </div>
        </div>

        {/* Search Box */}
        <div className="p-4 bg-[#112240] sticky top-0 z-10 border-b border-[#233554]">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="اكتب مدينتك (الرياض، القاهرة، دبي...)"
                        className="w-full pl-4 pr-10 py-3 bg-[#0a192f] border border-[#233554] rounded-xl focus:ring-1 focus:ring-[#64ffda] focus:border-[#64ffda] outline-none text-white placeholder-gray-500 transition-all"
                        autoFocus
                    />
                     {/* Instant Match Indicator */}
                    {searchTerm && filteredResources.length > 0 && (
                        <div className="absolute left-3 top-3.5 text-[#64ffda] text-xs font-bold animate-pulse">
                            ✓ متوفر
                        </div>
                    )}
                </div>
                <button 
                    onClick={handleSmartSearch}
                    disabled={!searchTerm || aiLoading}
                    className="bg-[#64ffda] text-[#0a192f] px-4 rounded-xl font-bold text-sm whitespace-nowrap hover:bg-[#52dabb] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                    {aiLoading ? (
                        <>
                         <svg className="animate-spin h-4 w-4 text-[#0a192f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         بحث عميق
                        </>
                    ) : 'بحث AI'}
                </button>
            </div>
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          
          {/* AI Results */}
          {aiResults.length > 0 && (
             <div className="mb-4 animate-fade-in-up">
                <h3 className="text-xs text-[#64ffda] mb-2 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#64ffda] rounded-full animate-pulse"></span>
                    نتائج البحث الذكي
                </h3>
                {aiResults.map((r, i) => (
                    <div key={i} className="bg-[#172a45] p-3 rounded-lg border border-[#64ffda] mb-2 shadow-[0_0_10px_rgba(100,255,218,0.1)]">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-bold text-white">{r.name}</div>
                                <div className="text-sm text-gray-400">{r.desc}</div>
                            </div>
                            <a href={`tel:${r.number}`} className="bg-[#64ffda] text-[#0a192f] px-3 py-1 rounded-md text-sm font-bold">
                                {r.number}
                            </a>
                        </div>
                    </div>
                ))}
             </div>
          )}

          {filteredResources.length > 0 ? (
            filteredResources.map((resource, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#172a45] p-4 rounded-xl border border-[#233554] hover:border-[#64ffda] hover:border-opacity-30 transition-all">
                <div className="mb-3 sm:mb-0">
                    <p className="font-bold text-[#e6f1ff] text-lg flex items-center gap-2">
                        {resource.country}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{resource.desc}</p>
                </div>
                <a 
                    href={resource.name.includes('.') ? `https://${resource.name}` : `tel:${resource.name}`} 
                    target={resource.name.includes('.') ? "_blank" : "_self"}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-colors ${resource.name.includes('.') ? 'bg-[#233554] text-[#64ffda] hover:bg-[#30486f]' : 'bg-red-900/20 text-red-400 hover:bg-red-900/40'}`}
                >
                    <span dir="ltr">{resource.name}</span>
                </a>
                </div>
            ))
          ) : (
            <div className="text-center py-10 opacity-60">
                <div className="w-16 h-16 rounded-full bg-[#172a45] flex items-center justify-center mx-auto mb-3">
                     <span className="text-2xl">🌍</span>
                </div>
                <p className="text-gray-400 font-medium">لم نجد نتيجة مباشرة في القائمة.</p>
                <p className="text-xs text-gray-500 mt-2">اضغط على "بحث AI" للبحث في الويب.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-[#0a192f] border-t border-[#233554] flex justify-between items-center">
             <span className="text-xs text-gray-500">في حالة الخطر الداهم، اتصل بالشرطة فوراً.</span>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#233554] text-white rounded-lg hover:bg-[#30486f] transition font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};