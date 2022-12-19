import React from "react";

import cl from "./Button.module.css";

function Button({children, ...props} : any) {
	return (
		<button className={cl.button} {...props}>
			{children}
		</button>
	);
}

export default Button;