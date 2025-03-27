use solana_program::{
    account_info::{next_account_info,AccountInfo},entrypoint, entrypoint:: ProgramResult, pubkey::Pubkey, sysvar::{ clock::Clock, Sysvar},msg
};




entrypoint!(coinflip);
pub fn coinflip(
    _program_id:&Pubkey,
    _accounts:&[AccountInfo],
    _instruction_data: &[u8],
)->ProgramResult{

    let clock = Clock::get()?;
    let slot = clock.slot;
    
    let random_number = (slot % 2) as u8; // Use slot number modulo 2 for randomness

    msg!("Random number generated: {}", random_number);

    // let accounts_iter = &mut accounts.iter();

    // let program_account = next_account_info(accounts_iter)?; // Program's receiving account

    // msg!("Program account SOL balance: {}", program_account.lamports());


    Ok(())
}