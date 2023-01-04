import { Wallet } from "@project-serum/anchor";

type Event = "connect" | "disconnect";

interface Phantom extends Wallet {
	connect: (props: any) => Promise<void>
	disconnect: () => Promise<void>
	on: (event: Event, callback: () => void) => void

}

export function getPhantomProvider() : any {
	if ('phantom' in window) {
		const provider = (window as any).phantom?.solana;

		if (provider?.isPhantom) {
			return provider;
		}
	}
}

export default Phantom;