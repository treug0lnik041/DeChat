import React from "react";
import cl from "./Input.module.css";

function Input(props : any) {
	return (
		<input className={cl.input} type="text" {...props}/>
	);
}

export default Input;