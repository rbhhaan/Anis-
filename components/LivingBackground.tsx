import React from 'react';

export const LivingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a192f]">
      {/* Organic Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#64ffda] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-breathe"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#112240] rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-float"></div>
      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-[#233554] rounded-full mix-blend-screen filter blur-[60px] opacity-20 animate-pulse-slow"></div>
      
      {/* Noise Texture Overlay for grain effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(20px, 20px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-40px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.25; }
        }
        .animate-breathe { animation: breathe 10s infinite ease-in-out; }
        .animate-float { animation: float 15s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
      `}</style>
    </div>
  );
};