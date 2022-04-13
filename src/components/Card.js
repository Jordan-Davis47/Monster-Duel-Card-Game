import React from "react";
import classes from "./Card.module.css";

const Card = (props) => {
	const cardNameClasses = props.inspect ? `${classes.name}` : `${classes.hide}`;

	let cardClasses = `${classes.card}`;

	if (props.position === "def") {
		cardClasses = `${classes.card} ${classes.defencePosition}`;
	}
	if (props.type === "spell") {
		cardClasses = `${classes.card} ${classes.spellCard}`;
	}
	if (props.clicked) {
		if (props.position === "def") {
			cardClasses = `${classes.card} ${classes.defencePosition} ${classes.cardClicked}`;
		} else {
			cardClasses = `${classes.card} ${classes.cardClicked}`;
		}
	}
	if (props.className === "displayedCard") {
		cardClasses = ` ${classes.displayedCard}`;
	}
	if (props.className === "tributingCard") {
		cardClasses = `${classes.tributingCard}`;
	}
	if (props.className === "summoningCard") {
		cardClasses = `${classes.summoningCard}`;
	}
	if (props.className === "displayedTrapCard") {
		if (props.clicked) {
			console.log("click pass check");
			cardClasses = ` ${classes.displayedTrapCard} ${classes.cardClicked}`;
		} else {
			cardClasses = `${classes.displayedTrapCard}`;
		}
	}

	return (
		<div className={cardClasses}>
			<div className={classes.clickLayer} onClick={props.onClick}></div>
			<div className={cardNameClasses}>{props.name}</div>
			<div className={classes.rating}></div>
			<img alt="card monster" src={props.src} className={classes.cardImage} />
			<div className={classes.stats}>
				{props.type === "monster" && <div className={classes.atkStat}>{props.atk}</div>}
				{props.type === "monster" && <div className={classes.defStat}>{props.def}</div>}
				{props.type === "spell" && props.effect && <div className={classes.spellStat}>{props.effect.type}</div>}
				{props.type === "trap" && props.effect && <div className={classes.spellStat}>{props.effect.type}</div>}
			</div>
		</div>
	);
};

export default Card;
