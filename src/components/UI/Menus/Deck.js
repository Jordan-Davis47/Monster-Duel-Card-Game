import classes from "./DeckSelectMenu.module.css";
let deckClasses = "";
const Deck = (props) => {
	if (props.isClicked) {
		deckClasses = `${props.className} ${classes.clicked}`;
	} else {
		deckClasses = `${props.className}`;
	}

	return <div onClick={props.onClick} className={deckClasses}></div>;
};

export default Deck;
