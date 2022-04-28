import { React, useRef, useState } from "react";
import Card from "../../Card";
import Button from "../Button";
import useSubmitCard from "../../../hooks/useSubmitCard";

import classes from "./CreateDeck.module.css";

const CreateDeck = (props) => {
	const [cardName, setCardName] = useState("");
	const [cardAtk, setCardAtk] = useState(0);
	const [cardDef, setCardDef] = useState(0);
	const [cardDescription, setCardDescription] = useState("");
	const [cardType, setCardType] = useState("monster");
	const [spellAmount, setSpellAmount] = useState(0);

	const card = {
		name: cardName,
		atk: cardAtk,
		def: cardDef,
		description: cardDescription,
		cardType: cardType,
	};

	const post = async () => {
		console.log("fn fired");
		const response = await fetch("http://localhost:9000/createMonsterCard", {
			method: "POST",
			mode: "cors",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(card),
		});
		// console.log("test");
		// console.log(response);
		// const content = await response.json();
		// console.log(content);
	};

	function cardNameHandler(e) {
		setCardName(e.target.value);
	}
	function cardAtkHandler(e) {
		setCardAtk(e.target.value);
	}
	function cardDefHandler(e) {
		setCardDef(e.target.value);
	}
	function cardDescriptionHandler(e) {
		setCardDescription(e.target.value);
	}
	function cardTypeHandler(e) {
		setCardType(e.target.value);
	}
	function amountDecrementHandler() {
		if (spellAmount !== 0) {
			setSpellAmount((prevState) => prevState - 100);
		}
	}
	function amountIncrementHandler() {
		setSpellAmount((prevState) => prevState + 100);
	}
	function atkIncrementHandler() {
		setCardAtk((prevState) => prevState + 100);
	}
	function atkDecrementHandler() {
		if (cardAtk !== 0) {
			setCardAtk((prevState) => prevState - 100);
		}
	}
	function defDecrementHandler() {
		if (cardDef !== 0) {
			setCardDef((prevState) => prevState - 100);
		}
	}
	function defIncrementHandler() {
		setCardDef((prevState) => prevState + 100);
	}
	function submitFormHandler(e) {
		e.preventDefault();
		console.log(card);
		post();
	}

	// console.log(cardType.value);

	return (
		<div className={classes.createDeckMenu}>
			<h2 className={classes.createTitle}>Create Your Deck</h2>
			<div className={classes.cardFormSection}>
				<form onSubmit={submitFormHandler}>
					<div className={classes.formControl}>
						<select onChange={cardTypeHandler} name="cardType" id="cardType">
							<option name="monster" value="monster" defaultValue="monster">
								Monster
							</option>
							<option value="spell">Spell</option>
							<option value="trap">Trap</option>
						</select>
						<label htmlFor="cardType">Card Type</label>
					</div>
					{cardType === "spell" && (
						<div className={classes.formControl}>
							<div className={classes.amountChange}>
								<select>
									<option value="Heal">Heal</option>
									<option value="Damage">Damage</option>
									<option value="Destroy">Destroy</option>
									<option value="Increase">Increase</option>
								</select>
								<div className={classes.spellAmountContainer}>
									<button type="button" onClick={amountDecrementHandler}>
										-
									</button>
									<span className={classes.amountCounter}>{spellAmount}</span>
									<button type="button" onClick={amountIncrementHandler}>
										+
									</button>
								</div>
							</div>
							<div className={classes.spellTypeLabels}>
								<label htmlFor="spellType">Spell Type</label>
								<label htmlFor="spellAmount">Amount</label>
							</div>
						</div>
					)}
					<div className={classes.formControl}>
						<input type="text" id="name" onChange={cardNameHandler}></input>
						<label htmlFor="name">Card Name</label>
					</div>
					{cardType === "monster" && (
						<div className={classes.formControl}>
							<div className={classes.statChange}>
								<div>
									<label htmlFor="atk">Card Attack</label>
									<label htmlFor="def">Card Defence</label>
								</div>
								<div>
									<button type="button" onClick={atkDecrementHandler}>
										-
									</button>
									<span className={classes.amountCounter}>{cardAtk}</span>
									<button type="button" onClick={atkIncrementHandler}>
										+
									</button>

									<button type="button" onClick={defDecrementHandler}>
										-
									</button>
									<span className={classes.amountCounter}>{cardDef}</span>
									<button type="button" onClick={defIncrementHandler}>
										+
									</button>
								</div>
							</div>
						</div>
					)}

					<div className={classes.formControl}>
						<textarea type="text" id="description" onChange={cardDescriptionHandler}></textarea>
						<label htmlFor="description">Card Description</label>
					</div>
					<div className={classes.formControl}>
						<label className={classes.fileInput} htmlFor="image">
							Upload Image
							<input type="file" id="image"></input>
						</label>
					</div>
					<div className={classes.createBtnContainer}>
						<Button className={classes.backBtn}>Back</Button>
						<Button className={"button"}>Create Card</Button>
					</div>
				</form>
			</div>
			<div className={classes.cardDisplaySection}>
				<Card className="createDeckDisplayCard" name={cardName} atk={cardAtk} def={cardDef} description={cardDescription} inspect={true} type="monster" />
			</div>
		</div>
	);
};

export default CreateDeck;
