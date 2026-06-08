
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Project } from '../types';

const ProjectCard: React.FC<Project> = ({ name, description, glowColor, link }) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="bg-[#121212] border border-[#1f1f1f] rounded-2xl overflow-hidden group hover:border-gray-700 transition-all flex flex-col h-full shadow-lg cursor-pointer"
    >
      <div 
        className="h-36 w-full flex items-center justify-center relative p-6"
        style={{ 
          background: `radial-gradient(circle at center, ${glowColor} 0%, rgba(18,18,18,1) 100%)` 
        }}
      >
        <span className="text-2xl font-black text-white/90 tracking-tighter select-none">{name}</span>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-[#f59e0b] font-bold text-sm tracking-tight group-hover:underline">{name}</h4>
          <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition-colors" />
        </div>
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </a>
  );
};

export default ProjectCard;
