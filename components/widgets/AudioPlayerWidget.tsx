import React, { useState } from 'react';

export const AudioPlayerWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Using a free rain sound sample
  const audioUrl = "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg";
  const [audio] = useState(new Audio(audioUrl));

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.loop = true;
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="my-4 p-4 bg-[#112240] rounded-xl border border-[#64ffda] border-opacity-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#64ffda] bg-opacity-10 rounded-full text-2xl">🌧️</div>
        <div>
          <h4 className="text-white text-sm font-bold">صوت المطر الغزير</h4>
          <p className="text-xs text-slate-400">للاسترخاء والنوم العميق</p>
        </div>
      </div>
      <button 
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-[#64ffda] text-[#0a192f]' : 'bg-[#233554] text-white hover:bg-[#64ffda] hover:text-[#0a192f]'}`}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
        )}
      </button>
    </div>
  );
};