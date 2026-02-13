# Decentralized Exchange (DEX) with Flash Loans

A full-featured decentralized exchange built with Solidity and Hardhat, featuring token swaps, order book management, and flash loan functionality.

## 🌟 Features

- **ERC-20 Token Implementation**: Custom token contract with transfer and approval functionality
- **Decentralized Exchange**: 
  - Token deposits and withdrawals
  - Order creation and management
  - Order cancellation
  - Order filling with fee collection
  - Active balance tracking for orders
- **Flash Loans**: Borrow tokens without collateral for use within a single transaction
- **Comprehensive Test Suite**: Full test coverage for all contracts and features
- **Deployment Scripts**: Automated deployment and seeding scripts

## 📋 Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Hardhat

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/juanjoseexpositogonzalez/bootcamp-v3-contracts.git
cd bootcamp-v3-contracts
```

2. Install dependencies:
```bash
npm install
```

## 🏗️ Smart Contracts

### Token.sol
ERC-20 compliant token with:
- Standard transfer functionality
- Approval and transferFrom for delegated transfers
- 18 decimal precision
- Customizable name, symbol, and total supply

### Exchange.sol
Decentralized exchange featuring:
- **Deposit/Withdrawal**: Manage token balances on the exchange
- **Order Management**: Create, cancel, and fill orders
- **Fee System**: Configurable fee percentage collected on trades
- **Active Balance Tracking**: Prevents over-ordering with locked balances
- **Flash Loans**: Inherit flash loan functionality from FlashLoanProvider

### FlashLoanProvider.sol
Abstract contract providing flash loan functionality:
- Lend tokens without collateral
- Requires repayment within the same transaction
- Implements callback pattern for loan receivers

### FlashLoanUser.sol
Example contract demonstrating flash loan usage:
- Initiates flash loan requests
- Implements the `IFlashLoanReceiver` interface
- Handles loan repayment

## 🧪 Testing

Run the complete test suite:
```bash
npx hardhat test
```

Run specific test files:
```bash
npx hardhat test test/Token.js
npx hardhat test test/Exchange.js
npx hardhat test test/FlashLoanProvider.js
```

Test coverage includes:
- Token transfers and approvals
- Exchange deposits and withdrawals
- Order creation, cancellation, and filling
- Flash loan execution and validation
- Error handling and edge cases

## 📦 Deployment

### Local Development Network

1. Start a local Hardhat node:
```bash
npx hardhat node
```

2. Deploy contracts using Hardhat Ignition:
```bash
# Deploy tokens
npx hardhat ignition deploy ./ignition/modules/Token.js --network localhost

# Deploy exchange
npx hardhat ignition deploy ./ignition/modules/Exchange.js --network localhost

# Deploy flash loan user
npx hardhat ignition deploy ./ignition/modules/FlashLoanUser.js --network localhost
```

3. Seed the exchange with test data:
```bash
npx hardhat run scripts/seed.js --network localhost
```

## 🔧 Configuration

### Exchange Configuration
- **Fee Account**: Address that receives trading fees (Account #1)
- **Fee Percent**: Percentage charged on trades (default: 10%)

### Deployment Accounts
- **Deployer**: Account #0 - Deploys all contracts
- **Fee Account**: Account #1 - Receives exchange fees
- **User1**: Account #2 - Test user for orders and flash loans
- **User2**: Account #3 - Test user for filling orders

## 📝 Usage Examples

### Creating an Order

```javascript
// Approve tokens for exchange
await token.approve(exchangeAddress, amount);

// Deposit tokens
await exchange.depositToken(tokenAddress, amount);

// Create order (swap token0 for token1)
await exchange.makeOrder(
    token1Address,  // tokenGet - what you want
    amount1,        // amountGet
    token0Address,  // tokenGive - what you offer
    amount0         // amountGive
);
```

### Filling an Order

```javascript
// Approve and deposit tokens you want to trade
await token1.approve(exchangeAddress, amount);
await exchange.depositToken(token1Address, amount);

// Fill the order
await exchange.fillOrder(orderId);
```

### Cancelling an Order

```javascript
await exchange.cancelOrder(orderId);
```

### Executing a Flash Loan

```javascript
// Deploy flash loan user contract
const flashLoanUser = await FlashLoanUser.deploy(exchangeAddress);

// Request flash loan
await flashLoanUser.getFlashLoan(tokenAddress, loanAmount);
```

## 📊 Seed Data

The [seed.js](scripts/seed.js) script populates the exchange with:
- 100,000 tokens distributed to test users
- Cancelled orders (1)
- Filled orders (3)
- Open buy orders (5 from each user)
- Flash loan executions (3)

## 🏛️ Contract Architecture

```
Exchange.sol
├── Inherits: FlashLoanProvider.sol
├── Uses: Token.sol
└── Features:
    ├── Token deposits/withdrawals
    ├── Order management (make, cancel, fill)
    ├── Fee collection
    └── Flash loans

FlashLoanProvider.sol
├── Abstract contract
└── Provides flash loan functionality

FlashLoanUser.sol
├── Implements: IFlashLoanReceiver
└── Example flash loan consumer
```

## 📁 Project Structure

```
bootcamp-v3-contracts/
├── contracts/
│   ├── Exchange.sol
│   ├── FlashLoanProvider.sol
│   ├── FlashLoanUser.sol
│   └── Token.sol
├── test/
│   ├── Exchange.js
│   ├── FlashLoanProvider.js
│   ├── Token.js
│   └── helpers/
│       ├── ExchangeFixtures.js
│       └── TokenFixtures.js
├── scripts/
│   └── seed.js
├── ignition/
│   └── modules/
│       ├── Exchange.js
│       ├── FlashLoanUser.js
│       └── Token.js
├── hardhat.config.js
└── package.json
```

## 🔍 Key Concepts

### Active Balance
The exchange tracks two types of balances:
- **Total Balance**: All tokens deposited by a user
- **Active Balance**: Tokens locked in open orders

This prevents users from creating orders with tokens already committed to other orders.

### Trade Execution
When an order is filled:
1. Fee is calculated and deducted from the order filler
2. Tokens are exchanged between maker and taker
3. Fee is transferred to the fee account
4. Order is marked as filled
5. Active balances are updated

### Flash Loans
Flash loans allow borrowing without collateral with these requirements:
- Loan must be repaid in the same transaction
- Callback pattern enables custom logic during loan
- Automatic validation ensures funds are returned

## 🛠️ Development Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Clean artifacts
npx hardhat clean

# Check contract size
npx hardhat size-contracts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the UNLICENSED license.

## 👨‍💻 Author

Juan Jose Exposito Gonzalez

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
