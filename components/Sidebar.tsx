import React, { useState } from 'react';
import { Github, Linkedin, Mail, MapPin, Smartphone, Phone, Globe, ExternalLink, Package } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

interface SidebarProps {
  profile?: {
    name: string;
    role: string;
    location: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    avatar: string;
  };
  onAdminTrigger?: () => void;
  onNavigate?: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ profile, onAdminTrigger, onNavigate }) => {
  const info = profile || PERSONAL_INFO;
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleAvatarClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 1500) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount >= 3) {
        if (onAdminTrigger) onAdminTrigger();
        setClickCount(0);
      }
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
  };

  return (
    <aside className="w-full lg:w-[340px] flex-shrink-0 lg:sticky lg:top-10 self-start z-20 h-fit">
      <div className="bg-[#1a1a1a] rounded-[32px] md:rounded-[48px] p-6 md:p-10 border border-[#222] main-card-shadow flex flex-col items-center relative overflow-hidden group transition-all duration-300 hover:border-[#f59e0b]/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f59e0b]/40 to-transparent"></div>
        
        <div 
          onClick={handleAvatarClick}
          className="w-36 h-36 md:w-52 md:h-52 rounded-[32px] md:rounded-[44px] overflow-hidden mb-6 md:mb-8 border-[4px] md:border-[6px] border-[#252525] shadow-2xl bg-[#121212] group-hover:border-[#f59e0b]/20 transition-all duration-500 relative cursor-pointer active:scale-95 select-none"
        >
          <img 
            src={info.avatar} 
            alt={`${info.name} - Product Manager`} 
            className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-110"
          />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3 tracking-tighter text-center">{info.name}</h2>
        <div className="bg-[#121212] text-gray-400 text-[9px] md:text-[10px] font-black py-2 px-5 md:py-2.5 md:px-6 rounded-xl md:rounded-2xl mb-3 border border-[#252525] text-center uppercase tracking-widest">
          {info.role}
        </div>

        <a 
          href="https://www.linkedin.com/company/nexatechnology-pvt-ltd/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 hover:border-[#f59e0b]/50 hover:bg-[#f59e0b]/20 rounded-xl text-[10px] font-black tracking-wider uppercase mb-8 transition-all duration-300 shadow-sm"
        >
          Founder of Nexa Technologies
          <ExternalLink size={12} />
        </a>

        <button
          onClick={() => onNavigate?.('products')}
          className="w-full flex items-center justify-center gap-2.5 bg-[#121212] hover:bg-[#f59e0b]/10 text-gray-400 hover:text-[#f59e0b] border border-[#252525] hover:border-[#f59e0b]/30 py-2.5 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 mb-8"
        >
          <Package size={14} />
          Products
        </button>
        
        <div className="w-full space-y-5 md:space-y-7 text-left pt-8 md:pt-10 border-t border-[#252525]">
          <ContactItem icon={<MapPin size={18} />} label="LOCATION" value={info.location} />
          <ContactItem icon={<Mail size={18} />} label="EMAIL" value={info.email} />
          <ContactItem icon={<Phone size={18} />} label="PHONE" value={info.phone} />
          <ContactItem icon={<Github size={18} />} label="GITHUB" value={`@${info.github}`} link={`https://github.com/${info.github}`} />
          <ContactItem icon={<Linkedin size={18} />} label="LINKEDIN" value={info.linkedin} link={`https://linkedin.com/in/${info.linkedin}`} />
        </div>

        <div className="mt-8 md:mt-12 flex gap-5 md:gap-6 text-gray-600">
           <a href={`tel:${info.phone}`} aria-label="Call Phone" title="Call Phone" className="hover:text-[#f59e0b] transition-colors"><Smartphone size={18} /></a>
           <a href={`https://linkedin.com/in/${info.linkedin}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" title="LinkedIn Profile" className="hover:text-[#f59e0b] transition-colors"><Linkedin size={18} /></a>
           <a href={`https://github.com/${info.github}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" title="GitHub Profile" className="hover:text-[#f59e0b] transition-colors"><Github size={18} /></a>
           <a href="#" aria-label="Personal Website" title="Personal Website" className="hover:text-[#f59e0b] transition-colors"><Globe size={18} /></a>
        </div>
        

        <div className="mt-6 md:mt-8 text-[8px] md:text-[9px] text-gray-700 font-mono tracking-[0.3em] uppercase">
          &copy; 2024 <span className="text-[#f59e0b] font-black">MILAN.SH</span>
        </div>
      </div>
    </aside>
  );
};

const ContactItem = ({ icon, label, value, link }: { icon: React.ReactNode, label: string, value: string, link?: string }) => (
  <div className="flex items-center gap-4 md:gap-5 group/contact cursor-default">
    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-[#121212] flex items-center justify-center text-[#f59e0b] border border-[#222] flex-shrink-0 group-hover/contact:border-[#f59e0b]/40 transition-all">
      {/* Fix: Casting icon to React.ReactElement<any> allows the 'size' property to be injected during cloning without TS error */}
      {React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}
    </div>
    <div className="min-w-0 flex-1">
      <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.15em] md:tracking-[0.2em] mb-0.5 md:mb-1 block">{label}</span>
      {link ? (
        <a href={link} target="_blank" className="text-[12px] md:text-[13px] text-gray-300 truncate font-bold group-hover/contact:text-white transition-colors block">{value}</a>
      ) : (
        <span className="text-[12px] md:text-[13px] text-gray-300 truncate font-bold group-hover/contact:text-white transition-colors block">{value}</span>
      )}
    </div>
  </div>
);

export default Sidebar;