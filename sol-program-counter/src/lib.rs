use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::{next_account_info, AccountInfo},entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey};


#[derive(BorshDeserialize,BorshSerialize)]
struct Counter {
    count:u32,
}
#[derive(BorshDeserialize,BorshSerialize)]
enum CounterInstruction {
    Increment(u32),
    Decrement(u32)
}


entrypoint!(counter_contract);

pub fn counter_contract(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult{

    let acc = next_account_info(&mut accounts.iter())?;
    let mut counter = Counter::try_from_slice(&acc.data.borrow())?;

    match CounterInstruction::try_from_slice(instruction_data)? {
        CounterInstruction::Increment(x) => counter.count +=x,
        CounterInstruction::Decrement(x) => counter.count -=x,
    }

    counter.serialize(&mut *acc.data.borrow_mut())?;



    msg!("Counter contract invoked");
    Ok(())
}