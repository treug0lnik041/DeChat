import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Header from "./components/Header/Header";

// Pages
import Login from "./pages/Login";
import Messenger from "./pages/Messenger";
import NotFound from "./pages/NotFound";
import { AuthContext } from "./context";

function App() {
	const [walletProvider, setWalletProvider] = useState(null);

	return (
		<div className="App">
			<AuthContext.Provider value={{
				walletProvider : walletProvider,
				setWalletProvider : setWalletProvider
			}}>
				<BrowserRouter>
					<Header/>
				
						<main>
						<Routes>
							<Route path="/" element={ walletProvider ? <Messenger/> : <Login/> }/>
							<Route path="/login" element={<Login/>}/>
							<Route path="/messenger" element={walletProvider ? <Messenger/> : <Login/>}/>
							<Route path="*" element={<NotFound/>}/>
						</Routes>
						</main>
				</BrowserRouter>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
