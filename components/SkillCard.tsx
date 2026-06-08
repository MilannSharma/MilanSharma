
import React from 'react';
import { Skill } from '../types';

const SkillCard: React.FC<Skill> = ({ title, items }) => {
  return (
    <div className="bg-[#121212] border border-[#222] rounded-[24px] p-6 hover:border-[#f59e0b]/40 transition-all group shadow-sm">
      <h3 className="text-[#f59e0b] text-[11px] font-black mb-5 uppercase tracking-[0.2em] border-b border-[#222] pb-3">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span 
            key={idx} 
            className="text-[11px] text-gray-400 font-semibold px-3 py-1.5 bg-[#1a1a1a] rounded-xl border border-[#252525] group-hover:border-[#333] transition-colors"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillCard;
