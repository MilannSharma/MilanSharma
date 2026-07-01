import React, { useState } from 'react';
import { 
  Download, 
  Briefcase, 
  GraduationCap, 
  PenTool, 
  Award, 
  MapPin, 
  Calendar, 
  Monitor, 
  Zap,
  CheckCircle2,
  Clock,
  Pin,
  Loader2
} from 'lucide-react';
import { RESUME_DATA, PERSONAL_INFO } from '../constants';
import { ResumeSection, ResumeItem } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase size={18} className="text-[#f59e0b]" />,
  GraduationCap: <GraduationCap size={18} className="text-[#f59e0b]" />,
  PenTool: <PenTool size={18} className="text-[#f59e0b]" />,
  Award: <Award size={18} className="text-[#f59e0b]" />
};

interface ResumeProps {
  resumeData?: ResumeSection[];
  resumeLink?: string;
}

const Resume: React.FC<ResumeProps> = ({ resumeData, resumeLink }) => {
  const dataList = resumeData || RESUME_DATA;
  const downloadLink = resumeLink || PERSONAL_INFO.resumeLink;
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleDownload = (e: React.MouseEvent) => {
    if (downloadState !== 'idle') return;
    
    setDownloadState('loading');
    
    // Simulate a tech-themed download process
    setTimeout(() => {
      setDownloadState('success');
      setTimeout(() => {
        setDownloadState('idle');
      }, 3000);
    }, 1800);
  };

  return (
    <div className="space-y-10 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Download Section */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter mb-6 md:mb-8">Milan Resume</h1>
        <a 
          href={downloadLink} 
          onClick={handleDownload}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 md:gap-4 transition-all group mb-8 md:mb-10 w-full sm:w-fit p-1 pr-4 rounded-xl md:rounded-2xl bg-[#121212] border border-[#222] hover:border-[#f59e0b]/40 ${
            downloadState === 'success' ? 'border-green-500/50' : ''
          }`}
        >
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center border transition-all shrink-0 ${
            downloadState === 'success' 
              ? 'border-green-500/50 bg-green-500/10 text-green-500' 
              : 'border-[#252525] group-hover:border-[#f59e0b]/50 text-[#f59e0b]'
          }`}>
            {/* Fix: Removed non-existent md:size prop and consolidated to a standard size={20} */}
            {downloadState === 'idle' && <Download size={20} />}
            {downloadState === 'loading' && <Loader2 size={20} className="animate-spin" />}
            {downloadState === 'success' && <CheckCircle2 size={20} />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest truncate ${
              downloadState === 'success' ? 'text-green-500' : 'text-gray-500'
            }`}>
              {downloadState === 'idle' && 'PDF Document'}
              {downloadState === 'loading' && 'Fetching...'}
              {downloadState === 'success' && 'Ready!'}
            </span>
            <span className={`text-[11px] md:text-[13px] font-bold truncate ${
              downloadState === 'loading' ? 'animate-pulse text-[#f59e0b]' : 'text-white'
            }`}>
              {downloadState === 'idle' && 'Download Milan Sharma Resume'}
              {downloadState === 'loading' && 'Establishing Connection...'}
              {downloadState === 'success' && 'Download Started'}
            </span>
          </div>
        </a>
      </div>

      {/* Resume Sections */}
      <div className="space-y-16 md:space-y-20">
        {dataList.map((section, sIdx) => (
          <div key={sIdx} className="relative">
            {/* Section Header */}
            <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#121212] flex items-center justify-center border border-[#222]">
                {iconMap[section.icon]}
              </div>
              <h3 className="text-base md:text-lg font-black text-white tracking-tight">{section.title}</h3>
            </div>

            {/* Timeline Items */}
            <div className="space-y-10 md:space-y-12 pl-2 md:pl-4">
              {section.items.map((item: ResumeItem, iIdx: number) => (
                <div key={iIdx} className="relative pl-7 md:pl-10">
                  {/* Timeline Line & Dot */}
                  <div className="absolute left-0 top-0 bottom-[-40px] md:bottom-[-48px] w-[1px] md:w-[2px] bg-[#222]"></div>
                  <div className="absolute left-[-3px] md:left-[-4px] top-1.5 w-2 w-2 md:w-2.5 md:h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]"></div>
                  
                  {/* Item Content */}
                  <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4">
                      <div className="min-w-0">
                        <h4 className="text-white font-black text-[13px] md:text-sm tracking-tight mb-1">{item.title}</h4>
                        <p className="text-[#f59e0b] text-[10px] md:text-[11px] font-bold uppercase tracking-wide">{item.subtitle}</p>
                        {item.location && (
                          <div className="flex items-center gap-2 text-gray-500 mt-2">
                             <MapPin size={12} className="text-[#f59e0b] shrink-0" />
                             <span className="text-[9px] md:text-[10px] font-medium truncate">{item.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-start md:items-end gap-1.5 md:gap-2 shrink-0">
                         {item.isRemote && (
                           <div className="flex items-center gap-2 text-gray-400">
                             <Pin size={10} className="text-pink-500" />
                             <span className="text-[9px] md:text-[10px] font-bold">Remote</span>
                           </div>
                         )}
                         {item.status === 'Online' && (
                           <div className="flex items-center gap-2 text-gray-400">
                             <Monitor size={10} className="text-pink-500" />
                             <span className="text-[9px] md:text-[10px] font-bold">Online</span>
                           </div>
                         )}
                         <div className="flex items-center gap-2 text-gray-400">
                           {item.isCurrent ? <Clock size={10} className="text-blue-400" /> : <Calendar size={10} className="text-gray-500" />}
                           <span className="text-[9px] md:text-[10px] font-bold">{item.dateRange}</span>
                         </div>
                      </div>
                    </div>

                    <ul className="space-y-2.5 md:space-y-3 mt-1 md:mt-2">
                      {item.bullets.map((bullet: string, bIdx: number) => (
                        <li key={bIdx} className="flex items-start gap-2 md:gap-3">
                          <span className="text-gray-500 mt-1.5 shrink-0">•</span>
                          <span className="text-gray-400 text-[11px] md:text-[12px] leading-relaxed font-medium">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resume;