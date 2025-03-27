import { getKeypairFromFile } from "@solana-developers/helpers";
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";



const main = async () => {


    const programId = new PublicKey("GogvxHeB12a3VaUVEAhYztzW7AWKtj9WLXapQAZzgfzC");
    const conn = new Connection("http://localhost:8899", "confirmed");

    // const keyPair = await getKeypairFromFile("~/.config/solana/id.json");

    const payer = new Keypair()
    const keyPair = Keypair.generate();
    console.log(keyPair.publicKey.toBase58());

    const airdropSignature = await conn.requestAirdrop(
        payer.publicKey,
        1000000000,
      );
      await conn.confirmTransaction(airdropSignature);
      console.log("Airdrop confirmed");
      const balance = await conn.getBalance(payer.publicKey);
      console.log("Payer balance:", balance);
      console.log("Creating account",);
      
    const blockhashInfo = await conn.getLatestBlockhash();
    const tx = new Transaction({
        ...blockhashInfo,
    });

    tx.add(
        new TransactionInstruction({
          programId: programId,
          keys: [],
          data: Buffer.from([]),
        }),
      );
      
      // Sign the transaction with your previously created keypair
      tx.sign(payer);
      
      // Send the transaction to the Solana network
      const txHash = await conn.sendRawTransaction(tx.serialize());
      
      console.log("Transaction sent with hash:", txHash);
      
      await conn.confirmTransaction({
        blockhash: blockhashInfo.blockhash,
        lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
        signature: txHash,
      });
      
      console.log(
        `Congratulations! Look at your ‘Hello World' transaction in the Solana Explorer:
        https://explorer.solana.com/tx/${txHash}?cluster=custom`,
      );

}

main();