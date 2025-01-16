import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"
import * as path from 'path'

// Create a devnet connection
//const umi = createUmi('https://api.devnet.solana.com');
// import dotenv from 'dotenv';
// dotenv.config({ path: './.env.local' });

const umi = createUmi(`https://devnet.helius-rpc.com/?api-key=5bad8c20-4666-4065-949f-0639e0190473`);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // 1. Load image
        // 2. Convert image to generic file.
        // 3. Upload image

        // Update the file path to use an absolute path
        const imagePath = path.resolve(__dirname, 'nfts-turbin3.png');
        console.log("Attempting to read image from:", imagePath);

        const image = await readFile(imagePath);

        const myUri = createGenericFile(image, "JournalQuest", {contentType: "image/png"})

        const uri = await umi.uploader.upload([myUri])
        console.log("Your image URI: ", uri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
