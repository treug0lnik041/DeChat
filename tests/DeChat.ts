import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DeChat } from "../target/types/de_chat";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { assert } from "chai";

describe("DeChat", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DeChat as Program<DeChat>;

  it("UserPool", async () => {
    // Get userpool PDA
    const [userPool, _] = await publicKey.findProgramAddressSync([
      anchor.utils.bytes.utf8.encode("user-pool"),
      program.programId.toBuffer()
    ], program.programId);

    await program.methods.createUserPool().accounts({
      payer: provider.wallet.publicKey,
      authority: program.programId,
      userPool: userPool,
    }).rpc();

    await program.methods.createNewUser("username_for_test").accounts({
      payer: provider.wallet.publicKey,
      authority: program.programId,
      userPool: userPool,
    }).rpc();

    let username = await program.methods.getUserName(provider.wallet.publicKey).accounts({
      authority: program.programId,
      userPool: userPool,
    }).view();

    assert(username == "username_for_test", "Username is wrong");

    await program.methods.changeUserName("username1").accounts({
      payer: provider.wallet.publicKey,
      authority: program.programId,
      userPool: userPool,
    }).rpc();

    username = await program.methods.getUserName(provider.wallet.publicKey).accounts({
      authority: program.programId,
      userPool: userPool,
    }).view();

    assert(username == "username1", "Username is wrong");

    const pubkey = await program.methods.getUserPubkey("username1").accounts({
      authority: program.programId,
      userPool: userPool,
    }).view();

    assert(pubkey.toString() == provider.wallet.publicKey.toString(), "Public key is wrong");
  });

  async function getMessagePool(payer: anchor.web3.PublicKey, user2: anchor.web3.PublicKey, programId: anchor.web3.PublicKey) {
    const [messagePool, _] = await publicKey.findProgramAddressSync([
      user2.toBuffer(),
      provider.wallet.publicKey.toBuffer()
    ], programId);

    return messagePool;
  }

  it("MessagePool", async () => {
    const user2 = anchor.web3.Keypair.generate();
    const messagePool = await getMessagePool(provider.wallet.publicKey, user2.publicKey, program.programId);

    await program.methods.createMessagePool().accounts({
      payer: provider.wallet.publicKey,
      user2: user2.publicKey,
      messagePool: messagePool,
    }).rpc();
  });
});
