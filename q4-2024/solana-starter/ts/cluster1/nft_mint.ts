import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../wba-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = createNft(umi, {
        mint,
        name: "RugMasters",
        symbol: "RMS",
        // uri: "https://devnet.irys.xyz/29Bi73idoaf1eskHkfhvMQp8BxGkUHCPE1SAnykF3zSL",
        // uri: "https://devnet.irys.xyz/7MwmT4UxJkMbZBQ8EoWHYmSAanCnFPWvPXvAX1JbocP1",
        uri: "https://devnet.irys.xyz/ApGo7xonSziqV4boTR87Qpy3BQBrH6Y72P4pNcn6iKtN",
        sellerFeeBasisPoints: percentAmount(1),
    })

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();