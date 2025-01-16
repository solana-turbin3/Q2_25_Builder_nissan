import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        //const image = "https://devnet.irys.xyz/G9R5AVumY26ktX62XhJ7ARe9kRYM3rhT88ZS3btd9SrY"
        // const image = "https://devnet.irys.xyz/3N2m6YniTaQdM1t99txF7FKaGjANfnvmsaobrmFdcsPJ"
        const image = "https://devnet.irys.xyz/6cgPaYPASPhwhANQAdpimL8zKj3y7KWrzaLrHuvdXVXf"
        const metadata = {
            name: "RugMasters",
            symbol: "RMS",
            description: "Eat, Sleep, Rug, Repeat",
            image: image,
            attributes: [
                {trait_type: 'RugMojo', value: '100'},
                {trait_type: 'RugHuggability', value: '1'},
                {trait_type: 'RugFuzziness', value: '100'},
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: [
                keypair.publicKey,
            ]
        };
        const myUri = await umi.uploader.uploadJson(metadata)
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
