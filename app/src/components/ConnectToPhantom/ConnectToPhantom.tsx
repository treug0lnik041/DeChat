import { useEffect, useState } from "react";
import cl from "./ConnectToPhantom.module.css";
import Button from "../UI/Button/Button";
import Phantom, { getPhantomProvider } from "../../program-sdk/Phantom";

function ConnectToPhantom({setWalletProvider, ...props} : any) {
	const [phantom, setPhantom] = useState<Phantom | null>(null);

	useEffect(() => {
			console.log("DEBUG");
			const phantomProvider = (window as any).solana;
			setPhantom(phantomProvider);
	}, []);

	useEffect(() => {
		phantom?.on("connect", () => {
			setWalletProvider(getPhantomProvider());
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phantom]);

	const connectHandler = async () => {
		const phantomProvider = (window as any).solana;
		setPhantom(phantomProvider);
		await phantomProvider?.connect({ onlyIfTrusted: false });
	}

		return (
			<div>
				<Button onClick={connectHandler}>
				Connect to Phantom
				</Button>
				<label style={{color: "gray"}}>or</label>
				<a
					href="https://phantom.app/"
					target="_blank"
					className={cl.a} rel="noreferrer"
    			>
      				Get Phantom
    			</a>	
			</div>
		)
}

export default ConnectToPhantom;