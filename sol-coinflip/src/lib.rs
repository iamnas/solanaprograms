use solana_program::{
    account_info::AccountInfo,entrypoint, entrypoint:: ProgramResult, pubkey::Pubkey, sysvar::{ clock::Clock, Sysvar},msg
};


entrypoint!(coinflip);

pub fn coinflip(
    _program_id:&Pubkey,
    _accounts:&[AccountInfo],
    _instruction_data: &[u8],
)->ProgramResult{

    // let rnd = rand::random_range(0, 2);
    // msg!("Random number generated: {}", rnd);
    let clock = Clock::get()?;
    let slot = clock.slot;
    
    let random_number = (slot % 2) as u8; // Use slot number modulo 2 for randomness

    msg!("Random number generated: {}", random_number);



    Ok(())
}