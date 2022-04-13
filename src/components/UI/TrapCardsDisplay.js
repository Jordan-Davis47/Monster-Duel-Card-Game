import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import Card from "../Card";
import classes from "./TrapCardDisplay.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBolt, faXmark } from "@fortawesome/free-solid-svg-icons";
import { playerActions } from "../../store";

let trapCardClickIds = "";

const TrapCardsDisplay = (props) => {
	const dispatch = useDispatch();
	const [focusedCard, setFocusedCard] = useState([]);

	function setFocusedCardHandler(e) {
		trapCardClickIds = "";
		const cardName = e.target.nextElementSibling.textContent;
		trapCardClickIds += cardName;
		const card = props.p1TrapCards.find((card) => card.name === cardName);
		setFocusedCard(card);
	}

	function activateTrapCardHandler() {
		dispatch(playerActions.effectCreator({ card: focusedCard }));
		props.onClose();
		dispatch(playerActions.battleCalculation());
	}

	return (
		<Modal className={props.className}>
			<h3>Choose a trap to activate</h3>
			<div className={classes.trapCardsContainer}>
				{!props.p1Turn &&
					props.p1TrapCards.map((card) => (
						<Card inspect={props.inspect} className="displayedTrapCard" key={card.id} name={card.name} src={card.img} effect={card.effect} type={card.type} onClick={setFocusedCardHandler} clicked={trapCardClickIds.includes(`${card.name}`)} />
					))}
				{!props.p2Turn && props.p2TrapCards.map((card) => <Card key={card.id} name={card.name} src={card.img} effect={card.effect} type={card.type} onClick={setFocusedCardHandler} />)}
			</div>
			{focusedCard.id && <div className={classes.focusedCardContainer}>{focusedCard.id && <p>{focusedCard.cardDescription}</p>} </div>}
			{focusedCard.id && (
				<div className={classes.buttonContainer}>
					<div>
						<FontAwesomeIcon className={classes.boltIcon} icon={faBolt} onClick={activateTrapCardHandler} />
						<p>Activate Trap</p>
					</div>
					<div>
						<FontAwesomeIcon className={classes.cancelIcon} icon={faXmark} onClick={props.onClose} />
						<p>Cancel</p>
					</div>
				</div>
			)}
		</Modal>
	);
};

export default TrapCardsDisplay;
