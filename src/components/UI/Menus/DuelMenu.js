import { useState } from "react";
import DeckSelectMenu from "./DeckSelectMenu";
import classes from "./DuelMenu.module.css";
import MenuButton from "./MenuButton";

const DuelMenu = (props) => {
	const [showDeckMenu, setShowDeckMenu] = useState(false);
	const [matchType, setMatchType] = useState("");

	function showDeckMenuHandler(e) {
		setMatchType(e.target.textContent);
		// console.log(e.target.textContent);
		setShowDeckMenu(true);
	}
	function closeDeckMenuHandler() {
		setShowDeckMenu(false);
	}
	return (
		<div className={classes.duelMenu}>
			{!showDeckMenu && (
				<MenuButton onClick={showDeckMenuHandler}>
					<p>Single Player Match</p>
				</MenuButton>
			)}
			{!showDeckMenu && (
				<MenuButton onClick={showDeckMenuHandler}>
					<p>Local Multiplayer Match</p>
				</MenuButton>
			)}
			{!showDeckMenu && (
				<MenuButton onClick={props.onClose}>
					<p>Main Menu</p>
				</MenuButton>
			)}
			{showDeckMenu && <DeckSelectMenu onBack={closeDeckMenuHandler} onPickDeck={props.onPickDeck} matchType={matchType} />}
		</div>
	);
};

export default DuelMenu;
