import React, { useContext } from "react";
import { Link } from "react-router-dom";
import cl from "./Header.module.css";
import { AuthContext } from "../../context";

function Header() {
	const {walletProvider, setWalletProvider} = useContext<any>(AuthContext);

	function signout(e: any) {
		walletProvider.disconnect();
		setWalletProvider(null);
		console.log("Signing out");
		// TODO: disconnect provider
	}

	return (
		<header className={cl.header}>
			<Link to={"/"} className={cl.dechat}><h3>DeChat</h3></Link>
			{ walletProvider 
			? <button onClick={signout} className={cl.accbtn}>
				Sign out
			</button>
			: <Link to={"/login"} className={cl.accbtn}>
				Sign in
			</Link>
			}
		</header>
	);
}

export default Header;