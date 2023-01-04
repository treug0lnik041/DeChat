import cl from "./Dialog.module.css";

function Dialog({username, lastMessage}: any) {
	return (
		<div className={cl.dialog}>
			<h3 className={cl.username} >{username}</h3>
			<p className={cl.lastMessage}>{lastMessage}</p>
		</div>
	)
}

export default Dialog;