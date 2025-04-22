import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultRevised } from "../target/types/vault_revised";
import { describe, test } from "node:test";
import assert from "node:assert/strict";

describe("vault-revised", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.vaultRevised as Program<VaultRevised>;

  test("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    assert.ok(tx, "Transaction should be successful");
    console.log("Your transaction signature", tx);
  });
});
