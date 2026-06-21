import { useState, useEffect } from 'react';
import { useHotspot } from '../context';
import { Wifi, ArrowRight, Zap, Play, Square, CircleDollarSign } from 'lucide-react';

export const ConsumerPortal = () => {
  const {
    walletConnected,
    walletAddress,
    usdcBalance,
    xlmBalance,
    allowanceApproved,
    isSessionActive,
    sessionDuration,
    totalCharged,
    startSession,
    stopSession,
    connectWallet,
    approveAllowance,
    connecting,
    approving,
    routerOnline
  } = useHotspot();

  const [allowanceLimit, setAllowanceLimit] = useState(1.00);
  const [downloadSpeed, setDownloadSpeed] = useState(50.0);
  const [uploadSpeed, setUploadSpeed] = useState(20.0);

  // Simulate minor fluctuations in speed when active
  useEffect(() => {
    if (!isSessionActive) return;
    const interval = setInterval(() => {
      setDownloadSpeed(45 + Math.random() * 8);
      setUploadSpeed(18 + Math.random() * 4);
    }, 2000);
    return () => clearInterval(interval);
  }, [isSessionActive]);

  // Format addresses for display
  const formatAddr = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}`;
  };

  return (
    <div className="glass-panel border-cyan-500/10 flex flex-col h-full bg-slate-900/40 p-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Component Title */}
      <div className="flex items-center gap-2 mb-6">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
        </span>
        <h2 className="text-md font-bold tracking-wider text-cyan-400 uppercase font-mono m-0">
          Client Captive Portal Gateway
        </h2>
      </div>

      {/* State 1: Disconnected */}
      {!walletConnected && (
        <div className="flex-1 flex flex-col justify-center items-center text-center py-8 px-4">
          <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-full mb-4 animate-pulse-slow">
            <Wifi className="w-12 h-12 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">
            Connect to DePIN Mesh Wifi
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
            Welcome to <span className="text-cyan-400 font-semibold">PisoHotspot Mesh</span>. Complete the quick captive verification by connecting your wallet to browse at high speeds.
          </p>

          {/* Node Summary details */}
          <div className="w-full max-w-xs grid grid-cols-2 gap-3 mb-8 bg-slate-950/40 border border-slate-800 p-4 rounded-xl font-mono text-left">
            <div>
              <span className="text-[10px] text-slate-500 block">HOTSPOT NODE</span>
              <span className="text-xs text-slate-300 font-semibold">Provincial_#12</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">BANDWIDTH</span>
              <span className="text-xs text-slate-300 font-semibold">50 Mbps down</span>
            </div>
            <div className="col-span-2 border-t border-slate-800/80 pt-2 mt-1">
              <span className="text-[10px] text-slate-500 block">USDC RATE</span>
              <span className="text-xs text-cyan-400 font-bold">0.01 USDC / minute</span>
            </div>
          </div>

          <button
            onClick={connectWallet}
            disabled={connecting}
            className="w-full max-w-xs py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 hover:shadow-lg hover:shadow-cyan-500/10 rounded-xl font-bold text-sm transition-all duration-200"
          >
            {connecting ? 'Initializing Freighter...' : 'Connect Wallet to Access'}
          </button>
        </div>
      )}

      {/* State 2: Wallet Connected but No Allowance Approved */}
      {walletConnected && allowanceApproved <= 0 && (
        <div className="flex-1 flex flex-col justify-center py-4">
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 mb-6">
            <span className="text-xs text-slate-500 font-mono block">CONNECTED WALLET</span>
            <span className="text-sm font-mono text-cyan-400 break-all">{formatAddr(walletAddress)}</span>
            
            <div className="grid grid-cols-2 gap-4 mt-3 border-t border-slate-800 pt-3">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">USDC Balance</span>
                <span className="text-md font-bold font-mono text-slate-200">${usdcBalance.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">XLM Balance</span>
                <span className="text-md font-bold font-mono text-slate-200">{xlmBalance.toFixed(4)} XLM</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 bg-cyan-950/10 border border-cyan-500/20 p-4 rounded-xl mb-6">
            <CircleDollarSign className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase mb-1">Soroban Allowance Delegation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                PisoHotspot Mesh bills per minute. Sign a Soroban <code className="text-cyan-400 bg-cyan-950/30 px-1 py-0.5 rounded text-[11px]">approve</code> transaction. The host will pull USDC in micro-amounts ($0.01/min) only while you are active. You can revoke it anytime.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-300">Set Spend Allowance Limit:</span>
              <span className="font-bold text-cyan-400 font-mono">${allowanceLimit.toFixed(2)} USDC</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="5.00"
              step="0.10"
              value={allowanceLimit}
              onChange={(e) => setAllowanceLimit(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$0.10</span>
              <span>$1.00</span>
              <span>$2.50</span>
              <span>$5.00</span>
            </div>
          </div>

          <button
            onClick={() => approveAllowance(allowanceLimit)}
            disabled={approving || !routerOnline}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 hover:shadow-lg hover:shadow-cyan-500/10 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {approving ? (
              <>
                <Zap className="w-4 h-4 animate-bounce" />
                Signing Soroban Approve...
              </>
            ) : (
              <>
                <span>Approve & Enable Hotspot Access</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* State 3: Wallet Connected + Allowance Approved, but session is not active */}
      {walletConnected && allowanceApproved > 0 && !isSessionActive && (
        <div className="flex-1 flex flex-col justify-center items-center text-center py-6">
          <div className="w-16 h-16 bg-slate-950/60 border border-cyan-500/30 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
            <Wifi className="w-8 h-8 text-cyan-400" />
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 w-full max-w-sm mb-6 font-mono text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">WALLET:</span>
              <span className="text-slate-300">{formatAddr(walletAddress)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">APPROVED ALLOWANCE:</span>
              <span className="text-cyan-400 font-bold">${allowanceApproved.toFixed(2)} USDC</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">YOUR BALANCE:</span>
              <span className="text-slate-300 font-semibold">${usdcBalance.toFixed(2)} USDC</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-xs mb-8 leading-relaxed">
            Click connect below to open the captive portal connection. Micropayments will begin and Wifi connectivity will be activated.
          </p>

          <button
            onClick={startSession}
            disabled={!routerOnline}
            className="w-full max-w-xs py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm hover:shadow-lg rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Connect to Mesh Wifi
          </button>
        </div>
      )}

      {/* State 4: Session Active */}
      {walletConnected && isSessionActive && (
        <div className="flex-1 flex flex-col justify-between py-2">
          {/* Uptime Glow timer */}
          <div className="text-center py-6">
            <span className="text-[10px] text-cyan-500 tracking-widest font-mono uppercase font-semibold block mb-1">
              Active Connection Duration
            </span>
            <div className="text-4xl font-extrabold text-cyan-400 font-mono tracking-wider glow-text-cyan">
              {sessionDuration} <span className="text-lg font-medium text-slate-400">MINS</span>
            </div>
            <span className="text-xs text-slate-500 mt-2 block font-mono">
              Speed Multiplier active: 1s = 1m
            </span>
          </div>

          {/* Bandwidth Monitor Animation */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-4 mb-4 relative overflow-hidden">
            {/* Speed stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Download Speed</span>
                <span className="text-md font-bold font-mono text-emerald-400">{downloadSpeed.toFixed(1)} Mbps</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Upload Speed</span>
                <span className="text-md font-bold font-mono text-cyan-400">{uploadSpeed.toFixed(1)} Mbps</span>
              </div>
            </div>

            {/* Glowing animated wave graph */}
            <div className="h-12 w-full flex items-end gap-0.5 relative pt-4 overflow-hidden">
              <svg className="w-full h-full stroke-cyan-500/50 fill-none stroke-[2]" viewBox="0 0 300 50">
                <path d="M0,25 Q15,5 30,25 T60,25 T90,25 T120,25 T150,25 T180,25 T210,25 T240,25 T270,25 T300,25" className="animate-[pulse-slow_2s_infinite]">
                  <animate attributeName="d" 
                    values="M0,25 Q15,5 30,25 T60,25 T90,25 T120,25 T150,25 T180,25 T210,25 T240,25 T270,25 T300,25;
                            M0,25 Q15,45 30,25 T60,25 T90,5 T120,25 T150,45 T180,25 T210,5 T240,25 T270,45 T300,25;
                            M0,25 Q15,5 30,25 T60,25 T90,25 T120,25 T150,25 T180,25 T210,25 T240,25 T270,25 T300,25" 
                    dur="5s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
          </div>

          {/* Session accounting ledger details */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-500">BILLED RATE:</span>
              <span className="text-slate-300">0.01 USDC/sim-min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">REMAINING ALLOWANCE:</span>
              <span className="text-cyan-400 font-bold">${allowanceApproved.toFixed(2)} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TOTAL PAID:</span>
              <span className="text-emerald-400 font-bold">${totalCharged.toFixed(2)} USDC</span>
            </div>
            <div className="flex justify-between border-t border-slate-850 pt-2 mt-2">
              <span className="text-slate-500">MY BAL:</span>
              <span className="text-slate-300">${usdcBalance.toFixed(2)} USDC</span>
            </div>
          </div>

          <button
            onClick={stopSession}
            className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Square className="w-3.5 h-3.5 fill-rose-400 stroke-none" />
            Disconnect Wi-Fi Session
          </button>
        </div>
      )}
    </div>
  );
};
