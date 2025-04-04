use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{Sysvar, clock::Clock},
};

entrypoint!(coinflip);

pub fn coinflip(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    // Player who is flipping the coin
    let player_account = next_account_info(accounts_iter)?;

    // The game's treasury account that holds SOL
    let treasury_account = next_account_info(accounts_iter)?;

    // Check that player signed the transaction
    if !player_account.is_signer {
        msg!("Player must sign the transaction.");
        return Err(solana_program::program_error::ProgramError::MissingRequiredSignature);
    }

    // Ensure player has enough SOL
    let bet_amount = instruction_data[0] as u64 * 1_000_000; // Bet amount in lamports

    if **player_account.lamports.borrow() < bet_amount {
        msg!("Insufficient balance to place bet.");
        return Err(solana_program::program_error::ProgramError::InsufficientFunds);
    }

    // Generate randomness using slot number
    let clock = Clock::get()?;
    let slot = clock.slot;
    let random_number = (slot % 2) as u8; // 0 = Heads, 1 = Tails

    msg!("Slot: {}, Random outcome: {}", slot, random_number);

    // Player's choice (heads or tails) - from instruction data
    let player_choice = instruction_data[1]; // 0 = Heads, 1 = Tails

    if player_choice > 1 {
        msg!("Invalid choice! Must be 0 (Heads) or 1 (Tails).");
        return Err(solana_program::program_error::ProgramError::InvalidInstructionData);
    }

    // Determine win or loss
    if random_number == player_choice {
        msg!("Player wins! Sending double bet amount.");

        // Transfer 2x bet amount from treasury to player
        invoke(
            &system_instruction::transfer(treasury_account.key, player_account.key, bet_amount * 2),
            &[treasury_account.clone(), player_account.clone()],
        )?;
    } else {
        msg!("Player loses. Bet is taken by the treasury.");

        // Transfer bet amount from player to treasury
        invoke(
            &system_instruction::transfer(player_account.key, treasury_account.key, bet_amount),
            &[player_account.clone(), treasury_account.clone()],
        )?;
    }

    Ok(())
}
