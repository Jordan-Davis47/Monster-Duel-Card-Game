import React, { useState } from "react";

import Button from "../Button";

import classes from "./CreateDeckMenu.module.css";

const CreateDeckMenu = () => {
	const [deckName, setDeckName] = useState();

	const sendDeckData = async () => {
		console.log(deckName);
		await fetch("http://localhost:9000/createDeck", {
			method: "POST",
			mode: "cors",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: deckName,
			}),
		});
	};

	function createDeckHandler(e) {
		e.preventDefault();
		sendDeckData();
	}

	function setDeckNameHandler(e) {
		setDeckName(e.target.value);
	}

	return (
		<div className={classes.createDeckContainer}>
			<form onSubmit={createDeckHandler}>
				<label htmlFor="deckName">Deck Name</label>
				<input name="deckName" type="text" onChange={setDeckNameHandler} />
				<button className="button">Create</button>
			</form>
		</div>
	);
};

export default CreateDeckMenu;
