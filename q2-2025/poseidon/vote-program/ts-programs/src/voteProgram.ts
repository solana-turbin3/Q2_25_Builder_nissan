import { Account, Pubkey, type Result, i64, u8, Signer } from "@solanaturbine/poseidon";

export default class VoteProgram {
    static PROGRAM_ID = new Pubkey("HNLL5xKm4W8bhS1B9dSFRTjtpZBkphgGkTwzWaiLzYGa");

    initialize(state: VoteState, user: Signer): Result {
        // Use `.derive([seed])` to define the PDA and chain the `.init(payer)` at the end for creating the account and pass the payer argument
        state.derive(["vote"])
            .init(user);

        // Set the initial value to the `vote` field of the account
        state.vote = new i64(0);
        return { ok: true };
    }

    upvote(state: VoteState): Result {
        state.derive(["vote"]);
        state.vote = state.vote.add(1);
        return { ok: true };
    }

    downvote(state: VoteState): Result {
        state.derive(["vote"]);
        state.vote = state.vote.sub(1);
        return { ok: true };
    }
}

export interface VoteState extends Account {
    vote: i64; // This field store the voting result
    bump: u8; // bump is for PDA (program derieved account, a special type of account which controlled by program on Solana)
}

