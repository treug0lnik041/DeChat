import React, { useContext, useEffect, useState } from "react";
import "../styles/Messenger.css";
import { AuthContext } from "../context/index";
import DialogList from "../components/Messenger/DialogList/DialogList";
import Program from "../program-sdk/Program";

type SpecificDialog = {
	username: string,
	lastMessage: string
}

function Messenger() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const {walletProvider, setWalletProvider} = useContext(AuthContext);
	const [program, setProgram] = useState<Program | null>(null);

	useEffect(() => {
		setProgram(new Program("http://localhost:8899", "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS", walletProvider));
	}, []);

	const [dialogArray, setDialogArray] = useState<Array<SpecificDialog> | null>(null);

	useEffect(() => {
		console.log(`Provider public key: ${walletProvider.publicKey.toString()}`);

		// just for test
		let arr = new Array<SpecificDialog>();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="messenger">
			<DialogList dialogArray={dialogArray}/>
			<div className="dialog__block">
				<h1>Click on any dialog!</h1>
			</div>
		</div>
	)
}

export default Messenger;