import React, { useEffect, useState } from "react";
import { ReactComponent as CrossSwordsIcon } from "../../Images/Icons/crossSwords.svg";
import { useSelector, useDispatch } from "react-redux";
import { playerActions } from "../../store/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHandPointDown, faHourglassEnd, faSkullCrossbones, faChevronUp, faHandsHoldingCircle, faBars } from "@fortawesome/free-solid-svg-icons";

import classes from "./Board.module.css";
import btnClasses from "../UI/Button.module.css";
import Card from "../Card";
import CardSlot from "./CardSlot";
import Modal from "../UI/Modal";
import TributeDisplay from "../UI/TributeDisplay";
import TrapCardsDisplay from "../UI/TrapCardsDisplay";

const player1Wins = false;
const player2Wins = false;
let tributingPlayer = "";
let inspect;

const Board = (props) => {
	const dispatch = useDispatch();
	//GAME TURN//
	const turn = useSelector((state) => state.player.turn);
	//FIELD CARD SLOTS / PLAYING STATES //
	const player1FieldSlot1 = useSelector((state) => state.player.player1FieldSlot1);
	const player1FieldSlot2 = useSelector((state) => state.player.player1FieldSlot2);
	const player1FieldSlot3 = useSelector((state) => state.player.player1FieldSlot3);
	const player2FieldSlot1 = useSelector((state) => state.player.player2FieldSlot1);
	const player2FieldSlot2 = useSelector((state) => state.player.player2FieldSlot2);
	const player2FieldSlot3 = useSelector((state) => state.player.player2FieldSlot3);
	const player1FieldSlot1Playing = useSelector((state) => state.player.player1FieldSlot1Playing);
	const player1FieldSlot2Playing = useSelector((state) => state.player.player1FieldSlot2Playing);
	const player1FieldSlot3Playing = useSelector((state) => state.player.player1FieldSlot3Playing);
	const player2FieldSlot1Playing = useSelector((state) => state.player.player2FieldSlot1Playing);
	const player2FieldSlot2Playing = useSelector((state) => state.player.player2FieldSlot2Playing);
	const player2FieldSlot3Playing = useSelector((state) => state.player.player2FieldSlot3Playing);
	//SPELL SLOT PLAYING STATES//
	const player1SpellSlot1 = useSelector((state) => state.player.player1SpellSlot1);
	const player1SpellSlot2 = useSelector((state) => state.player.player1SpellSlot2);
	const player1SpellSlot3 = useSelector((state) => state.player.player1SpellSlot3);
	const player2SpellSlot1 = useSelector((state) => state.player.player2SpellSlot1);
	const player2SpellSlot2 = useSelector((state) => state.player.player2SpellSlot2);
	const player2SpellSlot3 = useSelector((state) => state.player.player2SpellSlot3);
	//FIELD SPELL SLOTS/STATES//
	const player1FieldSpell = useSelector((state) => state.player.player1FieldSpell);
	const player2FieldSpell = useSelector((state) => state.player.player2FieldSpell);
	const player1FieldSpellPlaying = useSelector((state) => state.player.player1FieldSpellPlaying);
	const player2FieldSpellPlaying = useSelector((state) => state.player.player2FieldSpellPlaying);
	//PLAYER LIFE/GRAVEYARD & BATTLE PHASE STATES //
	const battlePhase = useSelector((state) => state.player.battlePhase);
	const player1Life = useSelector((state) => state.player.player1Life);
	const player2Life = useSelector((state) => state.player.player2Life);
	const p1Graveyard = useSelector((state) => state.player.player1Graveyard);
	const p2Graveyard = useSelector((state) => state.player.player2Graveyard);
	//TRIBUTE SUMMON STATES//
	const isTributing = useSelector((state) => state.player.isTributing);
	const tributes = useSelector((state) => state.player.tributes);
	const canTributeSummon = useSelector((state) => state.player.canTributeSummon);
	const selectedCard = useSelector((state) => state.player.selectedCard);
	const tributePrompt = useSelector((state) => state.player.tributePrompt);
	//SPELL CAST STATES//
	const isCastingSpell = useSelector((state) => state.player.isCastingSpell);
	const spellCastCard = useSelector((state) => state.player.spellCastCard);
	const [showTraps, setShowTraps] = useState(false);

	function battleSelectHandler(e) {
		if (battlePhase) {
			let slotId = e.target.parentNode.parentNode.id;
			if (!slotId) {
				slotId = "Direct Attack";
			}
			dispatch(playerActions.battleSelect({ slotId }));
			props.onAddClickedId(slotId);
		}
	}

	function tributeSelectHandler(e) {
		console.log(e.target);
		if (canTributeSummon) {
			dispatch(playerActions.removeTributedCards());
			dispatch(playerActions.placeCard({ player: tributingPlayer, card: selectedCard }));
			dispatch(playerActions.setTributePrompt(false));
			props.onClearClickedIds();
			return;
		}
		let slotId = e.target.parentNode.parentNode.id;
		if (slotId === ("cs1" || "cs2" || "cs3")) {
			tributingPlayer = "player1";
		} else if (slotId === ("cs4" || "cs5" || "cs6")) {
			tributingPlayer = "player2";
		}
		// console.log(slotId);
		props.onAddClickedId(slotId);

		dispatch(playerActions.selectTributes({ slotId, selectedCard: selectedCard }));
	}

	function spellTargetSelectHandler(e) {
		let slotId = e.target.parentNode.parentNode.id;
		dispatch(playerActions.effectCreator({ card: spellCastCard, slotId }));
	}

	function closeTributeModal() {}

	function cancelTribute() {
		console.log("trib modal closed!!");
		dispatch(playerActions.setTributePrompt());
		dispatch(playerActions.setTributesToFalse());
		dispatch(playerActions.clearSelectedTributes());
		props.onClearClickedIds();
	}

	function showTrapCards() {
		setShowTraps(true);
		inspect = true;
		props.onCloseTrapPrompt();
	}

	function closeTrapCardDisplayHandler() {
		setShowTraps(false);
	}

	function battleHandler() {}

	useEffect(() => {
		if (player1FieldSpell.id) {
			console.log("field spell useEffect triggered");
			dispatch(playerActions.effectCreator({ card: player1FieldSpell }));
		}
		if (player2FieldSpell.id) {
			console.log("field spell useEffect triggered");
			dispatch(playerActions.effectCreator({ card: player2FieldSpell }));
		}
	}, [player1FieldSlot1, player1FieldSlot2, player1FieldSlot3, player2FieldSlot1, player2FieldSlot2, player2FieldSlot3, player1FieldSpell, player2FieldSpell, dispatch]);

	// console.log("can tribute:", canTributeSummon, "tributePrompt:", tributePrompt, "is tributing:", isTributing);
	console.log("tributes:", tributes);

	const selectHandlers = isTributing ? tributeSelectHandler : isCastingSpell ? spellTargetSelectHandler : battleSelectHandler;

	let p1BackgroundClass;
	let p2BackgroundClass;

	if (player1FieldSpell.img === "/static/media/MountainRangePortrait.70b19b781eb6167b8780.jpg") {
		p1BackgroundClass = `${classes.p1DragonBg}`;
	} else if (player1FieldSpell.img === "/static/media/landscapePortrait.6d802448a91f09c5a1bb.jpg") {
		p1BackgroundClass = `${classes.p1NatureBg}`;
	}
	if (player2FieldSpell.img === "/static/media/MountainRangePortrait.70b19b781eb6167b8780.jpg") {
		p2BackgroundClass = `${classes.p2DragonBg}`;
	} else if (player2FieldSpell.img === "/static/media/landscapePortrait.6d802448a91f09c5a1bb.jpg") {
		p2BackgroundClass = `${classes.p2NatureBg}`;
	}

	const player1SpellSlots = [player1SpellSlot1, player1SpellSlot2, player1SpellSlot3];
	const p1TrapCards = [];
	player1SpellSlots.forEach((card) => {
		if (card.id) {
			p1TrapCards.push(card);
		}
	});
	const player2SpellSlots = [player2SpellSlot1, player2SpellSlot2, player2SpellSlot3];
	const p2TrapCards = [];
	player2SpellSlots.forEach((card) => {
		if (card.id) {
			p2TrapCards.push(card);
		}
	});

	// console.log(player1SpellSlot1);

	return (
		<div className={classes.board}>
			<div className={p1BackgroundClass}></div>
			<div className={p2BackgroundClass}></div>
			<div className={classes.p1Life}>{player1Life}</div>
			<div className={classes.p2Life}>{player2Life}</div>
			<div className={classes.cardSlotContainer}>
				<CardSlot id={"cs1"} className={classes.cardSlot} onClick={selectHandlers}>
					{player1FieldSlot1Playing === true && (
						<Card name={player1FieldSlot1.name} atk={player1FieldSlot1.atk} def={player1FieldSlot1.def} src={player1FieldSlot1.img} position={player1FieldSlot1.position} type={player1FieldSlot1.type} clicked={props.isClickedIds.includes("cs1")} />
					)}
				</CardSlot>
				<CardSlot id={"cs2"} className={classes.cardSlot} onClick={selectHandlers}>
					{player1FieldSlot2Playing === true && (
						<Card name={player1FieldSlot2.name} atk={player1FieldSlot2.atk} def={player1FieldSlot2.def} src={player1FieldSlot2.img} position={player1FieldSlot2.position} type={player1FieldSlot2.type} clicked={props.isClickedIds.includes("cs2")} />
					)}
				</CardSlot>
				<CardSlot id={"cs3"} className={classes.cardSlot} onClick={selectHandlers}>
					{player1FieldSlot3Playing === true && (
						<Card name={player1FieldSlot3.name} atk={player1FieldSlot3.atk} def={player1FieldSlot3.def} src={player1FieldSlot3.img} position={player1FieldSlot3.position} type={player1FieldSlot3.type} clicked={props.isClickedIds.includes("cs3")} />
					)}
				</CardSlot>
			</div>
			<div className={classes.cardSlot2Container}>
				<CardSlot id={"cs4"} className={classes.cardSlot} onClick={selectHandlers}>
					{player2FieldSlot1Playing === true && (
						<Card name={player2FieldSlot1.name} atk={player2FieldSlot1.atk} def={player2FieldSlot1.def} src={player2FieldSlot1.img} position={player2FieldSlot1.position} type={player2FieldSlot1.type} clicked={props.isClickedIds.includes("cs4")} />
					)}
				</CardSlot>
				<CardSlot id={"cs5"} className={classes.cardSlot} onClick={selectHandlers}>
					{player2FieldSlot2Playing === true && (
						<Card name={player2FieldSlot2.name} atk={player2FieldSlot2.atk} def={player2FieldSlot2.def} src={player2FieldSlot2.img} position={player2FieldSlot2.position} type={player2FieldSlot2.type} clicked={props.isClickedIds.includes("cs5")} />
					)}
				</CardSlot>
				<CardSlot id={"cs6"} className={classes.cardSlot} onClick={selectHandlers}>
					{player2FieldSlot3Playing === true && (
						<Card name={player2FieldSlot3.name} atk={player2FieldSlot3.atk} def={player2FieldSlot3.def} src={player2FieldSlot3.img} position={player2FieldSlot3.position} type={player2FieldSlot3.type} clicked={props.isClickedIds.includes("cs6")} />
					)}
				</CardSlot>
			</div>
			<div className={classes.p1BottomContainer}>
				<CardSlot className={classes.graveyard}>{p1Graveyard.length}</CardSlot>
				<CardSlot className={classes.spellSlot}>{props.p1SpellSlotsPlaying[0] && <Card name={player1SpellSlot1.name} src={player1SpellSlot1.img} type={player1SpellSlot1.type} />}</CardSlot>
				<CardSlot className={classes.spellSlot}>{props.p1SpellSlotsPlaying[1] && <Card name={player1SpellSlot2.name} src={player1SpellSlot2.img} type={player1SpellSlot2.type} />}</CardSlot>
				<CardSlot className={classes.spellSlot}>{props.p1SpellSlotsPlaying[2] && <Card name={player1SpellSlot3.name} src={player1SpellSlot3.img} type={player1SpellSlot3.type} />}</CardSlot>
				<CardSlot onClick={props.onDrawCard} className={classes.deck}>
					{props.p1Deck.length}
				</CardSlot>
			</div>
			<div className={classes.p2BottomContainer}>
				<CardSlot className={classes.graveyard2}>{p2Graveyard.length}</CardSlot>
				<CardSlot className={classes.spellSlot}>{props.p2SpellSlot1}</CardSlot>
				<CardSlot className={classes.spellSlot}></CardSlot>
				<CardSlot className={classes.spellSlot}></CardSlot>
				<CardSlot onClick={props.onDrawCard} className={classes.deck2}>
					{props.p2Deck.length}
				</CardSlot>
			</div>
			<div>
				{turn !== 1 && battlePhase && !player2FieldSlot1Playing && !player2FieldSlot2Playing && !player2FieldSlot3Playing && (
					<button className={btnClasses.directAttackP2Btn} onClick={battleSelectHandler}>
						Direct Attack on P2
					</button>
				)}
			</div>
			<div>
				{turn !== 1 && battlePhase && !player1FieldSlot1Playing && !player1FieldSlot2Playing && !player1FieldSlot3Playing && (
					<button className={btnClasses.directAttackP1Btn} onClick={battleSelectHandler}>
						Direct Attack on P1
					</button>
				)}
			</div>
			<div className={classes.battlePhaseContainer}>
				{turn !== 1 && props.summonPhase && <CrossSwordsIcon onClick={props.onBattlePhase} className={classes.battlePhaseIcon} />}
				{turn !== 1 && props.summonPhase && <p>Battle Phase</p>}
			</div>
			<CardSlot className={classes.fieldCardSlot1}>
				{player1FieldSpellPlaying === true && <Card type={player1FieldSpell.type} name={player1FieldSpell.name} key={player1FieldSpell.id} src={player1FieldSpell.img} effect={player1FieldSpell.effect} />}
			</CardSlot>
			<CardSlot className={classes.fieldCardSlot2}>
				{player2FieldSpellPlaying === true && <Card type={player2FieldSpell.type} name={player2FieldSpell.name} key={player2FieldSpell.id} src={player2FieldSpell.img} effect={player2FieldSpell.effect} />}
			</CardSlot>
			<div className={classes.endTurnContainer}>
				<FontAwesomeIcon className={classes.endTurn} icon={faHourglassEnd} onClick={props.onEndTurn} />
				<p>End Turn</p>
			</div>
			<div className={classes.inGameMenuContainer}>
				<FontAwesomeIcon className={classes.inGameMenuIcon} icon={faBars} onClick={props.onOpenInGameMenu} />
			</div>
			{tributePrompt && <TributeDisplay onTributeSelect={tributeSelectHandler} onClose={closeTributeModal} onCancel={cancelTribute} selectedCard={selectedCard} tributes={tributes} />}
			{props.trapPrompt && (
				<Modal className="trapPrompt">
					<p>Your opponent is attacking!</p>
					<p>Would you like to activate a trap card?</p>
					<div>
						<button onClick={showTrapCards}>YES</button>
						<button onClick={battleHandler}>NO</button>
					</div>
				</Modal>
			)}
			{showTraps && <TrapCardsDisplay p1TrapCards={p1TrapCards} p2TrapCards={p2TrapCards} p1Turn={props.player1Turn} p2Turn={props.player2Turn} inspect={inspect} onAddClickedIds={props.onAddClickedId} onClose={closeTrapCardDisplayHandler} />}
		</div>
	);
};

export default Board;
