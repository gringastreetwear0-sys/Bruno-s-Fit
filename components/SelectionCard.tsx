import React from 'react';

interface SelectionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ label, selected, onClick, icon }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center h-full min-h-[120px]
        ${selected 
          ? 'border-primary bg-primary/10 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
          : 'border-slate-700 bg-surface text-slate-400 hover:border-slate-500 hover:text-white'
        }
      `}
    >
      {icon && <div className={`text-2xl ${selected ? 'text-primary' : 'text-slate-500'}`}>{icon}</div>}
      <span className="font-medium text-sm sm:text-base">{label}</span>
    </div>
  );
};