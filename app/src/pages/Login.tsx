import React, { useContext, useEffect } from "react";
import ConnectToPhantom from "../components/ConnectToPhantom/ConnectToPhantom";

import "../styles/Login.css";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";


function Login() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const {walletProvider, setWalletProvider} = useContext<any>(AuthContext);

	const navigate = useNavigate()

	useEffect(() => {
		navigate("/messenger");
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletProvider]);

	return (
		<div>
			<div className="login__block">
				<h1>Welcome to DeChat!</h1>
				<ConnectToPhantom setWalletProvider={setWalletProvider}/>
			</div>
		</div>
	)
}

export default Login;