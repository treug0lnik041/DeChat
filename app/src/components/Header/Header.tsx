import React from "react";
import { Link } from "react-router-dom";
import cl from "./Header.module.css";

function Header({isLoggined} : any) {
	function signout(e: any) {
		e.preventDefault();

		/*
		localStorage.removeItem('wallet_id');
		localStorage.removeItem('private_key');
		*/
	}

	return (
		<header className={cl.header}>
			<h3 style={{cursor: 'pointer'}}>DeChat</h3>
				<Link to={"/login"} className={cl.accbtn}>
					{isLoggined ? "Sign out" : "Sign in"}
				</Link>
		</header>
	);
}

export default Header;