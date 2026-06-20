# PisoHotspot Mesh

> Revitalizing the classic Philippine "PisoNet" culture for the Web3 era using a Decentralized Physical Infrastructure Network (DePIN) model.

## Problem and Solution

**Problem:** Students in provincial boarding houses with uneven internet access overpay for spotty mobile data, while their roommates with unlimited fiber broadband have excess, unmonetized bandwidth.

**Solution:** PisoHotspot Mesh is a captive portal dApp that allows fiber-connected students to sell time-based Wi-Fi access. Connecting users pay per minute via continuous Stellar USDC micropayment channels.

## Vision and Purpose

To democratize internet access in the Philippines by turning everyday users into decentralized internet service providers. This project bridges the physical reality of local connectivity gaps with the financial efficiency of the Stellar network, proving that micro-commerce can build functional infrastructure from the ground up.

## Stellar Features Used

* **Soroban Allowances:** When the user connects, they do not send 1 USDC upfront. Instead, they sign an `approve` transaction, granting the backend node permission to pull up to 1 USDC.
* **Automated `transfer_from`:** The backend acts as the authorized spender, submitting a transfer every 60 seconds.
* **Fee Bump Transactions:** The backend server wraps every `transfer_from` transaction in a Fee Bump Transaction, paying the fractional XLM network fee on behalf of the users.

## Timeline

* **Day 1:** System architecture mapping, frontend UI simulation build, and Soroban contract drafting.
* **Day 2:** Backend Node (Virtual Router) configuration, WebSocket integration, and Testnet deployment.
* **Day 3:** End-to-end integration testing, UX optimization, and final 3-minute pitch rehearsal.

## Prerequisites

* Rust toolchain (`rustup target add wasm32-unknown-unknown`)
* Soroban CLI (`cargo install --locked soroban-cli`)
* Node.js (for the backend virtual router)

## Development Guide

### How to Build

Compile the smart contract to WebAssembly:

```bash
soroban contract build
```

Run the test suite to verify the end-to-end MVP flow and edge cases:
```bash
cargo test
```

### How to Deploy
Deploy the compiled WASM to the Stellar Testnet:
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/piso_hotspot_mesh.wasm \
  --source <YOUR_SELLER_SECRET_KEY> \
  --network testnet
```

### Sample CLI Invocation
Triggering a 1-minute Wi-Fi charge (simulated as 10000 stroops or 0.01 USDC):
```bash
soroban contract invoke \
  --id <DEPLOYED_CONTRACT_ID> \
  --source <BACKEND_NODE_SECRET_KEY> \
  --network testnet \
  -- \
  charge_minute \
  --token <USDC_TESTNET_CONTRACT_ID> \
  --buyer <BUYER_PUBLIC_KEY> \
  --seller <SELLER_PUBLIC_KEY> \
  --amount 10000
  ```

  ### License
  MIT License
