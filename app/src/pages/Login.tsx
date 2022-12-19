import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/UI/Button/Button";
import Input from "../components/UI/Input/Input";

import "../styles/Login.css";

function Login({setLoginState} : any) {
	let [loginData, setLoginData] = useState({wallet_id: '', private_key: ''});
	let [isButtonDisabled, setButtonDisabled] = useState(true);

	function signIn(e : any) {
		e.preventDefault();

		let {wallet_id, private_key} = loginData;

		/*
		 TODO: use Account and Contract contexts
		*/ 
	}

	useEffect(() => {
		if (loginData.wallet_id.length > 6 && loginData.private_key.length > 32) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [loginData]);

	return (
		<div>
			<div className="login__block">
				<h1>Welcome to DeChat!</h1>
				<form onSubmit={signIn}>
					<Input 
						placeholder="username" 
						value={loginData.wallet_id} 
						onChange={(e : any) => setLoginData({...loginData, wallet_id: e.target.value})} />
					<Input placeholder="solana private key" value={loginData.private_key} onChange={(e : any) => setLoginData({...loginData, private_key: e.target.value})} />
					<Button disabled={isButtonDisabled}>Sign in</Button>
				</form>
				<label>or</label>
				<Button>Sign up</Button>
			</div>
		</div>
	)
}

export default Login;