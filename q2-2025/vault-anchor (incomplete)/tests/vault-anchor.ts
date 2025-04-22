import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultAnchor } from "../target/types/vault_anchor";
import { assert } from "chai";

describe("vault-anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VaultAnchor as Program<VaultAnchor>;
  const user = provider.wallet.publicKey;

  // Amount to deposit/withdraw in lamports
  const depositAmount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
  const withdrawAmount = new anchor.BN(0.5 * anchor.web3.LAMPORTS_PER_SOL);

  // PDAs
  let vaultStatePda: anchor.web3.PublicKey;
  let vaultPda: anchor.web3.PublicKey;

  // Find PDAs
  before(async () => {
    [vaultStatePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("state"), user.toBuffer()],
      program.programId
    );

    [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), vaultStatePda.toBuffer()],
      program.programId
    );
  });

  it("Initializes the vault", async () => {
    // Get initial balances
    const initialUserBalance = await provider.connection.getBalance(user);
    const initialVaultBalance = await provider.connection.getBalance(vaultPda);

    // Initialize the vault
    await program.methods
      .initialize()
      .accounts({
        user: user,
        vaultState: vaultStatePda,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Get final balances
    const finalUserBalance = await provider.connection.getBalance(user);
    const finalVaultBalance = await provider.connection.getBalance(vaultPda);

    // Verify vault state account was created
    const vaultState = await program.account.vaultState.fetch(vaultStatePda);
    assert.isNotNull(vaultState);

    // Verify balances
    assert.isBelow(finalUserBalance, initialUserBalance, "User balance should decrease due to rent");
    assert.equal(finalVaultBalance, initialVaultBalance, "Vault should have no SOL initially");
  });

  it("Deposits SOL into the vault", async () => {
    // Get initial balances
    const initialUserBalance = await provider.connection.getBalance(user);
    const initialVaultBalance = await provider.connection.getBalance(vaultPda);

    // Deposit SOL
    await program.methods
      .deposit(depositAmount)
      .accounts({
        user: user,
        vaultState: vaultStatePda,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Get final balances
    const finalUserBalance = await provider.connection.getBalance(user);
    const finalVaultBalance = await provider.connection.getBalance(vaultPda);

    // Verify balances
    assert.isBelow(
      finalUserBalance,
      initialUserBalance - depositAmount.toNumber(),
      "User balance should decrease by deposit amount plus fees"
    );
    assert.equal(
      finalVaultBalance,
      initialVaultBalance + depositAmount.toNumber(),
      "Vault balance should increase by deposit amount"
    );
  });

  it("Withdraws SOL from the vault", async () => {
    // Get initial balances
    const initialUserBalance = await provider.connection.getBalance(user);
    const initialVaultBalance = await provider.connection.getBalance(vaultPda);

    // Withdraw SOL
    await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        user: user,
        vaultState: vaultStatePda,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Get final balances
    const finalUserBalance = await provider.connection.getBalance(user);
    const finalVaultBalance = await provider.connection.getBalance(vaultPda);

    // Verify balances with more lenient checks
    const expectedMinUserBalance = initialUserBalance + withdrawAmount.toNumber() - 10000; // Account for max possible fees
    assert.isAbove(
      finalUserBalance,
      expectedMinUserBalance,
      "User balance should increase by at least withdraw amount minus max fees"
    );
    assert.equal(
      finalVaultBalance,
      initialVaultBalance - withdrawAmount.toNumber(),
      "Vault balance should decrease by withdraw amount"
    );
  });

  it("Closes the vault", async () => {
    // Get initial balances
    const initialUserBalance = await provider.connection.getBalance(user);
    const initialVaultBalance = await provider.connection.getBalance(vaultPda);

    // Close the vault
    await program.methods
      .close()
      .accounts({
        user: user,
        vaultState: vaultStatePda,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Get final balances
    const finalUserBalance = await provider.connection.getBalance(user);
    const finalVaultBalance = await provider.connection.getBalance(vaultPda);

    // Verify vault state account was closed
    try {
      await program.account.vaultState.fetch(vaultStatePda);
      assert.fail("Vault state account should not exist");
    } catch (err) {
      assert.include(err.message, "Account does not exist");
    }

    // Verify balances
    assert.isAbove(
      finalUserBalance,
      initialUserBalance + initialVaultBalance - 10000, // Account for transaction fees
      "User should receive vault balance minus fees"
    );
    assert.equal(finalVaultBalance, 0, "Vault should be empty");
  });
});
