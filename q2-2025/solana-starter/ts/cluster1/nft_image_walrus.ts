import wallet from "../../wba-wallet.json"
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
// import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
// import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { readFile } from "fs/promises"
import * as path from 'path';
import dotenv from 'dotenv';
import {spawnSync} from 'child_process';
import { createGenericFile, createSignerFromKeypair } from "@metaplex-foundation/umi";

const WALRUS_BIN = process.env.WALRUS_BIN || 'walrus';
const WALRUS_CONFIG = process.env.WALRUS_CONFIG || 'walrus.json'


// Create a devnet connection
// const umi = createUmi('https://api.devnet.solana.com');

// let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
// const signer = createSignerFromKeypair(umi, keypair);

// umi.use(irysUploader());
// umi.use(signerIdentity(signer));

const image = await readFile(path.join(__dirname, "..", "public", "rug-OGs.png"));

(async () => {
    try {
        //1. Load image
        const image = await readFile(path.join(__dirname, "..", "public", "rug-OGs.png"));

        //2. Upload image
        const storeJson = JSON.stringify({
            config: WALRUS_CONFIG,
            command: {
                store: {
                    files: [image],
                    epochs: 2,
                }
            }
        });
        const upload = spawnSync(WALRUS_BIN, ['json'], {
            input: storeJson,
            encoding: 'utf-8',
        });
        const uploadResult = JSON.parse(upload.stdout.trim())[0].blobStoreResults;
        let blobId: string;
        let suiObjectId: string | undefined;
        if (uploadResult) {
            blobId = uploadResult.newlyCreated.blobObject.blobId;
            suiObjectId = uploadResult.newlyCreated.blobObject.id;
        } else if (uploadResult.alreadyCertified) {
            blobId = uploadResult.alreadyCertified.blobId;
        } else {
            throw new Error('No blobId found in upload result');
        }
        console.log(`Blob ID: ${blobId}`);

        const readJson = JSON.stringify({
            config: WALRUS_CONFIG,
            command: {
                read: {
                    blobId: blobId,
                }
            }
        });


        console.log("Your image URI: ", myUri);
        
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
