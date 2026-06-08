
import React from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2 mb-6 font-mono text-sm">
      <span className="text-[#f59e0b] font-bold text-base">$</span>
      <h2 className="text-gray-300 font-bold flex items-center gap-2">
        ls -al {title}
        <span className="inline-block w-[2px] h-4 bg-[#f59e0b] cursor-blink"></span>
      </h2>
    </div>
  );
};

export default SectionHeader;
