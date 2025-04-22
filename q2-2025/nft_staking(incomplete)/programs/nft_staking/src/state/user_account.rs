use prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    pub bump: u8,
}
