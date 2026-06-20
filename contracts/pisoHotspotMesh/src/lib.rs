#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[contracttype]
pub enum DataKey {
    BackendNode, // Stores the authorized backend node address
    TotalMinutes(Address), // Tracks total connected minutes per user
}

#[contract]
pub struct PisoHotspotContract;

#[contractimpl]
impl PisoHotspotContract {
    /// Initializes the contract with the authorized backend node address.
    /// This node will act as the virtual router executing the recurring charges.
    pub fn init(env: Env, backend_node: Address) {
        backend_node.require_auth();
        env.storage().instance().set(&DataKey::BackendNode, &backend_node);
    }

    /// Executes the 60-second micropayment for Wi-Fi access.
    pub fn charge_minute(
        env: Env,
        token: Address,
        buyer: Address,
        seller: Address,
        amount: i128,
    ) {
        // Retrieve the authorized backend node from state. Panics if not initialized.
        let backend_node: Address = env.storage().instance().get(&DataKey::BackendNode).unwrap();
        
        // Enforce that ONLY the authorized backend node can trigger this billing cycle.
        backend_node.require_auth();

        // Initialize the standard token client for the provided asset (e.g., USDC).
        let client = token::Client::new(&env, &token);

        // Execute the delegated transfer. 
        // The buyer MUST have previously approved the `backend_node` to spend this amount.
        client.transfer_from(&backend_node, &buyer, &seller, &amount);

        // Update state: Increment the total minutes billed for the buyer for analytics/tracking.
        let mut current_minutes: u32 = env.storage().persistent().get(&DataKey::TotalMinutes(buyer.clone())).unwrap_or(0);
        current_minutes += 1;
        env.storage().persistent().set(&DataKey::TotalMinutes(buyer.clone()), &current_minutes);
    }

    /// Read-only function to check how many minutes a specific user has been billed for.
    pub fn get_minutes(env: Env, buyer: Address) -> u32 {
        env.storage().persistent().get(&DataKey::TotalMinutes(buyer)).unwrap_or(0)
    }
}