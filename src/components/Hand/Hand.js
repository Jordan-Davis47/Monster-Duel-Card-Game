import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { playerActions } from "../../store/index";
import { useState } from "react";
import Button from "../UI/Button";
import Card from "../Card";
import Modal from "../UI/Modal";
import CardDisplay from "../UI/CardDisplay";

import classes from "./Hand.module.css";

let inspect;
let selectedCard;
// let isSpellCard;
let id;
// let isTributing = false;

const Hand = (props) => {
	const dispatch = useDispatch();
	const [hasSelectedCard, setHasSelectedCard] = useState(false);
	const hasSummoned = useSelector((state) => state.player.hasSummoned);
	const [isSpellCard, setIsSpellCard] = useState(false);
	const [isTrapCard, setIsTrapCard] = useState(false);
	const spellCastCard = useSelector((state) => state.player.spellCastCard);

	const isTributing = useSelector((state) => state.player.isTributing);
	const tributes = useSelector((state) => state.player.tributes);

	function selectCard(e) {
		if (selectedCard && hasSelectedCard) {
			selectedCard = "";
			setHasSelectedCard(false);
			setIsSpellCard(false);
			setIsTrapCard(false);
			return;
		}
		id = e.target.parentNode.parentNode.id;
		const cardName = e.target.parentNode.firstChild.nextElementSibling.textContent;
		const card = props.hand.find((card) => card.name === cardName);
		const cardCopy = { ...card, owner: id };
		selectedCard = cardCopy;
		if (!selectedCard) {
			return;
		}
		// console.log(selectedCard);

		if (props.turn && id === props.id) {
			if (selectedCard.type === "spell") {
				setIsSpellCard(true);
			}
			if (selectedCard.type === "trap") {
				console.log("istrap set");
				setIsTrapCard(true);
			}
			setHasSelectedCard(true);
			inspect = true;
		}
	}

	// console.log(isSpellCard);

	function PlaceCardDown(e) {
		const position = e.target.id;
		const card = selectedCard;
		// const card = props.hand.find((card) => card.name === cardName);
		let cardCopy = { ...card };
		position === "Defence" ? (cardCopy.position = "def") : (cardCopy.position = "atk");

		if (cardCopy.tributesRequired) {
			dispatch(playerActions.setIsTributing(true));
			dispatch(playerActions.setSelectedCard({ card: cardCopy }));
			setHasSelectedCard(false);

			return;
		}
		if (cardCopy.type === "trap") {
			// console.log("first trap check");
			if (props.p1Turn) {
				dispatch(playerActions.placeCard({ card: cardCopy, player: "player1" }));
				return;
			}
		}

		if (props.p1Turn && !hasSummoned) {
			dispatch(playerActions.placeCard({ card: cardCopy, player: "player1" }));
			dispatch(playerActions.setTributesToFalse());
			setHasSelectedCard(false);
		} else if (props.p2Turn && !hasSummoned) {
			dispatch(playerActions.placeCard({ card: cardCopy, player: "player2" }));
			dispatch(playerActions.setTributesToFalse());
			setHasSelectedCard(false);
		}
	}

	function useSpell() {
		const spellCard = selectedCard;
		console.log(spellCard);
		dispatch(playerActions.effectCreator({ card: spellCard }));
		dispatch(playerActions.setSpellCastCard({ card: spellCard }));
		setHasSelectedCard(false);
		setIsSpellCard(false);
	}

	// console.log(spellCastCard.effect, spellCastCard["effect"]["stat"]);

	function closeModal() {
		setIsSpellCard(false);
		setIsTrapCard(false);
		setHasSelectedCard(false);
	}

	return (
		<Fragment>
			{hasSelectedCard && <CardDisplay onClose={closeModal} inspect={inspect} selectedCard={selectedCard} hasSelectedCard={hasSelectedCard} isSpellCard={isSpellCard} isTrapCard={isTrapCard} PlaceCardDown={PlaceCardDown} useSpell={useSpell} />}
			{/* PLAYER HAND */}
			<div id={props.id} className={props.className} onClick={selectCard}>
				{props.hand && props.hand.map((card) => <Card key={card.id} name={card.name} atk={card.atk} def={card.def} src={card.img} type={card.type} effect={card.effect} />)}
			</div>
		</Fragment>
	);
};

export default Hand;
