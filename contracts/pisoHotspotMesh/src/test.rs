#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, token, Address, Env};

    // Helper to setup the environment, mock token, and contract
    fn setup_env() -> (Env, Address, Address, Address, token::Client, token::StellarAssetClient, PisoHotspotContractClient) {
        let env = Env::default();
        env.mock_all_auths();

        let backend_node = Address::generate(&env);
        let buyer = Address::generate(&env);
        let seller = Address::generate(&env);

        let token_admin = Address::generate(&env);
        let token_contract = env.register_stellar_asset_contract(token_admin.clone());
        let token_client = token::Client::new(&env, &token_contract);
        let token_admin_client = token::StellarAssetClient::new(&env, &token_contract);

        let contract_id = env.register_contract(None, PisoHotspotContract);
        let hotspot_client = PisoHotspotContractClient::new(&env, &contract_id);

        (env, backend_node, buyer, seller, token_client, token_admin_client, hotspot_client)
    }

    // Test 1 (Happy path): The MVP transaction executes successfully end-to-end
    #[test]
    fn test_successful_micropayment() {
        let (_env, backend_node, buyer, seller, token_client, token_admin_client, hotspot_client) = setup_env();

        hotspot_client.init(&backend_node);
        token_admin_client.mint(&buyer, &10_000_000); // Mint 10 USDC

        // Buyer approves backend node for 1 USDC
        let allowance_amount: i128 = 1_000_000;
        token_client.approve(&buyer, &backend_node, &allowance_amount, &200);

        // Charge 0.01 USDC
        let charge_amount: i128 = 10_000;
        hotspot_client.charge_minute(&token_client.address, &buyer, &seller, &charge_amount);

        assert_eq!(token_client.balance(&buyer), 9_990_000);
        assert_eq!(token_client.balance(&seller), 10_000);
    }

    // Test 2 (Edge case): Unauthorized caller tries to initialize the contract
    #[test]
    #[should_panic(expected = "HostError")]
    fn test_fails_without_allowance() {
        let (_env, backend_node, buyer, seller, token_client, token_admin_client, hotspot_client) = setup_env();

        hotspot_client.init(&backend_node);
        token_admin_client.mint(&buyer, &10_000_000);

        // Intentionally skipping `token_client.approve(...)`

        // Should panic because backend_node lacks allowance to transfer_from buyer
        let charge_amount: i128 = 10_000;
        hotspot_client.charge_minute(&token_client.address, &buyer, &seller, &charge_amount);
    }

    // Test 3 (State verification): Assert that contract storage reflects the correct state after the MVP transaction
    #[test]
    fn test_state_increments_minutes() {
        let (_env, backend_node, buyer, seller, token_client, token_admin_client, hotspot_client) = setup_env();

        hotspot_client.init(&backend_node);
        token_admin_client.mint(&buyer, &10_000_000);
        token_client.approve(&buyer, &backend_node, &1_000_000, &200);

        assert_eq!(hotspot_client.get_minutes(&buyer), 0);

        hotspot_client.charge_minute(&token_client.address, &buyer, &seller, &10_000);
        assert_eq!(hotspot_client.get_minutes(&buyer), 1); // 1 minute tracked

        hotspot_client.charge_minute(&token_client.address, &buyer, &seller, &10_000);
        assert_eq!(hotspot_client.get_minutes(&buyer), 2); // 2 minutes tracked
    }

    // Test 4 (Edge case): Uninitialized contract panics when charge is attempted
    #[test]
    #[should_panic(expected = "HostError")]
    fn test_fails_if_uninitialized() {
        let (_env, _backend_node, buyer, seller, token_client, _token_admin_client, hotspot_client) = setup_env();

        // Attempting to charge without calling `init` first
        hotspot_client.charge_minute(&token_client.address, &buyer, &seller, &10_000);
    }

    // Test 5 (Edge case): Charging more than the user's available balance fails
    #[test]
    #[should_panic(expected = "HostError")]
    fn test_fails_insufficient_balance() {
        let (_env, backend_node, buyer, seller, token_client, token_admin_client, hotspot_client) = setup_env();

        hotspot_client.init(&backend_node);
        
        // Mint only 5,000 stroops
        token_admin_client.mint(&buyer, &5_000);
        token_client.approve(&buyer, &backend_node, &1_000_000, &200);

        // Attempt to charge 10,000 stroops (exceeds balance despite sufficient allowance)
        hotspot_client.charge_minute(&token_client.address, &buyer, &seller, &10_000);
    }
}