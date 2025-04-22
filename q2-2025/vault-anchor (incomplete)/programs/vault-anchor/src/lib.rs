use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};

declare_id!("HYDe6DS16ccURbpxmFsehphqkx1ufZbQLN5xRkyo5QUV");

#[program]
pub mod vault_anchor {
    use super::*;

    /// Initialize a new vault for a user
    /// Creates a vault state PDA and a vault PDA to hold funds
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)
    }

    /// Deposit SOL into the vault
    /// Transfers SOL from the user's wallet to the vault PDA
    pub fn deposit(ctx: Context<Payment>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)
    }

    /// Withdraw SOL from the vault
    /// Transfers SOL from the vault PDA back to the user's wallet
    pub fn withdraw(ctx: Context<Payment>, amount: u64) -> Result<()> {
        ctx.accounts.withdraw(amount)
    }

    /// Close the vault
    /// Withdraws all remaining SOL and closes the vault state account
    pub fn close(ctx: Context<Close>) -> Result<()> {
        ctx.accounts.close()
    }
}

#[account]
pub struct VaultState {
    /// Bump seed for the vault PDA
    pub vault_bump: u8,
    /// Bump seed for the state PDA
    pub state_bump: u8,
}

impl Space for VaultState {
    const INIT_SPACE: usize = 8 + 1 + 1;
}


#[derive(Accounts)]
pub struct Initialize<'info> {
    /// The user creating the vault
    #[account(mut)]
    pub user: Signer<'info>,

    /// The vault state PDA account
    /// Stores bump seeds and is derived using ["state", user_pubkey]
    #[account(
        init, 
        payer = user, 
        seeds = [b"state", user.key().as_ref()],
        bump,
        space = VaultState::INIT_SPACE,
    )]
    pub vault_state: Account<'info, VaultState>,

    /// The vault PDA that will hold the funds
    /// Derived using ["vault", vault_state_pubkey]
    #[account(
        seeds = [b"vault", vault_state.key().as_ref()],
        bump,
    )]
    pub vault: SystemAccount<'info>,

    /// Required for creating the vault state account
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    /// Store the bump seeds in the vault state account
    pub fn initialize(&mut self, bump: &InitializeBumps) -> Result<()> {
        self.vault_state.vault_bump = bump.vault;
        self.vault_state.state_bump = bump.vault_state;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Payment<'info> {
    /// The user who owns the vault
    #[account(mut)]
    pub user: Signer<'info>,

    /// The vault state account storing bump seeds
    /// Validates using stored state bump
    #[account(
        seeds = [b"state", user.key().as_ref()],
        bump = vault_state.state_bump,
    )]
    pub vault_state: Account<'info, VaultState>,

    /// The vault PDA holding the funds
    /// Validates using stored vault bump
    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump = vault_state.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    /// Required for SOL transfers
    pub system_program: Program<'info, System>,
}

impl<'info> Payment<'info> {
    /// Deposit SOL into the vault
    pub fn deposit(&mut self, amount: u64) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();
        // Create the transfer instruction
        let cpi_accounts = Transfer {
            from: self.user.to_account_info(),
            to: self.vault.to_account_info(),
        };
        
        // Execute the transfer
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer(cpi_ctx, amount)?;
        Ok(())
    }

    /// Withdraw SOL from the vault
    pub fn withdraw(&mut self, amount: u64) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();
        // Create the transfer instruction
        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };

        // Create PDA signer seeds
        let seeds = &[
            b"vault",
            self.vault_state.to_account_info().key.as_ref(),
            &[self.vault_state.vault_bump],
        ];
        let signer_seeds = &[&seeds[..]];

        // Execute the transfer with PDA as signer
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Close<'info> {
    /// The user who owns the vault
    #[account(mut)]
    pub user: Signer<'info>,

    /// The vault state account to be closed
    /// Will be closed and rent returned to user
    #[account(
        mut,
        close = user,
        seeds = [b"state", user.key().as_ref()],
        bump = vault_state.state_bump,
    )]
    pub vault_state: Account<'info, VaultState>,

    /// The vault PDA to be drained
    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump = vault_state.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    /// Required for SOL transfers
    pub system_program: Program<'info, System>,
}

impl<'info> Close<'info> {
    /// Close the vault and return all SOL to the user
    pub fn close(&mut self) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();
        // Create the transfer instruction for remaining funds
        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };

        // Create PDA signer seeds
        let seeds = &[
            b"vault",
            self.vault_state.to_account_info().key.as_ref(),
            &[self.vault_state.vault_bump],
        ];
        let signer_seeds = &[&seeds[..]];

        // Execute the transfer with PDA as signer
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        // Transfer all remaining lamports
        transfer(cpi_ctx, self.vault.lamports())?;
        Ok(())
    }
}




