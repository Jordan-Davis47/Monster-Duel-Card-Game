import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playerActions } from "../../../store/index";
import { dragonDeck, natureDeck } from "../../Decks/Decks";
import Button from "../Button";
import Deck from "./Deck";

import classes from "./DeckSelectMenu.module.css";

// let deckName = "";
let deckClasses;
const p1Deck = [];
const p2Deck = [];

const DeckSelectMenu = (props) => {
	const dispatch = useDispatch();

	const [deckIsSelected, setDeckIsSelected] = useState(false);
	const [deckName, setDeckName] = useState("");

	function deckSelectHandler(e) {
		console.log(e.target.nextElementSibling.textContent);
		const deck = e.target.nextElementSibling.textContent;
		setDeckName(deck);
		console.log(deckName);
		console.log(e.target, e.target.nextElementSibling.textContent);
		if (props.matchType === "Single Player Match") {
			setDeckIsSelected(true);

			deckClasses = `${classes.deck} ${classes.clicked} `;
		}
		if (props.matchType === "Local Multiplayer Match") {
			console.log(p1Deck, p2Deck);

			if (!p1Deck.length || p1Deck[0] === "") {
				p1Deck[0] = deckName;
			} else {
				p2Deck[0] = deckName;
			}

			if (p1Deck.length && p2Deck.length) {
				setDeckIsSelected(true);
			}
		}
		console.log("deck clicked");
	}

	function startMatchHandler() {
		if (props.matchType === "Single Player Match") {
			dispatch(playerActions.activateAi(true));

			if (deckName === "Dragon Deck") {
				console.log("single reached");

				dispatch(playerActions.setPlayerDeck({ player: "player1", deck: dragonDeck }));
				dispatch(playerActions.setPlayerDeck({ player: "player2", deck: natureDeck }));
				props.onPickDeck();
			} else if (deckName === "Nature Deck") {
				console.log("single reached");

				dispatch(playerActions.setPlayerDeck({ player: "player2", deck: dragonDeck }));
				dispatch(playerActions.setPlayerDeck({ player: "player1", deck: natureDeck }));
				props.onPickDeck();
			}
		}
		if (props.matchType === "Local Multiplayer Match") {
			if (p1Deck[0] === "Dragon Deck") {
				console.log("p2check");

				dispatch(playerActions.setPlayerDeck({ player: "player1", deck: dragonDeck }));
				dispatch(playerActions.setPlayerDeck({ player: "player2", deck: natureDeck }));
				props.onPickDeck();
			} else if (p2Deck[0] === "Nature Deck") {
				console.log("p2check");

				dispatch(playerActions.setPlayerDeck({ player: "player2", deck: dragonDeck }));
				dispatch(playerActions.setPlayerDeck({ player: "player1", deck: natureDeck }));
				props.onPickDeck();
			}
			dispatch(playerActions.activateAi(false));
		}
	}

	console.log(p1Deck, p2Deck);

	return (
		<Fragment>
			<div className={classes.decksContainer}>
				<h2 className={classes.deckHeader}>Select A Deck To Play </h2>

				<div className={classes.deckContainer}>
					<Deck className={classes.deck} onClick={deckSelectHandler} isClicked={deckName.includes("Dragon")}></Deck>
					<p>Dragon Deck</p>
				</div>
				<div className={classes.deckContainer}>
					<Deck className={classes.deck} onClick={deckSelectHandler} isClicked={deckName.includes("Nature")}></Deck>
					<p>Nature Deck</p>
				</div>
				{deckIsSelected && (
					<Button className={classes.startButton} onClick={startMatchHandler}>
						Start Match
					</Button>
				)}
			</div>
			<Button className={classes.backButton} onClick={props.onBack}>
				Back
			</Button>
		</Fragment>
	);
};

export default DeckSelectMenu;
