import { useHotspot } from '../context';
import { Wifi, Wallet, RefreshCw, ShieldCheck } from 'lucide-react';

export const Header = () => {
  const { 
    walletConnected, 
    walletAddress, 
    routerOnline, 
    connectWallet, 
    disconnectWallet,
    connecting 
  } = useHotspot();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Brand Logo & Info */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-tr from-cyan-500 to-emerald-500 rounded-xl shadow-lg shadow-cyan-500/10">
          <Wifi className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent m-0 tracking-tight leading-none">
            PisoHotspot Mesh
          </h1>
          <span className="text-xs text-slate-400 tracking-wider uppercase font-semibold font-mono">
            DePIN Captive Portal
          </span>
        </div>
      </div>

      {/* Connection Badges & Action */}
      <div className="flex items-center flex-wrap gap-3">
        {/* Router Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${
          routerOnline 
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${routerOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
          Router: {routerOnline ? 'ONLINE' : 'OFFLINE'}
        </div>

        {/* Network Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Stellar Testnet
        </div>

        {/* Wallet Connect Button */}
        {walletConnected && walletAddress ? (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-mono text-cyan-400">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
            </div>
            <button
              onClick={disconnectWallet}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 border border-slate-700 hover:border-red-500/50 hover:bg-red-950/20 text-slate-300 hover:text-red-400 rounded-xl text-xs font-semibold transition-all duration-200"
            >
              <Wallet className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 hover:shadow-cyan-500/10 hover:shadow-lg rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-50"
          >
            {connecting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wallet className="w-3.5 h-3.5" />
            )}
            {connecting ? 'Connecting...' : 'Connect Freighter'}
          </button>
        )}
      </div>
    </header>
  );
};
