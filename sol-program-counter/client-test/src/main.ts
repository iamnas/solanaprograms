import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js"
import * as borsh from "borsh"
import { Buffer } from "buffer"

class CounterAccount {
    count = 0;

    constructor({ count }: { count: number }) {
        this.count = count;
    }
}

const schema = { struct: { count: 'u32' } };

const GREETING_SIZE = borsh.serialize(schema, new CounterAccount({ count: 0 })).length;

const main = async () => {

    const adminKeypair = Keypair.generate()
    const counterAccountKeypair = new Keypair()

    const conn = new Connection("http://localhost:8899", "confirmed")
    const airdropSignature = await conn.requestAirdrop(adminKeypair.publicKey, 2 * LAMPORTS_PER_SOL)
    const latestBlockHash = await conn.getLatestBlockhash();

    await conn.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
    });

    conn.getBalance(adminKeypair.publicKey).then((balance) => {
        console.log("Balance: ", balance);
    });

    const programId = new PublicKey("Gwjv2KQhNDJ4zyGTGkjXTmZN7J1CiDsM3KyCij57ZedR");

    const lamports = await conn.getMinimumBalanceForRentExemption(GREETING_SIZE);

    const createCounterAccIx = SystemProgram.createAccount({
        fromPubkey: adminKeypair.publicKey,
        newAccountPubkey: counterAccountKeypair.publicKey,
        lamports: lamports,
        space: GREETING_SIZE,
        programId: programId,
    });

    const tx = new Transaction().add(createCounterAccIx);

    const txHash = await sendAndConfirmTransaction(conn, tx, [adminKeypair, counterAccountKeypair]);

    console.log("Transaction hash: ", txHash);




    const tx2 = new Transaction().add(
        new TransactionInstruction({
            keys: [{
                pubkey: counterAccountKeypair.publicKey,
                isSigner: true,
                isWritable: true
            }],
            programId,
            data: Buffer.from(new Uint8Array([0, 1, 0, 0, 0]))
        })
    );

    const txHash2 = await sendAndConfirmTransaction(conn, tx2, [adminKeypair, counterAccountKeypair]);

    console.log("Transaction hash: ", txHash2);
    const counterAccount = await conn.getAccountInfo(counterAccountKeypair.publicKey);
    // console.log("Counter account: ", counterAccount);
    if (!counterAccount) {
        throw new Error('Error: cannot find the greeted account');
    }
    const counter = borsh.deserialize(schema, counterAccount?.data) as CounterAccount;
    console.log("Counter: ", counter.count);




}

main()