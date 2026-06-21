import { HotspotProvider } from './context';
import { Header, ConsumerPortal, HostDashboard, ConsoleLogs } from './components';
import { Info, Cpu, Coins, Key } from 'lucide-react';

function App() {
  return (
    <HotspotProvider>
      <div className="min-h-screen flex flex-col font-sans text-slate-100 grid-bg selection:bg-cyan-500/20 selection:text-cyan-300">
        
        {/* Navigation bar */}
        <Header />

        {/* Core Layout */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Panel: Consumer Captive Portal */}
          <div className="h-full">
            <ConsumerPortal />
          </div>

          {/* Right Panel: Host & Simulated Ledger Console */}
          <div className="flex flex-col gap-6 h-full justify-between">
            {/* Host Panel */}
            <div className="flex-1">
              <HostDashboard />
            </div>
            
            {/* Live Terminal Ledger Console */}
            <div className="h-[280px]">
              <ConsoleLogs />
            </div>
          </div>
        </main>

        {/* DePIN / Soroban Feature Walkthrough Cards */}
        <section className="max-w-7xl w-full mx-auto px-4 md:px-6 pb-12 mt-6">
          <div className="border-t border-slate-800/80 pt-8">
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-cyan-400" />
              <h3 className="text-md font-bold tracking-wider text-slate-300 font-mono uppercase">
                Stellar DePIN Architecture Breakdown
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Allowances */}
              <div className="p-5 bg-slate-900/35 border border-slate-800 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg w-fit mb-3">
                  <Key className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mb-1.5 font-mono uppercase">
                  1. Soroban Allowances
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instead of pre-paying large amounts, the buyer signs a single Soroban <code className="text-cyan-300 font-mono bg-cyan-950/20 px-1 py-0.5 rounded text-[11px]">approve</code> transaction. This grants the Host Router Node permission to charge the wallet incrementally.
                </p>
              </div>

              {/* Feature 2: Automated Billing */}
              <div className="p-5 bg-slate-900/35 border border-slate-800 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg w-fit mb-3">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mb-1.5 font-mono uppercase">
                  2. Recurring charge_minute
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A background daemon running on the virtual router submits a Soroban <code className="text-purple-300 font-mono bg-purple-950/20 px-1 py-0.5 rounded text-[11px]">transfer_from</code> every 60 seconds. Billing ceases instantly if the buyer disconnects or revokes allowance.
                </p>
              </div>

              {/* Feature 3: Fee Bumping */}
              <div className="p-5 bg-slate-900/35 border border-slate-800 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit mb-3">
                  <Coins className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mb-1.5 font-mono uppercase">
                  3. Fee Bump Wrapper
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To eliminate gas friction for the Wi-Fi consumer, the backend router wraps each recurring transfer inside a Stellar **Fee Bump Transaction**, paying the fractional XLM gas fee on the buyer's behalf.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500 font-mono mt-auto">
          PisoHotspot Mesh © 2026. Web3 Captive Portal. Built with React, Tailwind, and Soroban.
        </footer>
      </div>
    </HotspotProvider>
  );
}

export default App;
