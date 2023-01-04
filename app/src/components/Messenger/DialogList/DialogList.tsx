import React from "react";
import Dialog from "../Dialog/Dialog";

import cl from "./DialogList.module.css";

function DialogList({dialogArray}: any) {

	/*
		dialogArray<T>, where T: {
			username: string,
			lastMessage: message
		}
	*/
	return (
		<div className={cl.dialog__list}>
			{ dialogArray ? dialogArray.map((dialog: { username: any; lastMessage: any; })  => 
				<Dialog username={dialog.username} lastMessage={dialog.lastMessage}/>
			) : <h1>Looks empty...</h1> }
		</div>
	)
}

export default DialogList;