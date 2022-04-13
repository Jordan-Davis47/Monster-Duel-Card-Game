import { useEffect, useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { playerActions } from "./store/index";

import Button from "./components/UI/Button";
import Board from "./components/Board/Board";
import { dragonDeck, natureDeck } from "./components/Decks/Decks";
import Hand from "./components/Hand/Hand";
import classes from "./components/Hand/Hand.module.css";
import turnClasses from "./components/UI/Turn.module.css";
import btnClasses from "./components/UI/Button.module.css";
import PhaseHeader from "./components/UI/PhaseHeader";
import Winner from "./components/UI/Winner";
import Turn from "./components/UI/Turn";
import InGameMenu from "./components/UI/InGameMenu";
import { champChooseCard, champBattleTactic, champCheckForSpellCard } from "./AiTactics/champ";

let clickedIds = "";

function App() {
	const dispatch = useDispatch();
	//GAME TURN//
	const turn = useSelector((state) => state.player.turn);
	//PLAYERS LIFE POINTS//
	const player1Life = useSelector((state) => state.player.player1Life);
	const player2Life = useSelector((state) => state.player.player2Life);
	//Player deck/hand states//
	const player1Deck = useSelector((state) => state.player.player1Deck);
	const player2Deck = useSelector((state) => state.player.player2Deck);
	const player1Hand = useSelector((state) => state.player.player1Hand);
	const player2Hand = useSelector((state) => state.player.player2Hand);
	//PLAYER FIELD SLOTS /STATES//
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
	const player1FieldSlots = [
		[player1FieldSlot1, "cs1"],
		[player1FieldSlot2, "cs2"],
		[player1FieldSlot3, "cs3"],
	];
	const player2FieldSlots = [
		[player2FieldSlot1, "cs4"],
		[player2FieldSlot2, "cs5"],
		[player2FieldSlot3, "cs6"],
	];
	//player trap card playing states//
	const player1SpellSlot1Playing = useSelector((state) => state.player.player1SpellSlot1Playing);
	const player1SpellSlot2Playing = useSelector((state) => state.player.player1SpellSlot2Playing);
	const player1SpellSlot3Playing = useSelector((state) => state.player.player1SpellSlot3Playing);
	const player2SpellSlot1Playing = useSelector((state) => state.player.player2SpellSlot1Playing);
	const player2SpellSlot2Playing = useSelector((state) => state.player.player2SpellSlot2Playing);
	const player2SpellSlot3Playing = useSelector((state) => state.player.player2SpellSlot3Playing);

	//player turn states//
	const player1Turn = useSelector((state) => state.player.player1Turn);
	const player2Turn = useSelector((state) => state.player.player2Turn);
	const attacker = useSelector((state) => state.player.attacker);
	const defender = useSelector((state) => state.player.defender);
	//game phase states//
	const battlePhase = useSelector((state) => state.player.battlePhase);
	const drawPhase = useSelector((state) => state.player.drawPhase);
	const summonPhase = useSelector((state) => state.player.summonPhase);
	const winner = useSelector((state) => state.player.winner);
	//card select highlight handler//
	const [isClickedIds, setIsClickedIds] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);
	const [trapMenuIsOpen, setTrapMenuIsOpen] = useState(false);
	const [AiPlaying, setAiPlaying] = useState(true);
	const [battleReady, setBattleReady] = useState(false);

	let winningPlayer;

	function pickDeckHandler() {
		dispatch(playerActions.setPlayerDeck({ player: "player1", deck: dragonDeck }));
		dispatch(playerActions.setPlayerDeck({ player: "player2", deck: natureDeck }));
	}

	//draw 4 card hand from deck//
	function PlayerDrawHandHandler() {
		dispatch(playerActions.playersDrawHand());
		dispatch(playerActions.setPlayerTurn("player1"));
	}

	function aiTurn() {
		dispatch(playerActions.endTurn());
		dispatch(playerActions.drawCard());
		// const cardToPlay = player2Hand.find((card) => card.atk > 1000);
		// dispatch(playerActions.placeCard({ card: cardToPlay, player: "player2" }));
		// let battleOptions = [];
		// player2FieldSlots.forEach((array) => {
		// 	array[1] === true ? battleOptions.push(array[0]) : battleOptions.push();
		// });

		// battleOptions.reduce((intitalValue, currentValue)  {
		// 	intitalValue > currentValue
		// })

		return;
	}

	function endTurnHandler() {
		dispatch(playerActions.endTurn());
		setIsClickedIds("");
		if (menuOpen) {
			setMenuOpen(false);
		}
		if (AiPlaying) {
			dispatch(playerActions.drawCard());
			const card = champChooseCard(player2Hand, player2FieldSlots);
			console.log("card:", card);
			let tribute = [];

			if (card) {
				if (card.tributesRequired) {
					console.log("TRIBUTES REQUIRED CHECK");
					dispatch(playerActions.setIsTributing(true));
					if (card.tributesRequired === 2) {
						console.log("2 tribute CHECK");
						if (player2FieldSlot1Playing && player2FieldSlot1.tributesRequired !== 2) {
							if (tribute.length !== 2) {
								tribute.push(player2FieldSlot1);
								dispatch(playerActions.removeCard("cs4"));
							}
						}
						if (player2FieldSlot2Playing && player2FieldSlot2.tributesRequired !== 2) {
							if (tribute.length !== 2) {
								tribute.push(player2FieldSlot2);
								dispatch(playerActions.removeCard("cs5"));
							}
						}
						if (player2FieldSlot3Playing && player2FieldSlot3.tributesRequired !== 2) {
							if (tribute.length !== 2) {
								tribute.push(player2FieldSlot3);
								dispatch(playerActions.removeCard("cs6"));
							}
						}
					}
					if (card.tributesRequired < 2) {
						console.log("1 TRIBUTE CHECK");
						if (player2FieldSlot1Playing && !player2FieldSlot1.tributesRequired) {
							tribute = player2FieldSlot1;
							dispatch(playerActions.removeCard("cs4"));
						} else if (player2FieldSlot2Playing && !player2FieldSlot2.tributesRequired) {
							tribute = player2FieldSlot2;
							dispatch(playerActions.removeCard("cs5"));
						} else if (player2FieldSlot3Playing && !player2FieldSlot3.tributesRequired) {
							tribute = player2FieldSlot3;
							dispatch(playerActions.removeCard("cs6"));
						}
					}
					console.log(tribute);
					dispatch(playerActions.setTributes(tribute));
					tribute = [];
				}
				dispatch(playerActions.placeCard({ card: card, player: "player2" }));
				dispatch(playerActions.clearSelectedTributes());
			}

			const spellCard = champCheckForSpellCard(player2Hand);
			console.log("spell card:", spellCard);
			if (spellCard) {
				console.log("effect creator reached");
				dispatch(playerActions.effectCreator({ card: spellCard }));
				dispatch(playerActions.setSpellCastCard({ card: spellCard }));
			}

			battlePhaseHandler();
			const targets = champBattleTactic(player2FieldSlots, player1FieldSlots);
			console.log("targets:", targets);
			if (targets) {
				if (targets[0].length) {
					dispatch(playerActions.setAttackerDefender({ attacker: player2FieldSlot1, atkId: "cs4", defender: targets[0][0], defId: targets[0][1] }));
					// dispatch(playerActions.battleCalculation());
					// dispatch(playerActions.battleSelect({ slotId: "cs4" }));
					// dispatch(playerActions.battleSelect({ slotId: targets[0][1] }));
					// setBattleReady(true);

					console.log("target found1");
				}
				if (targets[1].length) {
					dispatch(playerActions.setAttackerDefender({ attacker: player2FieldSlot2, atkId: "cs5", defender: targets[1][0], defId: targets[1][1] }));
					// dispatch(playerActions.battleCalculation());
					// dispatch(playerActions.battleSelect({ slotId: "cs5" }));
					// dispatch(playerActions.battleSelect({ slotId: targets[1][1] }));
					// setBattleReady(true);

					console.log("target found2");
				}
				if (targets[2].length) {
					dispatch(playerActions.setAttackerDefender({ attacker: player2FieldSlot1, atkId: "cs6", defender: targets[2][0], defId: targets[2][1] }));
					// dispatch(playerActions.battleCalculation());
					// dispatch(playerActions.battleSelect({ slotId: "cs6" }));
					// dispatch(playerActions.battleSelect({ slotId: targets[2][1] }));
					// setBattleReady(true);
					console.log("target found3");
				}
				setTimeout(() => {
					dispatch(playerActions.endTurn());
				}, 500);
				return;
			}
		}

		// dispatch(playerActions.endTurn());
	}

	function drawCardHandler() {
		dispatch(playerActions.drawCard());
	}

	function battlePhaseHandler() {
		dispatch(playerActions.setBattlephase(true));
		dispatch(playerActions.setSummonPhase(false));
		if (menuOpen) {
			setMenuOpen(false);
		}
	}

	useEffect(() => {
		console.log("useEffect fired");
		console.log(attacker.length, defender.length);

		if (attacker.length && defender.length) {
			if (player1Turn && (player2SpellSlot1Playing || player2SpellSlot2Playing || player2SpellSlot3Playing)) {
				console.log("trap menu is open set 1");
				setTrapMenuIsOpen(true);
				return;
			} else if (player2Turn && (player1SpellSlot1Playing || player1SpellSlot2Playing || player1SpellSlot3Playing)) {
				console.log("trap menu is open set 2");
				setTrapMenuIsOpen(true);
				return;
			}
			// setTrapMenuIsOpen(dispatch(playerActions.checkForTraps()));
			console.log("useEffect fired2");

			dispatch(playerActions.battleCalculation());
			setIsClickedIds("");
			// dispatch(playerActions.endTurn());
			setBattleReady(false);
		}
	}, [attacker, defender, dispatch, player1Turn, player2Turn, player1SpellSlot1Playing, player1SpellSlot2Playing, player1SpellSlot3Playing, player2SpellSlot1Playing, player2SpellSlot2Playing, player2SpellSlot3Playing, battleReady]);

	if (player1Life <= 0) {
		selectWinnerHandler("p2");
	} else if (player2Life <= 0) {
		selectWinnerHandler("p1");
	}

	function selectWinnerHandler(winner) {
		winner === "p1" ? (winningPlayer = "p1") : (winningPlayer = "p2");
		dispatch(playerActions.setWinner());
		console.log("WINNNNNNERERRERERER");
	}

	function openInGameMenu() {
		setMenuOpen(true);
	}

	function closeInGameMenu() {
		setMenuOpen(false);
		// console.log("closed");
	}

	function addClickedId(slotId) {
		clickedIds = "";
		setIsClickedIds("");
		if (slotId === "cs1" && player1Turn) {
			clickedIds += "cs1";
			setIsClickedIds(clickedIds);
		} else if (slotId === "cs2" && player1Turn) {
			clickedIds += "cs2";
			setIsClickedIds(clickedIds);
		} else if (slotId === "cs3" && player1Turn) {
			clickedIds += "cs3";
			setIsClickedIds(clickedIds);
		} else if (slotId === "cs4" && player2Turn) {
			clickedIds += "cs4";
			setIsClickedIds(clickedIds);
		} else if (slotId === "cs5" && player2Turn) {
			clickedIds += "cs5";
			setIsClickedIds(clickedIds);
		} else if (slotId === "cs6" && player2Turn) {
			clickedIds += "cs6";
			setIsClickedIds(clickedIds);
		}
		console.log(clickedIds);
		console.log(isClickedIds);
	}

	function clearClickedIds() {
		setIsClickedIds("");
	}

	function trapPromptCloseHandler() {
		setTrapMenuIsOpen(false);
	}

	// console.log(winningPlayer);

	console.log("atker:", attacker, "defender:", defender);
	console.log("p1Turn:", player1Turn, "p2Turn:", player2Turn, "summonPhase:", summonPhase, "drawPhase:", drawPhase, "battlePhase:", battlePhase);
	const player1SpellSlotsPlaying = [player1SpellSlot1Playing, player1SpellSlot2Playing, player1SpellSlot3Playing];
	const player2SpellSlotsPlaying = [player2SpellSlot1Playing, player2SpellSlot2Playing, player2SpellSlot3Playing];

	return (
		<Fragment>
			{winner && <Winner winner={winningPlayer} />}
			<Turn turn={turn} className={turnClasses.turnCount} />
			<PhaseHeader drawPhase={drawPhase} summonPhase={summonPhase} battlePhase={battlePhase} />
			<Board
				onDrawCard={drawCardHandler}
				summonPhase={summonPhase}
				battlePhase={battlePhase}
				onBattlePhase={battlePhaseHandler}
				p1Deck={player1Deck}
				p2Deck={player2Deck}
				onEndTurn={endTurnHandler}
				onWinner={selectWinnerHandler}
				isClickedIds={isClickedIds}
				onAddClickedId={addClickedId}
				onClearClickedIds={clearClickedIds}
				onOpenInGameMenu={openInGameMenu}
				onCloseTrapPrompt={trapPromptCloseHandler}
				trapPrompt={trapMenuIsOpen}
				p1SpellSlotsPlaying={player1SpellSlotsPlaying}
				p2SpellSlotsPlaying={player2SpellSlotsPlaying}
				p1Turn={player1Turn}
				p2Turn={player2Turn}
			/>
			<Button className={btnClasses.button} onClick={pickDeckHandler}>
				Pick Deck
			</Button>
			<Button className={btnClasses.button} onClick={PlayerDrawHandHandler}>
				Draw Hand
			</Button>

			<Hand id={"p1"} turn={player1Turn} className={classes.hand1} p1Turn={player1Turn} p2Turn={player2Turn} summonPhase={summonPhase} hand={player1Hand} />
			<Hand id={"p2"} turn={player2Turn} className={classes.hand2} p1Turn={player1Turn} p2Turn={player2Turn} summonPhase={summonPhase} hand={player2Hand} />
			{menuOpen && <InGameMenu onBattlePhase={battlePhaseHandler} onEndTurn={endTurnHandler} onCloseMenu={closeInGameMenu} battlePhase={battlePhase} drawPhase={drawPhase} summonPhase={summonPhase} turn={turn} />}
		</Fragment>
	);
}

export default App;
