import { useHotspot } from '../context';
import { 
  WifiOff, 
  Trash2, 
  RotateCcw, 
  Activity, 
  Gauge, 
  Server, 
  Eye,
  FastForward
} from 'lucide-react';
import { MetricCard } from './MetricCard';

export const HostDashboard = () => {
  const {
    isSessionActive,
    speedMultiplier,
    hostBalance,
    routerOnline,
    allowanceApproved,
    usdcBalance,
    walletConnected,
    drainBuyerBalance,
    revokeBuyerAllowance,
    toggleRouterStatus,
    toggleSpeedMultiplier,
    resetSimulation
  } = useHotspot();

  return (
    <div className="glass-panel border-purple-500/10 flex flex-col h-full bg-slate-900/40 p-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Component Title */}
      <div className="flex items-center gap-2 mb-6">
        <Server className="w-5 h-5 text-purple-400" />
        <h2 className="text-md font-bold tracking-wider text-purple-400 uppercase font-mono m-0">
          Host Router & Simulator Dashboard
        </h2>
      </div>

      {/* Host Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <MetricCard
          title="Host Earnings"
          value={`$${hostBalance.toFixed(2)} USDC`}
          subtitle="Revenue from billing cycle"
          variant="emerald"
          icon={<Gauge className="w-4 h-4" />}
        />
        <MetricCard
          title="Active Clients"
          value={isSessionActive ? "1 Client" : "0 Clients"}
          subtitle={isSessionActive ? "Provincial Boarder #1" : "No active users"}
          variant={isSessionActive ? "cyan" : "default"}
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      {/* Simulator Controls Wrapper */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2 mb-3">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
              Simulation Sandbox Controls
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Test the DePIN system's edge cases and Soroban micro-billing failure mitigations in real time by triggering the actions below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Speed Multiplier Button */}
            <button
              onClick={toggleSpeedMultiplier}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
                speedMultiplier === 60
                  ? 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold font-mono">CLOCK SPEED</span>
                <span className="text-[10px] text-slate-500">
                  {speedMultiplier === 60 ? 'Fast-Forward (1s = 1m)' : 'Real-time billing'}
                </span>
              </div>
              <FastForward className={`w-4 h-4 ${speedMultiplier === 60 ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
            </button>

            {/* Toggle Router Online/Offline */}
            <button
              onClick={toggleRouterStatus}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
                !routerOnline
                  ? 'bg-rose-950/25 border-rose-500/40 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold font-mono">ROUTER STATUS</span>
                <span className="text-[10px] text-slate-500">
                  {routerOnline ? 'Simulate Router Dropout' : 'Restore WiFi Router'}
                </span>
              </div>
              <WifiOff className={`w-4 h-4 ${!routerOnline ? 'text-rose-400' : 'text-slate-500'}`} />
            </button>

            {/* Drain Buyer Balance */}
            <button
              onClick={drainBuyerBalance}
              disabled={!walletConnected || usdcBalance === 0}
              className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 hover:border-amber-500/40 hover:bg-amber-950/10 text-slate-300 hover:text-amber-400 rounded-xl text-left transition-all duration-200 disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-500 disabled:hover:bg-slate-900"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold font-mono">DRAIN BUYER BAL</span>
                <span className="text-[10px] text-slate-500">Simulate empty wallet</span>
              </div>
              <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
            </button>

            {/* Revoke Spender Allowance */}
            <button
              onClick={revokeBuyerAllowance}
              disabled={!walletConnected || allowanceApproved === 0}
              className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 hover:border-rose-500/40 hover:bg-rose-950/10 text-slate-300 hover:text-rose-400 rounded-xl text-left transition-all duration-200 disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-500 disabled:hover:bg-slate-900"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold font-mono">REVOKE ALLOWANCE</span>
                <span className="text-[10px] text-slate-500">Clear Spender allowance</span>
              </div>
              <WifiOff className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Global Reset */}
        <div className="mt-8 border-t border-slate-850 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Eye className="w-3.5 h-3.5" />
            <span>Reset buyer balances & limits</span>
          </div>
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold font-mono transition-all duration-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
        </div>
      </div>
    </div>
  );
};
