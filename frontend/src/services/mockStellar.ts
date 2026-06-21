export interface MockTransaction {
  hash: string;
  op: string;
  status: 'SUCCESS' | 'FAILED';
  fee: number;
  timestamp: string;
  details: string;
}

export const generateMockTxHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Generates a mock Stellar public key
export const generateMockAddress = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let address = 'G';
  for (let i = 0; i < 55; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

export const HOTSPOT_CONTRACT_ADDRESS = 'CCM3W5W...M25WPHY'; // Simulated Soroban contract ID
export const BACKEND_NODE_ADDRESS = 'GBACKEND...ROUTER2';    // Authorized virtual router node
export const SELLER_ADDRESS = 'GSELLER...WIFIHOST1';         // Wifi Host seller address
export const USDC_ASSET_CONTRACT = 'CAUSDC...TESTNET';        // USDC Testnet contract ID

export const mockStellarService = {
  isFreighterInstalled: async (): Promise<boolean> => {
    // Simulates checking for Freighter extension installation
    return new Promise((resolve) => setTimeout(() => resolve(true), 300));
  },

  connectWallet: async (): Promise<string> => {
    // Simulates Freighter connection
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockAddress());
      }, 800);
    });
  },

  approveAllowance: async (
    _buyerAddress: string,
    amount: number
  ): Promise<{ txHash: string; approvedAmount: number }> => {
    // Simulates approving the backend node to spend USDC allowance on behalf of the buyer
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          txHash: generateMockTxHash(),
          approvedAmount: amount
        });
      }, 1200);
    });
  },

  chargeMinute: async (
    _buyerAddress: string,
    _amount: number
  ): Promise<{ txHash: string; feeBumpHash: string; gasFeeXlm: number }> => {
    // Simulates the backend calling charge_minute and wrapping it in a fee bump tx
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          txHash: generateMockTxHash(),
          feeBumpHash: generateMockTxHash(),
          gasFeeXlm: 0.0051 + Math.random() * 0.002
        });
      }, 600);
    });
  }
};
