import { createContext } from "react";

export const AuthContext = createContext(null);

/*
const [isAuth, setIsAuth] = useState(false);
<AuthContext.Provider value={{
	isAuth,
	setIsAuth
}}/>

=========================

const {isAuth, setIsAuth} = useContext(AuthContext);

*/