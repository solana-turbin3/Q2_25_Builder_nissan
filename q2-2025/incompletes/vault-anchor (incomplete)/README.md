# Vault Anchor Program

A Solana program that implements a secure vault system using Anchor framework and Program Derived Addresses (PDAs).

## Features

- **Initialize**: Create a new vault for a user
- **Deposit**: Add SOL to the vault
- **Withdraw**: Remove SOL from the vault
- **Close**: Close the vault and recover rent

## Program Implementation Details

### Account Structures

```rust
// Main state account storing bump seeds
#[account]
pub struct VaultState {
    pub vault_bump: u8,
    pub state_bump: u8,
}

// Initialize instruction accounts
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init, 
        payer = user, 
        seeds = [b"state", user.key().as_ref()],
        bump,
        space = VaultState::INIT_SPACE,
    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(
        seeds = [b"vault", vault_state.key().as_ref()],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

// Payment (Deposit/Withdraw) instruction accounts
#[derive(Accounts)]
pub struct Payment<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        seeds = [b"state", user.key().as_ref()],
        bump = vault_state.state_bump,
    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump = vault_state.vault_bump,
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```

### Instructions

1. **Initialize**
   - Creates a new vault state account for the user
   - Initializes a vault PDA to hold funds
   - Stores bump seeds for future reference
   ```rust
   pub fn initialize(ctx: Context<Initialize>) -> Result<()>
   ```

2. **Deposit**
   - Transfers SOL from user to vault PDA
   - Uses native system program transfer
   ```rust
   pub fn deposit(ctx: Context<Payment>, amount: u64) -> Result<()>
   ```

3. **Withdraw**
   - Transfers SOL from vault PDA to user
   - Uses PDA signer seeds for authorization
   ```rust
   pub fn withdraw(ctx: Context<Payment>, amount: u64) -> Result<()>
   ```

4. **Close**
   - Withdraws all remaining SOL from vault PDA
   - Closes the vault state account
   - Returns rent to user
   ```rust
   pub fn close(ctx: Context<Close>) -> Result<()>
   ```

### PDAs and Seeds

The program uses two PDAs:
1. **Vault State PDA**: `["state", user_pubkey]`
   - Stores bump seeds
   - Owned by the program
   
2. **Vault PDA**: `["vault", vault_state_pubkey]`
   - Holds deposited SOL
   - Used as signer for withdrawals

### Security Considerations

1. **Bump Seed Validation**
   - Stored during initialization
   - Validated on every transaction
   
2. **PDA Authorization**
   - Vault withdrawals require PDA signer
   - Seeds derived from user's vault state
   
3. **Account Validation**
   - All accounts validated through Anchor constraints
   - Proper ownership and mutation checks

## Building and Testing

```bash
# Build the program
anchor build

# Run tests
anchor test

# Deploy
anchor deploy
```

## Usage Example

```typescript
// Initialize a new vault
await program.methods
  .initialize()
  .accounts({
    user: wallet.publicKey,
    // ... other accounts
  })
  .rpc();

// Deposit SOL
await program.methods
  .deposit(new BN(amountInLamports))
  .accounts({
    user: wallet.publicKey,
    // ... other accounts
  })
  .rpc();

// Withdraw SOL
await program.methods
  .withdraw(new BN(amountInLamports))
  .accounts({
    user: wallet.publicKey,
    // ... other accounts
  })
  .rpc();

// Close vault
await program.methods
  .close()
  .accounts({
    user: wallet.publicKey,
    // ... other accounts
  })
  .rpc();
``` 