
import React from 'react';
import { Award, Calendar, Hash, Bookmark } from 'lucide-react';
import { Certification } from '../types';

const CertificationCard: React.FC<Certification> = ({ title, provider, date, id }) => {
  return (
    <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-5 hover:bg-[#181818] transition-all group relative border-l-2 border-l-transparent hover:border-l-[#f59e0b]">
      <div className="absolute top-5 right-5 text-[#f59e0b]/40 group-hover:text-[#f59e0b] transition-colors">
        <Bookmark size={16} className="icon-glow-orange" />
      </div>
      <h4 className="text-white font-bold text-sm mb-4 pr-8 tracking-tight leading-snug">{title}</h4>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 text-gray-400">
          <div className="w-5 h-5 rounded bg-[#1a1a1a] flex items-center justify-center border border-transparent group-hover:border-[#f59e0b]/20">
            <Award size={12} className="text-[#f59e0b] icon-glow-orange" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">{provider}</span>
        </div>
        <div className="flex items-center gap-2.5 text-gray-400">
          <div className="w-5 h-5 rounded bg-[#1a1a1a] flex items-center justify-center">
            <Calendar size={12} className="text-[#f59e0b] icon-glow-orange" />
          </div>
          <span className="text-[10px] font-bold">{date}</span>
        </div>
        <div className="flex items-center gap-2.5 text-gray-600">
          <div className="w-5 h-5 rounded bg-[#1a1a1a] flex items-center justify-center">
            <Hash size={12} className="icon-glow-white" />
          </div>
          <span className="text-[9px] font-mono">{id}</span>
        </div>
      </div>
    </div>
  );
};

export default CertificationCard;
