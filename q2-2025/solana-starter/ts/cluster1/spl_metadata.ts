import wallet from "../../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// Define our Mint address
const mint = new PublicKey("GM39nHx58dRzzXxnjMJo3bj4xaqWj6H2d3TuLZqsANih")
const mint_umi = publicKey("GM39nHx58dRzzXxnjMJo3bj4xaqWj6H2d3TuLZqsANih")
const metadata_seeds = [
    Buffer.from("metadata"),
    TOKEN_PROGRAM_ID.toBuffer(),
    mint.toBuffer()
]
const [pda, bump] = PublicKey.findProgramAddressSync(
    metadata_seeds,
    TOKEN_PROGRAM_ID
)

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint_umi,
            mintAuthority: signer,
        }

        let data: DataV2Args = {
            name: "Red Token",
            symbol: "RED",
            uri: "https://arweave.net/1234567890",
            sellerFeeBasisPoints: 100,
            creators: null,
            collection: null,
            uses: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
