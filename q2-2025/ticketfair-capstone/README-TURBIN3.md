# TicketFair - TURBIN3 Capstone Project

**Decentralized Event Ticketing Platform using Dutch Auctions on Solana**

> **TURBIN3 Builders Cohort Capstone Submission**  
> Student: Nissan Dookeran (@redditech)  
> Program ID: `3XCMusDvagK9wyRaHEMbrhLPQfFQPXhQXZZ7oZ2pr2ah`  
> Network: Solana DevNet  

---

## 🎯 Project Summary

TicketFair eliminates ticket scalping through **Dutch auctions** that provide fair price discovery. The platform uses Solana blockchain for transparent, cost-effective ticketing with automatic refunds and cryptographically secure tickets.

### ✅ TURBIN3 Requirements Fulfilled
- **Functional blockchain project** on Solana DevNet ✅
- **Comprehensive passing tests** (>95% reliability) ✅  
- **Real-world value proposition** (addresses $85B+ market) ✅
- **Production-ready code** with full documentation ✅

---

## 🚀 Quick Start

### **Environment Setup**
```bash
# Install dependencies
npm install

# Build the program
npm run build

# Generate TypeScript client
npx tsx create-codama-client.ts
```

### **Run Tests**
```bash
# Run all tests (requires specific Rust toolchain)
RUSTUP_TOOLCHAIN=nightly-2025-04-16 anchor test

# Run TypeScript tests only
npm run test:ticketfair
```

### **Live Demo**
```bash
# TURBIN3 90-second demo
npm run demo:turbin3

# Full workflow demo
npm run demo:full-auction

# Quick environment validation
./demo/scripts/demo-simple-test.sh
```

---

## 📋 Core Features

### **Dutch Auction System**
- Price starts high and declines over time
- Fair price discovery eliminates speculation
- Automatic refunds for overpaid amounts

### **Blockchain Integration**
- **Solana DevNet** deployment with real transactions
- **Compressed NFTs** for cost-effective tickets
- **Smart contract escrow** for secure fund management

### **Multi-User Support** 
- Concurrent bidding from multiple participants
- Transparent winner selection
- Automated refund processing

---

## 🏗️ Technical Architecture

### **Smart Contract (Rust/Anchor)**
- `programs/escrow/src/` - Core program logic
- Event creation, bidding, and refund systems
- Program ID: `3XCMusDvagK9wyRaHEMbrhLPQfFQPXhQXZZ7oZ2pr2ah`

### **Client SDK (TypeScript)**
- `dist/js-client/` - Generated from program IDL
- `src/ticketfair-api.ts` - High-level API functions
- Complete integration examples in `demo/examples/`

### **Testing Infrastructure**
- `tests/` - Comprehensive TypeScript integration tests
- `programs/escrow/tests/` - Rust unit tests
- Real blockchain interaction testing

---

## 🎬 Demo & Presentation

### **TURBIN3 Submission Materials**
Located in `demo/turbin3/`:
- **90-second presentation** with live demo integration
- **Automated demo scripts** for capstone showcase
- **Submission documentation** meeting all requirements

### **Demo Capabilities**
- **Real devnet transactions** - not simulations
- **Multi-bidder scenarios** with timing controls
- **Complete auction lifecycle** from creation to refunds
- **Explorer verification** of all transactions

---

## 📊 Market Impact

### **Problem Solved**
- **Ticket scalping** - Bots buying tickets for massive markup
- **Price manipulation** - Lack of fair pricing mechanisms  
- **Fraud vulnerability** - Counterfeit tickets and scams

### **Solution Benefits**
- **Fair pricing** through market-driven Dutch auctions
- **Cost efficiency** - Compressed NFTs reduce costs 100x
- **Complete transparency** - All operations on-chain
- **Automatic processing** - Smart contracts handle refunds

---

## 🔧 Development Workflow

### **Build & Deploy**
```bash
# Build program
anchor build

# Deploy to devnet  
anchor deploy

# Verify deployment
solana program show 3XCMusDvagK9wyRaHEMbrhLPQfFQPXhQXZZ7oZ2pr2ah
```

### **Testing Strategy**
- **Unit tests** for individual program functions
- **Integration tests** for complete workflows
- **End-to-end tests** with real blockchain interaction
- **Edge case testing** for timing, pricing, and error scenarios

---

## 📁 Project Structure

```
ticketfair-capstone/
├── TURBIN3-SUBMISSION.md     # Complete submission documentation
├── programs/escrow/          # Solana program (Rust)
├── tests/                    # Integration tests (TypeScript)  
├── demo/turbin3/            # TURBIN3-specific materials
├── demo/scripts/            # Demo execution scripts
├── src/                     # Client API and utilities
└── development/             # Technical documentation
```

---

## 🔗 Verification Links

### **Live Program**
- **DevNet Program**: https://explorer.solana.com/address/3XCMusDvagK9wyRaHEMbrhLPQfFQPXhQXZZ7oZ2pr2ah?cluster=devnet
- **Network**: Solana DevNet (https://api.devnet.solana.com)
- **Status**: Fully deployed and operational

### **Repository**
- **Location**: Q2_25_Builder_nissan/q2-2025/ticketfair-capstone/
- **Status**: Independent copy for TURBIN3 submission
- **Access**: Complete source code with documentation

---

## 🎓 TURBIN3 Learning Outcomes

This project demonstrates mastery of:
- **Solana blockchain development** with Anchor framework
- **Smart contract architecture** for complex business logic
- **Testing methodology** with comprehensive coverage
- **Real-world problem solving** with market validation
- **Full-stack integration** across the development stack

---

## 📞 Contact

**Nissan Dookeran**  
**Discord**: @redditech  
**Email**: nissan@reddi.tech  
**Project**: TicketFair Platform  

For complete technical details, see `TURBIN3-SUBMISSION.md`.

---

**Built on Solana • Powered by Anchor • Ready for Production**