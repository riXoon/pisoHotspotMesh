import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'emerald' | 'default';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default'
}) => {
  const getPanelClass = () => {
    switch (variant) {
      case 'cyan': return 'glass-panel-cyan';
      case 'purple': return 'glass-panel-purple';
      case 'emerald': return 'bg-slate-900/60 backdrop-blur-md border border-emerald-500/20 shadow-2xl shadow-emerald-950/10 rounded-2xl';
      default: return 'glass-panel';
    }
  };

  const getIconClass = () => {
    switch (variant) {
      case 'cyan': return 'bg-cyan-500/10 text-cyan-400';
      case 'purple': return 'bg-purple-500/10 text-purple-400';
      case 'emerald': return 'bg-emerald-500/10 text-emerald-400';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className={`p-5 flex items-start justify-between ${getPanelClass()} transition-all duration-300 hover:translate-y-[-2px]`}>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
          {title}
        </span>
        <span className="text-2xl font-bold text-slate-50 tracking-tight font-mono">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-slate-500">
            {subtitle}
          </span>
        )}
      </div>
      <div className={`p-2.5 rounded-xl ${getIconClass()}`}>
        {icon}
      </div>
    </div>
  );
};
