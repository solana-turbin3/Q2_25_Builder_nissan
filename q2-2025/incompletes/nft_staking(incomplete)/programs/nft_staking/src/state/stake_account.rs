use prelude::*;

#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub staked_at: u64,
    pub bump: u8,
}
