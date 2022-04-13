import React from "react";
import Card from "../Card";
import Button from "./Button";

import { ReactComponent as AtkPosIcon } from "../../Images/Icons/AtkPosIcon.svg";
import { ReactComponent as DefPosIcon } from "../../Images/Icons/defPosIcon.svg";
import { ReactComponent as SpellIcon } from "../../Images/Icons/spellIcon.svg";
import { ReactComponent as CardIcon } from "../../Images/Icons/cardIcon.svg";
import classes from "./CardDisplay.module.css";
import Modal from "./Modal";

const CardDisplay = (props) => {
	return (
		<Modal onClose={props.onClose}>
			<div className={classes.cardDisplay}>
				{props.selectedCard.tributesRequired && <p>This monster requires a tribute to summon!</p>}
				<Card
					className={"displayedCard"}
					name={props.selectedCard.name}
					atk={props.selectedCard.atk}
					def={props.selectedCard.def}
					src={props.selectedCard.img}
					type={props.selectedCard.type}
					effect={props.selectedCard.effect}
					inspect={props.inspect}
				/>
				<div className={classes.buttonContainer}>
					{props.hasSelectedCard && !props.isSpellCard && !props.isTrapCard && <AtkPosIcon className={classes.atkPositionIcon} onClick={props.PlaceCardDown} />}
					{props.hasSelectedCard && !props.isSpellCard && !props.isTrapCard && <p>Attack Position</p>}
					{props.hasSelectedCard && !props.isSpellCard && !props.isTrapCard && <DefPosIcon className={classes.defPositionIcon} onClick={props.PlaceCardDown} />}
					{props.hasSelectedCard && !props.isSpellCard && !props.isTrapCard && <p>Defence Position</p>}
					{props.hasSelectedCard && props.isSpellCard && !props.isTrapCard && <SpellIcon className={classes.spellIcon} onClick={props.useSpell} />}
					{props.hasSelectedCard && props.isSpellCard && !props.isTrapCard && <p>Activate Spell</p>}
					{props.hasSelectedCard && !props.isSpellCard && props.isTrapCard && <CardIcon className={classes.trapIcon} onClick={props.PlaceCardDown} />}
					{props.hasSelectedCard && !props.isSpellCard && props.isTrapCard && <p>Set Trap Card</p>}
				</div>
				<div className={classes.descriptionContainer}>{props.selectedCard.cardDescription}</div>
			</div>
		</Modal>
	);
};

export default CardDisplay;
