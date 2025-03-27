use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, entrypoint, pubkey::Pubkey
};

entrypoint!(coinflip);

pub fn coinflip(
    _program_id:&Pubkey,
    _accounts:&[AccountInfo],
    _instruction_data: &[u8],
)->ProgramResult{
    Ok(())
}