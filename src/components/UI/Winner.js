import Modal from "./Modal";
import classes from "./Winner.module.css";

const Winner = (props) => {
	let winnerText;
	if (props.winner === "p1") {
		winnerText = "Player 1 Wins The Duel!";
	} else if (props.winner === "p2") {
		winnerText = "Player 2 Wins The Duel!";
	} else {
		winnerText = "whatever";
	}

	return (
		<Modal>
			<div className={classes.textContainer}>
				<h1 className={classes.winnerText}>{winnerText}</h1>
				<h3>A Hard Fought Victory!</h3>
			</div>
		</Modal>
	);
};

export default Winner;
