import { test, expect, describe, beforeEach, beforeAll } from "bun:test"
import * as borsh from "borsh";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";


class CounterAccount {
    count = 0;

    constructor({ count }: { count: number }) {
        this.count = count;
    }
}


const schema = { struct: { count: 'u32' } }

const GREETING_SIZE = borsh.serialize(schema, new CounterAccount({ count: 0 })).length;

describe("testing counter contract ", () => {

    const adminWallet = Keypair.generate()
    const countAccount = Keypair.generate()
    let conn: Connection;
    let programId: PublicKey

    beforeAll(async () => {
        conn = new Connection('http://localhost:8899', 'confirmed')
        programId = new PublicKey('5QbvRAEhHvaXBjmw8reZ59E7WHT7nA1G9nMfB7phnj4')
        console.log(programId.toBase58());

        const tx = await conn.requestAirdrop(adminWallet.publicKey, 10 * LAMPORTS_PER_SOL)
        await conn.confirmTransaction(tx)

        const lamports = await conn.getMinimumBalanceForRentExemption(GREETING_SIZE)

        const createAccountSig = SystemProgram.createAccount({
            fromPubkey: adminWallet.publicKey,
            lamports: lamports,
            newAccountPubkey: countAccount.publicKey,
            programId,
            space: GREETING_SIZE
        })

        const createAccountTx = new Transaction().add(createAccountSig);

        const txhash = await sendAndConfirmTransaction(conn, createAccountTx, [adminWallet, countAccount])

        console.log(`https://explorer.solana.com/tx/${txhash}?cluster=custom`);

    })

    test('should read count ', async () => {
        const dataAccountInfo = await conn.getAccountInfo(countAccount.publicKey)
        if (!dataAccountInfo?.data) {
            throw new Error("Account data is undefined");
        }
        const counter = borsh.deserialize(schema, dataAccountInfo.data) as CounterAccount
        if (!counter) {
            throw new Error("Failed to deserialize account data");
        }

        expect(counter.count).toBe(0)
    })

    test('should increase count ', async () => {

        const inc = borsh.serialize(schema, new CounterAccount({ count: 256 }))

        const tx = new Transaction().add(
            new TransactionInstruction({
                keys: [{
                    pubkey: countAccount.publicKey,
                    isSigner: true,
                    isWritable: true
                }],
                programId,
                data: Buffer.from(Uint8Array.from([0, ...inc]))
            })
        );

        const txHash = await sendAndConfirmTransaction(conn, tx, [adminWallet, countAccount])
        console.log(`https://explorer.solana.com/tx/${txHash}?cluster=custom`);


        const dataAccountInfo = await conn.getAccountInfo(countAccount.publicKey)
        if (!dataAccountInfo?.data) {
            throw new Error("Account data is undefined");
        }
        const counter = borsh.deserialize(schema, dataAccountInfo.data) as { count: number } | null;
        if (!counter) {
            throw new Error("Failed to deserialize account data");
        }

        console.log(counter.count);


        expect(counter.count).toBe(256)

    })

})

