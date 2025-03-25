"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const helpers_1 = require("@solana-developers/helpers");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const programId = new web3_js_1.PublicKey("9Y9MJsCppjTfbGT3ZvTEexDH4kCqR4gTDaegq67tevG6");
    // Connect to a solana cluster. Either to your local test validator or to devnet
    const connection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    //const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    // We load the keypair that we created in a previous step
    const keyPair = yield (0, helpers_1.getKeypairFromFile)("~/.config/solana/id.json");
    // Every transaction requires a blockhash
    const blockhashInfo = yield connection.getLatestBlockhash();
    // Create a new transaction
    const tx = new web3_js_1.Transaction(Object.assign({}, blockhashInfo));
    // Add our Hello World instruction
    tx.add(new web3_js_1.TransactionInstruction({
        programId: programId,
        keys: [],
        data: Buffer.from([]),
    }));
    // Sign the transaction with your previously created keypair
    tx.sign(keyPair);
    // Send the transaction to the Solana network
    const txHash = yield connection.sendRawTransaction(tx.serialize());
    console.log("Transaction sent with hash:", txHash);
    yield connection.confirmTransaction({
        blockhash: blockhashInfo.blockhash,
        lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
        signature: txHash,
    });
    console.log(`Congratulations! Look at your ‘Hello World' transaction in the Solana Explorer:
      https://explorer.solana.com/tx/${txHash}?cluster=custom`);
}))();
