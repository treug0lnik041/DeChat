import * as anchor from "@project-serum/anchor";
import { ConfirmOptions, Connection } from "@solana/web3.js";

// For developing only
import { DeChat } from "../../../target/types/de_chat";
import idl from "../../../target/idl/de_chat.json";
import Phantom from "./Phantom";

class Program {
	//public programID: PublicKey;
	public program: anchor.Program<DeChat>;
	private provider: anchor.AnchorProvider;

	constructor(host: string, programID: string, wallet: Phantom) {	
		const opts: ConfirmOptions = {
    		preflightCommitment: 'recent'
		}

		const connection = new Connection(host, "recent");

		this.provider = new anchor.AnchorProvider(connection, wallet, opts);
		anchor.setProvider(this.provider);

		this.program = new anchor.Program<any>(idl, programID, this.provider);
	}

	async airdrop(amount: number) {
		const tx = await this.provider.connection.requestAirdrop(this.provider.publicKey, amount * anchor.web3.LAMPORTS_PER_SOL);

		const blockHash = await this.provider.connection.getLatestBlockhash();
		await this.provider.connection.confirmTransaction({
			lastValidBlockHeight: blockHash.lastValidBlockHeight,
			blockhash: blockHash.blockhash,
			signature: tx
		});
	}

	async getBalance() {
		return this.provider.connection.getBalance(this.provider.publicKey);
	}

	async createNewUser(name: string) {
		return this.program.methods.createNewUser(name).rpc();
	}
}

export default Program;