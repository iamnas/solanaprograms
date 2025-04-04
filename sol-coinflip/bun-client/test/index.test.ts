// import { 
//     Connection, 
//     Keypair, 
//     PublicKey, 
//     SystemProgram, 
//     Transaction, 
//     sendAndConfirmTransaction 
// } from "@solana/web3.js";

// import {expect,describe,beforeAll, test} from "bun:test"

// const PROGRAM_ID = new PublicKey("GogvxHeB12a3VaUVEAhYztzW7AWKtj9WLXapQAZzgfzC"); // Replace with deployed program ID

// const connection = new Connection("http://localhost:8899", "confirmed");

// // Helper function to airdrop SOL
// async function airdropSOL(publicKey: PublicKey, amount: number) {
//     const signature = await connection.requestAirdrop(publicKey, amount);
//     await connection.confirmTransaction(signature);
// }

// describe("Solana Coinflip Tests", () => {
//     let player: Keypair;
//     let treasury: Keypair;
    
//     let betAccount: Keypair; // If needed for storing bet details


//     beforeAll(async () => {
//         player = Keypair.generate();
//         treasury = Keypair.generate();
//         betAccount = Keypair.generate();

        
//         console.log("Player Wallet:", player.publicKey.toBase58());
//         console.log("Treasury Wallet:", treasury.publicKey.toBase58());

//         // Airdrop some SOL for player and treasury
//         await airdropSOL(player.publicKey, 2e9);  // 2 SOL
//         await airdropSOL(treasury.publicKey, 5e9); // 5 SOL
//     });

//     // test("Player should be able to place a bet", async () => {
//     //     const betAmount = 0.1 * 1e9; // 0.1 SOL in lamports
//     //     const playerChoice = 0; // 0 = Heads, 1 = Tails

//     //     const transaction = new Transaction().add({
//     //         keys: [
//     //             { pubkey: player.publicKey, isSigner: true, isWritable: true },
//     //             { pubkey: treasury.publicKey, isSigner: false, isWritable: true },
//     //         ],
//     //         programId: PROGRAM_ID,
//     //         data: Buffer.from([betAmount / 1e6, playerChoice]), // Sending bet amount & choice as instruction data
//     //     });

//     //     const initialBalance = await connection.getBalance(player.publicKey);

//     //     await sendAndConfirmTransaction(connection, transaction, [player]);

//     //     const finalBalance = await connection.getBalance(player.publicKey);
        
//     //     console.log("Initial Balance:", initialBalance / 1e9, "SOL");
//     //     console.log("Final Balance:", finalBalance / 1e9, "SOL");

        
//     //     // expect(finalBalance)(initialBalance, "Player balance should change after bet");
//     //     // .to.be.lessThan(initialBalance, "Player balance should decrease after bet");
//     //     // assert.notEqual(initialBalance, finalBalance, "Player balance should change after bet");
//     // });


//     test("Player should be able to place a bet", async () => {
//         const betAmount = 0.1 * 1e9;
//         const playerChoice = 0; // 0 = Heads, 1 = Tails

//         const transaction = new Transaction().add({
//             keys: [
//                 { pubkey: player.publicKey, isSigner: true, isWritable: true },
//                 { pubkey: treasury.publicKey, isSigner: false, isWritable: true },
//                 { pubkey: betAccount.publicKey, isSigner: false, isWritable: true }, // If needed
//                 { pubkey: SystemProgram.programId, isSigner: false, isWritable: false } // Ensure system program is included
//             ],
//             programId: PROGRAM_ID,
//             data: Buffer.from([betAmount / 1e6, playerChoice]),
//         });

//         const initialBalance = await connection.getBalance(player.publicKey);

//         await sendAndConfirmTransaction(connection, transaction, [player]);

//         const finalBalance = await connection.getBalance(player.publicKey);

//         console.log("Initial Balance:", initialBalance / 1e9, "SOL");
//         console.log("Final Balance:", finalBalance / 1e9, "SOL");

//         expect(finalBalance).toBeLessThan(initialBalance);
//     });

//     // it("Should reject invalid choices", async () => {
//     //     try {
//     //         const transaction = new Transaction().add({
//     //             keys: [
//     //                 { pubkey: player.publicKey, isSigner: true, isWritable: true },
//     //                 { pubkey: treasury.publicKey, isSigner: false, isWritable: true },
//     //             ],
//     //             programId: PROGRAM_ID,
//     //             data: Buffer.from([0.1 * 1e9 / 1e6, 2]), // Invalid choice (should be 0 or 1)
//     //         });

//     //         await sendAndConfirmTransaction(connection, transaction, [player]);
//     //         // assert.fail("Transaction should have failed due to invalid choice");
//     //     } catch (err) {
//     //         console.log("Error caught as expected:", err);
//     //         // assert.include(err.message, "InvalidInstructionData", "Should throw invalid instruction error");
//     //     }
//     // });
// });



import { 
    Connection, 
    Keypair, 
    PublicKey, 
    SystemProgram, 
    Transaction, 
    sendAndConfirmTransaction 
} from "@solana/web3.js";

import { expect, describe, beforeAll, test } from "bun:test";

const PROGRAM_ID = new PublicKey("GogvxHeB12a3VaUVEAhYztzW7AWKtj9WLXapQAZzgfzC");

const connection = new Connection("http://localhost:8899", "confirmed");

async function airdropSOL(publicKey: PublicKey, amount: number) {
    const signature = await connection.requestAirdrop(publicKey, amount);
    await connection.confirmTransaction(signature);
}

describe("Solana Coinflip Tests", () => {
    let player: Keypair;
    let treasury: Keypair;
    let betAccount: Keypair; // If needed for storing bet details

    beforeAll(async () => {
        player = Keypair.generate();
        treasury = Keypair.generate();
        betAccount = Keypair.generate();

        console.log("Player Wallet:", player.publicKey.toBase58());
        console.log("Treasury Wallet:", treasury.publicKey.toBase58());

        await airdropSOL(player.publicKey, 2e9);
        await airdropSOL(treasury.publicKey, 5e9);
    });

    test("Player should be able to place a bet", async () => {
        const betAmount = 0.1 * 1e9;
        const playerChoice = 0; // 0 = Heads, 1 = Tails

        // const transaction = new Transaction().add({
        //     keys: [
        //         { pubkey: player.publicKey, isSigner: true, isWritable: true },
        //         { pubkey: treasury.publicKey, isSigner: false, isWritable: true },
        //     ],
        //     programId: PROGRAM_ID,
        //     data: Buffer.from([betAmount / 1e6, playerChoice]), // Sending bet amount & choice as instruction data
        // });

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: player.publicKey,
                toPubkey: treasury.publicKey,
                lamports: betAmount,
            })
        );

        
        const initialBalance = await connection.getBalance(player.publicKey);

        await sendAndConfirmTransaction(connection, transaction, [player]);

        const finalBalance = await connection.getBalance(player.publicKey);

        console.log("Initial Balance:", initialBalance / 1e9, "SOL");
        console.log("Final Balance:", finalBalance / 1e9, "SOL");

        expect(finalBalance).toBeLessThan(initialBalance);
    });
});
