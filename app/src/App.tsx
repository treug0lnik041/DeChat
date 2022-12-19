import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Header from "./components/Header/Header";

// Pages
import Login from "./pages/Login";
import Messenger from "./pages/Messenger";
import NotFound from "./pages/NotFound";

function App() {
	let [isLoggined, setLoginState] = useState(false); 

	/*
	useEffect(() => {
		if (localStorage.getItem('wallet_id) && localStorage.getItem('private_key))
			setLoginState(true);
	}. []);
	*/

	return (
		<div className="App">
			<BrowserRouter>
				<Header isLoggined={isLoggined}/>
				
					<main>
					<Routes>
						<Route path="/login" element={<Login setLoginState={setLoginState}/>}/>
						<Route path="/messenger" element={<Messenger/>}/>
						<Route path="/404notfound" element={<NotFound/>}/>
						<Route path="*" element={<NotFound/>}/>
					</Routes>
					</main>
			</BrowserRouter>
		</div>
	);
}

export default App;
