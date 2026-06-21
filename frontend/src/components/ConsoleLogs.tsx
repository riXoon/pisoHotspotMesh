import { useState } from 'react';
import { useHotspot, type LogEntry } from '../context';
import { Terminal, Trash2, Copy, Check } from 'lucide-react';

export const ConsoleLogs = () => {
  const { logs, clearLogs } = useHotspot();
  const [copied, setCopied] = useState(false);

  const getLogStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-emerald-400 font-semibold';
      case 'warning':
        return 'text-amber-400';
      case 'error':
        return 'text-rose-400 font-semibold';
      case 'contract':
        return 'text-purple-400 border-l-2 border-purple-500/50 pl-2';
      case 'stellar':
        return 'text-cyan-400 border-l-2 border-cyan-500/50 pl-2';
      default:
        return 'text-slate-300';
    }
  };

  const getLogPrefix = (type: LogEntry['type']) => {
    switch (type) {
      case 'contract': return '[SOROBAN CONTRACT]';
      case 'stellar': return '[STELLAR LEDGER]';
      case 'success': return '[OK]';
      case 'warning': return '[WARN]';
      case 'error': return '[ERROR]';
      default: return '[SYS]';
    }
  };

  const copyToClipboard = () => {
    const text = logs.map(l => `[${l.timestamp}] ${getLogPrefix(l.type)} ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel flex flex-col h-[350px] md:h-full min-h-[300px] bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden font-mono shadow-2xl">
      {/* Console Header */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Agent billing & ledger console
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            title="Copy Logs"
            className="p-1.5 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-lg transition-colors duration-150"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={clearLogs}
            title="Clear Logs"
            className="p-1.5 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition-colors duration-150"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col-reverse gap-2 bg-slate-950/60">
        {logs.length === 0 ? (
          <div className="text-slate-500 text-xs text-center py-8">
            Console empty. Awaiting agent activity...
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="text-xs leading-relaxed transition-all duration-200">
              <span className="text-slate-600 mr-2 select-none">[{log.timestamp}]</span>
              <span className="text-slate-500 font-semibold mr-1.5 select-none">{getLogPrefix(log.type)}</span>
              <span className={getLogStyle(log.type)}>{log.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
