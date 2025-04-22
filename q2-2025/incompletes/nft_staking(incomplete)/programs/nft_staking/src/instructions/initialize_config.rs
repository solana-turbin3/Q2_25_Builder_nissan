use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(init,
    payer=payer,
    seeds=["config"],
    space=8 + StakeConfig::LEN,
    )]
    pub config: Account<'info, StakeConfig>,

    #[account(
        init,
        payer = admin,
        seeds = ["rewards", config.key().as_ref()],
        bump,
        space = 8 + RewardMint::LEN,
        mint::decimals = 6,
        mint::authority = config,
    )]
    pub reward_mint: Account<'info, RewardMint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    msg!("Greetings from: {:?}", ctx.program_id);
    Ok(())
}
