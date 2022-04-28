import React from "react";

import classes from "./Deck.module.css";

const Deck = () => {
	return (
		<div className={classes.deck}>
			<button>Add Cards</button>
			<button>View Deck</button>
		</div>
	);
};

export default Deck;
