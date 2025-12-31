import React from 'react';
import { Message, MessageRole, WidgetType } from '../types';
import { BreathingWidget } from './widgets/BreathingWidget';
import { AudioPlayerWidget } from './widgets/AudioPlayerWidget';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isModel = message.role === MessageRole.MODEL;
  
  // Clean text from widget tags for display
  const cleanText = (text: string) => {
    return text
      .replace(/<WIDGET:.*?>/g, '')
      .replace(/\*\*/g, '')
      .replace(/###/g, '')
      .trim();
  };

  const displayText = cleanText(message.text);

  const renderWidget = () => {
    switch (message.widget) {
      case WidgetType.BREATHING:
        return <BreathingWidget />;
      case WidgetType.AUDIO_RAIN:
        return <AudioPlayerWidget />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex w-full mb-8 ${isModel ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] items-start gap-3 ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg border border-[#64ffda] border-opacity-30 ${isModel ? 'glass' : 'bg-[#64ffda]'}`}>
            {isModel ? (
                <img src="https://picsum.photos/seed/drhekma_v3/200/200" alt="Dr Hekma" className="w-full h-full object-cover rounded-full opacity-90" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-[#0a192f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-2 w-full">
          <div 
            className={`
              relative px-6 py-4 text-[1rem] leading-relaxed whitespace-pre-wrap shadow-xl backdrop-blur-md
              ${isModel 
                ? 'bg-[#112240] bg-opacity-80 text-[#e6f1ff] rounded-2xl rounded-tl-none border border-[#64ffda] border-opacity-10' 
                : 'bg-[#64ffda] bg-opacity-90 text-[#0a192f] rounded-2xl rounded-tr-none font-medium'
              }
            `}
          >
              <p>{displayText}</p>
              <div className={`text-[10px] mt-3 opacity-60 font-medium tracking-wide flex items-center gap-1 ${isModel ? 'text-[#64ffda]' : 'text-[#0a192f]'}`}>
                  {message.timestamp.toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })}
              </div>
          </div>

          {/* Render Widgets if they exist */}
          {isModel && message.widget && (
            <div className="mt-1 animate-slide-up">
              {renderWidget()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};