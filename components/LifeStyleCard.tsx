
import React from 'react';
import { Github, Lightbulb, BookOpen, Monitor } from 'lucide-react';
import { LifeStyle } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  Github: <Github className="text-[#f59e0b] icon-glow-orange" size={20} />,
  Lightbulb: <Lightbulb className="text-[#f59e0b] icon-glow-orange" size={20} />,
  BookOpen: <BookOpen className="text-[#f59e0b] icon-glow-orange" size={20} />,
  Monitor: <Monitor className="text-[#f59e0b] icon-glow-orange" size={20} />
};

const LifeStyleCard: React.FC<LifeStyle> = ({ title, description, icon }) => {
  return (
    <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#f59e0b]/30 transition-all flex gap-5 group">
      <div className="bg-[#1a1a1a] w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#252525] group-hover:bg-[#f59e0b]/5 group-hover:border-[#f59e0b]/20 transition-all">
        {iconMap[icon]}
      </div>
      <div className="flex flex-col justify-center">
        <h4 className="text-white font-bold text-[13px] mb-2 tracking-tight">{title}</h4>
        <p className="text-gray-500 text-[11px] leading-relaxed font-medium group-hover:text-gray-400 transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LifeStyleCard;
