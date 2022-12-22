import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DeChat } from "../target/types/de_chat";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { assert, expect } from "chai";
import { PublicKey, Keypair } from "@solana/web3.js";

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

  async function createMessagePool(sender: PublicKey | anchor.web3.Keypair, receiver: PublicKey) {
    if (sender instanceof PublicKey) {
      const [messagePool, _] = await publicKey.findProgramAddressSync([
        receiver.toBuffer(),
        sender.toBuffer()
      ], program.programId);
  
      await program.methods.createMessagePool().accounts({
        sender,
        receiver,
        messagePool,
      }).rpc();

      return messagePool;
    } else {
      const [messagePool, _] = await publicKey.findProgramAddressSync([
        receiver.toBuffer(),
        sender.publicKey.toBuffer()
      ], program.programId);

      await program.methods.createMessagePool().accounts({
        sender: sender.publicKey,
        receiver,
        messagePool
      }).signers([sender]).rpc();

      return messagePool;
    }
  }

  it("MessagePool", async () => {
    const user2 = anchor.web3.Keypair.generate();
    const messagePool = await createMessagePool(provider.wallet.publicKey, user2.publicKey);
  });

  async function sendMessage(sender: PublicKey, receiver: PublicKey, messagePool: PublicKey, text: string) {
    await program.methods.sendMessage(text).accounts({
      sender,
      receiver,
      messagePool: messagePool,
    }).rpc();
  }

  async function receiveMessages(sender: PublicKey, receiver: PublicKey, messagePool: PublicKey) {
    return await program.methods.receiveMessages().accounts({
      sender,
      receiver,
      messagePool,
    }).view();
  }

  async function clearMessages(sender: PublicKey, receiver: PublicKey, messagePool: PublicKey) {
    await program.methods.clearMessages().accounts({
      sender,
      receiver,
      messagePool
    }).rpc();
  }

  it("send and receive messages", async () => {
    const user2 = anchor.web3.Keypair.generate();

    // User 1 (provider)
    const messagePool1 = await createMessagePool(provider.wallet.publicKey, user2.publicKey);

    for (let i = 0; i < 10; i++) {
      await sendMessage(provider.wallet.publicKey, user2.publicKey, messagePool1, i.toString());
    }

    let messages = await receiveMessages(provider.wallet.publicKey, user2.publicKey, messagePool1); 

    expect(messages[9].text).to.equal("9");

    // User 2 (user2)
    const messagePool2 = await createMessagePool(user2.publicKey, provider.wallet.publicKey);

    for (let i = 10; i < 20; i++) {
      await sendMessage(user2.publicKey, provider.wallet.publicKey, messagePool2, i.toString());
    }

    messages = await receiveMessages(user2.publicKey, provider.wallet.publicKey, messagePool2);

    expect(messages[9].text).to.equal("19");

    // Clear message pool
    await clearMessages(provider.wallet.publicKey, user2.publicKey, messagePool1);
    await clearMessages(user2.publicKey, provider.wallet.publicKey, messagePool2);

    messages = await receiveMessages(provider.wallet.publicKey, user2.publicKey, messagePool1);
    expect(messages.length).to.eql(0);

    messages = await receiveMessages(user2.publicKey, provider.wallet.publicKey, messagePool2);
    expect(messages.length).to.eql(0);
  })
});
