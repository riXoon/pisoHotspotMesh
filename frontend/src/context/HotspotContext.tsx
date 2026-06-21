import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { mockStellarService, BACKEND_NODE_ADDRESS } from '../services';

export interface LogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'contract' | 'stellar';
}

interface HotspotContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  usdcBalance: number;
  xlmBalance: number;
  allowanceApproved: number;
  isSessionActive: boolean;
  sessionDuration: number; // in simulated minutes
  totalCharged: number; // in USDC
  speedMultiplier: number; // 1x or 60x (1s real = 1m sim)
  hostBalance: number;
  logs: LogEntry[];
  routerOnline: boolean;
  freighterInstalled: boolean;
  connecting: boolean;
  approving: boolean;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  approveAllowance: (amount: number) => Promise<void>;
  startSession: () => void;
  stopSession: () => void;
  addLog: (text: string, type: LogEntry['type']) => void;
  clearLogs: () => void;
  
  // Simulation Controls
  drainBuyerBalance: () => void;
  revokeBuyerAllowance: () => void;
  toggleRouterStatus: () => void;
  toggleSpeedMultiplier: () => void;
  resetSimulation: () => void;
}

const HotspotContext = createContext<HotspotContextType | undefined>(undefined);

export const HotspotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState(10.00); // Start with $10 USDC
  const [xlmBalance, setXlmBalance] = useState(25.5);    // Start with 25.5 XLM (for fees reference)
  const [allowanceApproved, setAllowanceApproved] = useState(0.00); // Spender allowance
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0); // Billed minutes
  const [totalCharged, setTotalCharged] = useState(0.00);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1x vs 60x speedup
  const [hostBalance, setHostBalance] = useState(0.00);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [routerOnline, setRouterOnline] = useState(true);
  const [freighterInstalled, setFreighterInstalled] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [approving, setApproving] = useState(false);

  const billingTimerRef = useRef<any>(null);

  // Initialize checks
  useEffect(() => {
    mockStellarService.isFreighterInstalled().then(installed => {
      setFreighterInstalled(installed);
      addLog(`Stellar ecosystem detected. Freighter extension ${installed ? 'available' : 'not detected'}.`, 'info');
    });

    addLog('Decentralized Host Router Initialized. Captive portal awaiting network requests.', 'info');
  }, []);

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp,
      text,
      type
    };
    setLogs(prev => [newEntry, ...prev.slice(0, 99)]); // Limit to last 100 logs
  };

  const clearLogs = () => setLogs([]);

  const connectWallet = async () => {
    setConnecting(true);
    addLog('Freighter wallet connection requested...', 'info');
    try {
      const address = await mockStellarService.connectWallet();
      setWalletAddress(address);
      setWalletConnected(true);
      addLog(`Wallet connected successfully: ${address.substring(0, 6)}...${address.substring(address.length - 6)}`, 'success');
      addLog(`Buyer account balances: ${usdcBalance.toFixed(2)} USDC | ${xlmBalance.toFixed(4)} XLM`, 'info');
    } catch (err) {
      addLog('Freighter connection rejected by user.', 'error');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    setIsSessionActive(false);
    setAllowanceApproved(0);
    addLog('Wallet disconnected. Active Wi-Fi session terminated.', 'warning');
  };

  const approveAllowance = async (amount: number) => {
    if (!walletAddress) return;
    setApproving(true);
    addLog(`Initiating Soroban allowance approval for Spender Node: ${BACKEND_NODE_ADDRESS.substring(0, 10)}...`, 'info');
    addLog(`Soroban operation: token::approve(buyer, spender, amount: ${(amount * 1000000).toLocaleString()} stroops)`, 'contract');
    
    try {
      const result = await mockStellarService.approveAllowance(walletAddress, amount);
      setAllowanceApproved(amount);
      addLog(`Allowance approved successfully. Spender can draw up to ${amount.toFixed(2)} USDC.`, 'success');
      addLog(`Approve Tx Hash: ${result.txHash.substring(0, 20)}...`, 'stellar');
    } catch (err) {
      addLog('Approval transaction signature rejected by user.', 'error');
    } finally {
      setApproving(false);
    }
  };

  const startSession = () => {
    if (!routerOnline) {
      addLog('Cannot start session: Local host router is currently offline.', 'error');
      return;
    }
    if (allowanceApproved < 0.01) {
      addLog('Cannot start session: USDC allowance must be at least 0.01 USDC.', 'warning');
      return;
    }
    if (usdcBalance < 0.01) {
      addLog('Cannot start session: Buyer balance must be at least 0.01 USDC.', 'warning');
      return;
    }

    setIsSessionActive(true);
    addLog('Mesh Network connection established. Wi-Fi captive gateway open.', 'success');
    addLog(`Billing daemon starting: 0.01 USDC / minute. Spender: ${BACKEND_NODE_ADDRESS.substring(0, 8)}...`, 'info');
  };

  const stopSession = () => {
    setIsSessionActive(false);
    addLog('Wi-Fi session manually disconnected by user.', 'info');
  };

  // Run the background billing loop when the session is active
  useEffect(() => {
    if (!isSessionActive) {
      if (billingTimerRef.current) clearInterval(billingTimerRef.current);
      return;
    }

    const CHARGE_PER_MINUTE = 0.01; // $0.01 USDC

    const runBillingCycle = async () => {
      // 1. Router online check
      if (!routerOnline) {
        setIsSessionActive(false);
        addLog('Billing aborted: Router node went offline. Wi-Fi disconnected.', 'error');
        return;
      }

      // Read current state values via refs or functional updates to avoid closures
      // We will perform updates in nested setState callbacks to guarantee fresh balances
      let shouldHalt = false;
      let haltReason = '';

      setAllowanceApproved(currentAllowance => {
        if (currentAllowance < CHARGE_PER_MINUTE) {
          shouldHalt = true;
          haltReason = 'allowance';
        }
        return currentAllowance;
      });

      setUsdcBalance(currentBalance => {
        if (currentBalance < CHARGE_PER_MINUTE) {
          shouldHalt = true;
          haltReason = 'balance';
        }
        return currentBalance;
      });

      if (shouldHalt) {
        setIsSessionActive(false);
        if (haltReason === 'allowance') {
          addLog('Billing stopped: Approved USDC allowance has been fully consumed or revoked.', 'warning');
          addLog('Tip: Sign another Soroban approve transaction to restore connectivity.', 'info');
        } else {
          addLog('Billing stopped: Buyer wallet balance has dropped below 0.01 USDC.', 'warning');
        }
        return;
      }

      // Execute billing logic
      addLog(`[Billing Cycle] Spender Node triggers billing transfer...`, 'info');
      addLog(`Soroban invoke: PisoHotspotContract::charge_minute(token: USDC, buyer: G..., seller: G..., amount: 10000 stroops)`, 'contract');
      
      try {
        const result = await mockStellarService.chargeMinute(walletAddress || 'G_BUYER', CHARGE_PER_MINUTE);
        
        // Success: Update balances
        setUsdcBalance(prev => prev - CHARGE_PER_MINUTE);
        setAllowanceApproved(prev => prev - CHARGE_PER_MINUTE);
        setHostBalance(prev => prev + CHARGE_PER_MINUTE);
        setSessionDuration(prev => prev + 1);
        setTotalCharged(prev => prev + CHARGE_PER_MINUTE);

        addLog(`Smart contract successfully billed 0.01 USDC.`, 'success');
        addLog(`Soroban charge_minute Tx: ${result.txHash.substring(0, 16)}...`, 'stellar');
        addLog(`Fee Bump Wrap Tx (Host pays ${result.gasFeeXlm.toFixed(4)} XLM): ${result.feeBumpHash.substring(0, 16)}...`, 'stellar');
      } catch (err) {
        setIsSessionActive(false);
        addLog('Billing transaction failed: network router node error.', 'error');
      }
    };

    // Calculate billing interval: real 60s at 1x speed, or 1s at 60x speed
    const intervalTime = speedMultiplier === 60 ? 1000 : 60000;
    
    // Trigger first bill immediately on connect, then standard intervals
    runBillingCycle();

    billingTimerRef.current = setInterval(() => {
      runBillingCycle();
    }, intervalTime);

    return () => {
      if (billingTimerRef.current) clearInterval(billingTimerRef.current);
    };
  }, [isSessionActive, speedMultiplier, walletAddress, routerOnline]);



  // Simulation Controls
  const drainBuyerBalance = () => {
    setUsdcBalance(0);
    addLog('Simulation Command: Buyer wallet USDC balance drained to $0.00.', 'warning');
  };

  const revokeBuyerAllowance = () => {
    setAllowanceApproved(0);
    addLog('Simulation Command: Buyer revoked USDC allowance to $0.00.', 'warning');
    addLog('Soroban invoke: token::approve(buyer, spender, amount: 0)', 'contract');
  };

  const toggleRouterStatus = () => {
    setRouterOnline(prev => {
      const next = !prev;
      addLog(`Simulation Command: Local Hotspot Router is now ${next ? 'ONLINE' : 'OFFLINE'}.`, next ? 'success' : 'error');
      return next;
    });
  };

  const toggleSpeedMultiplier = () => {
    setSpeedMultiplier(prev => {
      const next = prev === 1 ? 60 : 1;
      addLog(`Simulation Command: Clock set to ${next}x speed. (${next === 60 ? '1 second = 1 billing minute' : 'Real-time billing'})`, 'info');
      return next;
    });
  };

  const resetSimulation = () => {
    setIsSessionActive(false);
    setUsdcBalance(10.00);
    setXlmBalance(25.5);
    setAllowanceApproved(0.00);
    setSessionDuration(0);
    setTotalCharged(0.00);
    setHostBalance(0.00);
    setRouterOnline(true);
    setSpeedMultiplier(1);
    addLog('Simulation reset. Buyer wallet, host earnings, and allowances restored.', 'info');
  };

  return (
    <HotspotContext.Provider value={{
      walletConnected,
      walletAddress,
      usdcBalance,
      xlmBalance,
      allowanceApproved,
      isSessionActive,
      sessionDuration,
      totalCharged,
      speedMultiplier,
      hostBalance,
      logs,
      routerOnline,
      freighterInstalled,
      connecting,
      approving,
      connectWallet,
      disconnectWallet,
      approveAllowance,
      startSession,
      stopSession,
      addLog,
      clearLogs,
      drainBuyerBalance,
      revokeBuyerAllowance,
      toggleRouterStatus,
      toggleSpeedMultiplier,
      resetSimulation
    }}>
      {children}
    </HotspotContext.Provider>
  );
};

export const useHotspot = () => {
  const context = useContext(HotspotContext);
  if (context === undefined) {
    throw new Error('useHotspot must be used within a HotspotProvider');
  }
  return context;
};
