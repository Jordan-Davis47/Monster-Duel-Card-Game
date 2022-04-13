import { createSlice, configureStore } from "@reduxjs/toolkit";
import { champChooseCard } from "../AiTactics/champ";

//HELPER FUNCTIONS//

const playerInitialState = {
	//GAME TURNS//
	turn: 0,
	//A PLAYER HAS WON//
	winner: false,
	//PLAYER TURNS//
	player1Turn: false,
	player2Turn: false,
	//PLAYER LIFE POINTS//
	player1Life: 2000,
	player2Life: 2000,
	//PLAYER HANDS/DECKS/GRAVEYARDS//
	player1Hand: [],
	player1Deck: [],
	player2Hand: [],
	player2Deck: [],
	player1Graveyard: [],
	player2Graveyard: [],
	//GAME PHASES//
	drawPhase: false,
	summonPhase: false,
	battlePhase: false,
	hasSummoned: false,
	hasAttacked: false,
	effectPrompt: false,
	//FIELD CARD SLOTS / PLAY STATE//
	player1FieldSlot1: [],
	player1FieldSlot1Playing: false,
	player1FieldSlot2: [],
	player1FieldSlot2Playing: false,
	player1FieldSlot3: [],
	player1FieldSlot3Playing: false,
	player2FieldSlot1: [],
	player2FieldSlot1Playing: false,
	player2FieldSlot2: [],
	player2FieldSlot2Playing: false,
	player2FieldSlot3: [],
	player2FieldSlot3Playing: false,
	//SPELL/TRAP CARD SLOTS / PLAY STATE//
	player1SpellSlot1: [],
	player1SpellSlot1Playing: false,
	player1SpellSlot2: [],
	player1SpellSlot2Playing: false,
	player1SpellSlot3: [],
	player1SpellSlot3Playing: false,
	player2SpellSlot1: [],
	player2SpellSlot1Playing: false,
	player2SpellSlot2: [],
	player2SpellSlot2Playing: false,
	player2SpellSlot3: [],
	player2SpellSlot3Playing: false,
	//FIELD SPELL CARD SLOTS/PLAYING STATES//
	player1FieldSpell: [],
	player1FieldSpellPlaying: false,
	player2FieldSpell: [],
	player2FieldSpellPlaying: false,
	//BATTLE SLOTS//
	attacker: [],
	defender: [],
	//TRIBUTING STATES//
	tributes: [],
	isTributing: false,
	tributePrompt: false, //BOOLEAN FLAG FOR TRIBUTE SUMMON BUTTON//
	canTributeSummon: false,
	selectedCard: [], //SELECTED CARD FOR TRIBUTE SUMMON//
	//SPELL CARD STATES//
	spellCastCard: [],
	spellTarget: [],
	isCastingSpell: false,
	AiPlaying: true,
};

const playerSlice = createSlice({
	name: "player",
	initialState: playerInitialState,
	reducers: {
		playersDrawHand(state, action) {
			for (let i = 0; i < 4; i++) {
				let p1Card = state.player1Deck.shift();
				state.player1Hand.push(p1Card);
				let p2Card = state.player2Deck.shift();
				state.player2Hand.push(p2Card);
			}
			state.turn = state.turn + 1;
		},

		setPlayerDeck(state, action) {
			//shuffle deck//
			// for (let i = 0; i < action.payload.deck.length; i++) {
			// 	let randomNum = Math.floor(Math.random() * action.payload.deck.length);
			// 	[action.payload.deck[i], action.payload.deck[randomNum]] = [action.payload.deck[randomNum], action.payload.deck[i]];
			// }
			//set deck based on player//
			if (action.payload.player === "player1") {
				state.player1Deck = action.payload.deck;
			} else if (action.payload.player === "player2") {
				state.player2Deck = action.payload.deck;
			}
		},
		setPlayerLife() {},
		//DRAW ONE CARD TO HAND AT START OF TURN//
		drawCard(state, action) {
			if (state.player1Turn && state.drawPhase) {
				if (!state.player1Deck.length) {
					alert("no more cards");
					state.summonPhase = true;
					return;
				}
				const card = state.player1Deck.shift();
				state.player1Hand.push(card);
				state.drawPhase = false;
				state.summonPhase = true;
			}
			if (state.player2Turn && state.drawPhase) {
				if (!state.player2Deck.length) {
					alert("no more cards");
					state.summonPhase = true;
					return;
				}
				const card = state.player2Deck.shift();
				state.player2Hand.push(card);
				state.drawPhase = false;
				state.summonPhase = true;
			}
		},

		effectCreator(state, action) {
			console.log("effect creator triggered");
			//HEAL LIFE POINTS SPELL HANDLER//
			if (action.payload.card.effect.type === "Heal") {
				console.log("firat heal check");
				if (action.payload.card.owner === "p1") {
					state.player1Life = state.player1Life + action.payload.card.effect.amount;
				} else if (action.payload.card.owner === "p2") {
					console.log("heal check");
					state.player2Life = state.player2Life + action.payload.card.effect.amount;
				}
			}
			//DAMAGE LIFE POINTS SPELL HANDLER//
			if (action.payload.card.effect.type === "Damage") {
				if (action.payload.card.owner === "p1") {
					console.log(action.payload.card);
					state.player2Life = state.player2Life - action.payload.card.effect.amount;
				} else if (action.payload.card.owner === "p2") {
					state.player1Life = state.player1Life - action.payload.card.effect.amount;
				}
			}
			//DESTROY SPELL LOGIC HANDLER //
			if (action.payload.card.effect.type === "Destroy") {
				if (action.payload.card.effect.condition) {
					//RANDOM CARD DESTRUCTION SPELL HANDLER//
					if (action.payload.card.effect.condition === "random") {
						let multiplier = 0;

						if (action.payload.card.owner === "p1") {
							if (state.player2FieldSlot1Playing) {
								multiplier++;
							}
							if (state.player2FieldSlot2Playing) {
								multiplier++;
							}
							if (state.player2FieldSlot3Playing) {
								multiplier++;
							}

							const randNum = Math.floor(Math.random() * multiplier + 1);
							console.log("random number:", randNum);

							switch (randNum) {
								case 1:
									state.player2Graveyard.push(state.player2FieldSlot1.card);
									state.player2FieldSlot1 = [];
									state.player2FieldSlot1Playing = false;
									break;
								case 2:
									state.player2Graveyard.push(state.player2FieldSlot2.card);
									state.player2FieldSlot2 = [];
									state.player2FieldSlot2Playing = false;
									break;
								case 3:
									state.player2Graveyard.push(state.player2FieldSlot3.card);
									state.player2FieldSlot3 = [];
									state.player2FieldSlot3Playing = false;
									break;
								default:
							}
						}
						if (action.payload.card.owner === "p2") {
							if (state.player1FieldSlot1Playing) {
								multiplier++;
							}
							if (state.player1FieldSlot2Playing) {
								multiplier++;
							}
							if (state.player1FieldSlot3Playing) {
								multiplier++;
							}
							const randNum = Math.floor(Math.random() * multiplier + 1);

							switch (randNum) {
								case 1:
									state.player1Graveyard.push(state.player1FieldSlot1.card);
									state.player1FieldSlot1 = [];
									state.player1FieldSlot1Playing = false;
									break;
								case 2:
									state.player1Graveyard.push(state.player1FieldSlot2.card);
									state.player1FieldSlot2 = [];
									state.player1FieldSlot2Playing = false;
									break;
								case 3:
									state.player1Graveyard.push(state.player1FieldSlot3.card);
									state.player1FieldSlot3 = [];
									state.player1FieldSlot3Playing = false;
									break;
								default:
							}
						}
					}
					//STAT IS LESS THAN OR EQUAL DESTROY HANDLER//
					if (action.payload.card.effect.condition === "less than or equal") {
						console.log("check1");
						if (state.attacker[0].atk <= action.payload.card.effect.amount) {
							console.log("check2");
							if (action.payload.card.owner === "p1") {
								state.player2Graveyard.push(state.attacker[0]);
								console.log("check3");
								if (state.attacker[1] === "cs4") {
									state.player2FieldSlot1 = [];
									state.player2FieldSlot1Playing = false;
								} else if (state.attacker[1] === "cs5") {
									state.player2FieldSlot2 = [];
									state.player2FieldSlot2Playing = false;
								} else if (state.attacker[1] === "cs6") {
									state.player2FieldSlot3 = [];
									state.player2FieldSlot3Playing = false;
								}
							}
							if (action.payload.card.owner === "p2") {
								state.player1Graveyard.push(state.attacker[0]);
								console.log("check3");
								if (state.attacker[1] === "cs1") {
									state.player1FieldSlot1 = [];
									state.player1FieldSlot1Playing = false;
								} else if (state.attacker[1] === "cs2") {
									state.player1FieldSlot2 = [];
									state.player1FieldSlot2Playing = false;
								} else if (state.attacker[1] === "cs3") {
									state.player1FieldSlot3 = [];
									state.player1FieldSlot3Playing = false;
								}
							}
							state.attacker = [];
						}
					}
				}
			}

			if (action.payload.card.effect.type === "Increase") {
				// const stat = state.spellCastCard.effect.stat === "atk" ? "atk" : "def";
				if (state.isCastingSpell) {
					if (action.payload.slotId === "cs1") {
						const changedCard = { ...state.player1FieldSlot1, atk: state.player1FieldSlot1.atk + state.spellCastCard.effect.amount };
						state.player1FieldSlot1 = changedCard;
						state.isCastingSpell = false;
					} else if (action.payload.slotId === "cs2") {
						const changedCard = { ...state.player1FieldSlot2, atk: state.player1FieldSlot2.atk + state.spellCastCard.effect.amount };
						state.player1FieldSlot2 = changedCard;
						state.isCastingSpell = false;
					} else if (action.payload.slotId === "cs3") {
						const changedCard = { ...state.player1FieldSlot3, atk: state.player1FieldSlot3.atk + state.spellCastCard.effect.amount };
						state.player1FieldSlot3 = changedCard;
						state.isCastingSpell = false;
					} else if (action.payload.slotId === "cs4") {
						const changedCard = { ...state.player2FieldSlot1, atk: state.player2FieldSlot1.atk + state.spellCastCard.effect.amount };
						state.player2FieldSlot1 = changedCard;
						state.isCastingSpell = false;
					} else if (action.payload.slotId === "cs5") {
						const changedCard = { ...state.player2FieldSlot2, atk: state.player2FieldSlot2.atk + state.spellCastCard.effect.amount };
						state.player2FieldSlot2 = changedCard;
						state.isCastingSpell = false;
					} else if (action.payload.slotId === "cs6") {
						const changedCard = { ...state.player2FieldSlot3, atk: state.player2FieldSlot3.atk + state.spellCastCard.effect.amount };
						state.player2FieldSlot3 = changedCard;
						state.isCastingSpell = false;
					}
					if (action.payload.slotId === ("cs1" || "cs2" || "cs3")) {
						const usedCard = state.player1Hand.find((card) => card.id === action.payload.card.id);
						state.player1Graveyard.push(usedCard);
						state.player1Hand = state.player1Hand.filter((card) => card.id !== action.payload.card.id);
						return;
					} else if (action.payload.slotId === ("cs4" || "cs5" || "cs6")) {
						const usedCard = state.player1Hand.find((card) => card.id === action.payload.card.id);
						state.player1Graveyard.push(usedCard);
						state.player1Hand = state.player1Hand.filter((card) => card.id !== action.payload.card.id);
						return;
					}
				}
				state.isCastingSpell = true;
			}
			//****FIELD SPELL STAT BUFF LOGIC - BUFF EVERY CARD ON PLAYER FIELD ONCE EACH TIME A NEW CARD IS SUMMONED ONTO FIELD****/
			if (action.payload.card.effect.type === "Field Spell") {
				if (action.payload.card.owner === "p1") {
					if (!state.player1FieldSpell.length) {
						state.player1FieldSpell = action.payload.card;
						state.player1FieldSpellPlaying = true;
					}
					if (!state.player1FieldSlot1.fieldSpellBuffed && state.player1FieldSlot1Playing) {
						console.log("field spell activated!!");
						if (action.payload.card.effect.stat === "def") {
							const changedCard = { ...state.player1FieldSlot1, def: state.player1FieldSlot1.def + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player1FieldSlot1 = changedCard;
						}
						if (action.payload.card.effect.stat === "atk") {
							const changedCard = { ...state.player1FieldSlot1, atk: state.player1FieldSlot1.atk + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player1FieldSlot1 = changedCard;
						}
					}
					if (!state.player1FieldSlot2.fieldSpellBuffed && state.player1FieldSlot2Playing) {
						if (action.payload.card.effect.stat === "def") {
							console.log("field spell activated!!");
							const changedCard = { ...state.player1FieldSlot2, def: state.player1FieldSlot2.def + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player1FieldSlot2 = changedCard;
						}
						if (action.payload.card.effect.stat === "atk") {
							const changedCard = { ...state.player1FieldSlot2, atk: state.player1FieldSlot2.atk + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player1FieldSlot2 = changedCard;
						}
					}
					if (!state.player1FieldSlot3.fieldSpellBuffed && state.player1FieldSlot3Playing) {
						console.log("field spell activated!!");
						if (action.payload.card.effect.stat === "def") {
							const changedCard = { ...state.player1FieldSlot3, def: state.player1FieldSlot3.def + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player1FieldSlot3 = changedCard;
						}
						if (action.payload.card.effect.stat === "atk") {
							const changedCard = { ...state.player1FieldSlot3, atk: state.player1FieldSlot3.atk + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player1FieldSlot3 = changedCard;
						}
					}
				}
				if (action.payload.card.owner === "p2") {
					if (!state.player2FieldSpell.length) {
						state.player2FieldSpell = action.payload.card;
						state.player2FieldSpellPlaying = true;
					}
					if (!state.player2FieldSlot1.fieldSpellBuffed && state.player2FieldSlot1Playing) {
						console.log("field spell activated!!");
						if (action.payload.card.effect.stat === "def") {
							const changedCard = { ...state.player2FieldSlot1, def: state.player2FieldSlot1.def + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player2FieldSlot1 = changedCard;
						}
						if (action.payload.card.effect.stat === "atk") {
							const changedCard = { ...state.player2FieldSlot1, atk: state.player2FieldSlot1.atk + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player2FieldSlot1 = changedCard;
						}
					}
					if (!state.player2FieldSlot2.fieldSpellBuffed && state.player2FieldSlot2Playing) {
						if (action.payload.card.effect.stat === "def") {
							const changedCard = { ...state.player2FieldSlot2, def: state.player2FieldSlot2.def + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player2FieldSlot2 = changedCard;
						}
						if (action.payload.card.effect.stat === "atk") {
							const changedCard = { ...state.player2FieldSlot2, atk: state.player2FieldSlot2.atk + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player2FieldSlot2 = changedCard;
						}
					}
					if (!state.player2FieldSlot3.fieldSpellBuffed && state.player2FieldSlot3Playing) {
						if (action.payload.card.effect.stat === "def") {
							const changedCard = { ...state.player2FieldSlot3, def: state.player2FieldSlot3.def + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player2FieldSlot3 = changedCard;
						}
						if (action.payload.card.effect.stat === "atk") {
							const changedCard = { ...state.player2FieldSlot3, atk: state.player2FieldSlot3.atk + action.payload.card.effect.amount, fieldSpellBuffed: true };
							state.player2FieldSlot3 = changedCard;
						}
					}
				}
			}
			//****FIND USED CARD AND REMOVE FROM HAND AND INTO GRAVEYARD****//
			if (action.payload.card.owner === "p1" && action.payload.card.type !== "trap") {
				const usedCard = state.player1Hand.find((card) => card.id === action.payload.card.id);
				state.player1Graveyard.push(usedCard);
				state.player1Hand = state.player1Hand.filter((card) => card.id !== action.payload.card.id);
			} else if (action.payload.card.owner === "p2" && action.payload.card.type !== "trap") {
				const usedCard = state.player2Hand.find((card) => card.id === action.payload.card.id);
				state.player2Graveyard.push(usedCard);
				state.player2Hand = state.player2Hand.filter((card) => card.id !== action.payload.card.id);
			} else if (action.payload.card.owner === "p1" && action.payload.card.type === "trap") {
				console.log("last trap check");
				let traps = [state.player1SpellSlot1, state.player1SpellSlot2, state.player1SpellSlot3];
				const usedCard = traps.find((card) => card.id === action.payload.card.id);
				state.player1Graveyard.push(usedCard);
				const cardIndex = traps.findIndex((card) => card.id === usedCard.id);
				if (cardIndex === 0) {
					state.player1SpellSlot1 = [];
					state.player1SpellSlot1Playing = false;
				} else if (cardIndex === 1) {
					state.player1SpellSlot2 = [];
					state.player1SpellSlot2Playing = false;
				} else if (cardIndex === 2) {
					state.player1SpellSlot3 = [];
					state.player1SpellSlot3Playing = false;
				}
			} else if (action.payload.card.owner === "p2" && action.payload.card.type === "trap") {
				console.log("last trap check");
				let traps = [state.player2SpellSlot1, state.player2SpellSlot2, state.player2SpellSlot3];
				const usedCard = traps.find((card) => card.id === action.payload.card.id);
				state.player2Graveyard.push(usedCard);
				const cardIndex = traps.findIndex((card) => card.id === usedCard.id);
				if (cardIndex === 0) {
					state.player2SpellSlot1 = [];
					state.player2SpellSlot1Playing = false;
				} else if (cardIndex === 1) {
					state.player2SpellSlot2 = [];
					state.player2SpellSlot2Playing = false;
				} else if (cardIndex === 2) {
					state.player2SpellSlot3 = [];
					state.player2SpellSlot3Playing = false;
				}
			}
		},
		//SETS CURRENTLY USED SPELL CARD FOR REFERENCE//
		setSpellCastCard(state, action) {
			state.spellCastCard = action.payload.card;
		},

		//LOGIC FOR SUMMONING CARD ONTO FIELD///
		placeCard(state, action) {
			if (!action.payload.card) {
				return;
			}
			// console.log("placeCardCheck!", action.payload.card);
			if (action.payload.player === "player1") {
				if (action.payload.card.type === "trap") {
					console.log("trap card check!!");
					if (!state.player1SpellSlot1Playing) {
						console.log("slot1 check");
						state.player1SpellSlot1 = action.payload.card;
						state.player1SpellSlot1Playing = true;
					} else if (!state.player1SpellSlot2Playing) {
						console.log("slot2 check");
						state.player1SpellSlot2 = action.payload.card;
						state.player1SpellSlot2Playing = true;
					} else if (!state.player1SpellSlot3Playing) {
						console.log("slot3 check");
						state.player1SpellSlot3 = action.payload.card;
						state.player1SpellSlot3Playing = true;
					}
					state.player1Hand = state.player1Hand.filter((card) => card.id !== action.payload.card.id);
					return;
				}

				if (!state.player1FieldSlot1Playing && !state.hasSummoned) {
					state.player1FieldSlot1 = action.payload.card;
					state.player1FieldSlot1Playing = true;
					state.hasSummoned = true;
					// state.player1Hand = state.player1Hand.filter((card) => card.id !== action.payload.card.id);
					if (state.player1FieldSlot1.effect) {
						console.log(state.player1FieldSlot1.effect.name, state.player1FieldSlot1.effect.type, state.player1FieldSlot1.effect.amount);
						state.effectPrompt = true;
					}
				} else if (!state.player1FieldSlot2Playing && !state.hasSummoned) {
					state.player1FieldSlot2 = action.payload.card;
					state.player1FieldSlot2Playing = true;
					state.hasSummoned = true;
					// state.player1Hand = state.player1Hand.filter((card) => card.id !== action.payload.card.id);
				} else if (!state.player1FieldSlot3Playing && !state.hasSummoned) {
					state.player1FieldSlot3 = action.payload.card;
					state.player1FieldSlot3Playing = true;
					state.hasSummoned = true;
					// state.player1Hand = state.player1Hand.filter((card) => card.id !== action.payload.card.id);
				} else {
					alert("cant place more cards");
				}
				state.player1Hand = state.player1Hand.filter((card) => card.id !== action.payload.card.id);
			} else if (action.payload.player === "player2") {
				if (!state.player2FieldSlot1Playing && !state.hasSummoned) {
					state.player2FieldSlot1 = action.payload.card;
					state.player2FieldSlot1Playing = true;
					state.hasSummoned = true;
					state.player2Hand = state.player2Hand.filter((card) => card.id !== action.payload.card.id);
				} else if (!state.player2FieldSlot2Playing && !state.hasSummoned) {
					state.player2FieldSlot2 = action.payload.card;
					state.player2FieldSlot2Playing = true;
					state.hasSummoned = true;
					state.player2Hand = state.player2Hand.filter((card) => card.id !== action.payload.card.id);
				} else if (!state.player2FieldSlot3Playing && !state.hasSummoned) {
					state.player2FieldSlot3 = action.payload.card;
					state.player2FieldSlot3Playing = true;
					state.hasSummoned = true;
					state.player2Hand = state.player2Hand.filter((card) => card.id !== action.payload.card.id);
				} else {
					// alert("cant place more cards");
				}
			}
			console.log(state.player2FieldSlot2, state.player2FieldSlot2Playing);
		},
		//SETS ATTACKING AND DEFENDING CARDS WHEN CHOSEN ON BOARD//
		battleSelect(state, action) {
			if (state.attacker.length && !state.defender.length) {
				//DIRECT ATTACK SETTER LOGIC - SETS DEFENDER SO LIFE POINTS CAN BE DIRECTLY ATTACKED//
				if (action.payload.slotId === "Direct Attack") {
					state.defender = ["Direct Attack"];
					console.log("direct attck selcted!");
				}
				//NON DIRECT ATTACK DEFENDER SELECTOR LOGIC//
				console.log("set defender check");

				if (action.payload.slotId === "cs1") {
					state.defender = [state.player1FieldSlot1, action.payload.slotId];
				} else if (action.payload.slotId === "cs2") {
					state.defender = [state.player1FieldSlot2, action.payload.slotId];
				} else if (action.payload.slotId === "cs3") {
					state.defender = [state.player1FieldSlot3, action.payload.slotId];
				} else if (action.payload.slotId === "cs4") {
					state.defender = [state.player2FieldSlot1, action.payload.slotId];
				} else if (action.payload.slotId === "cs5") {
					state.defender = [state.player2FieldSlot2, action.payload.slotId];
				} else if (action.payload.slotId === "cs6") {
					state.defender = [state.player2FieldSlot3, action.payload.slotId];
				}
			}
			if (!state.attacker.length) console.log("set Attacker check");
			if (action.payload.slotId === "cs1" && !state.player1FieldSlot1.hasAttacked && state.player1Turn && state.player1FieldSlot1.position !== "def") {
				state.attacker = [{ ...state.player1FieldSlot1, owner: "p1" }, action.payload.slotId];
			} else if (action.payload.slotId === "cs2" && !state.player1FieldSlot2.hasAttacked && state.player1Turn && state.player1FieldSlot2.position !== "def") {
				state.attacker = [{ ...state.player1FieldSlot2, owner: "p1" }, action.payload.slotId];
			} else if (action.payload.slotId === "cs3" && !state.player1FieldSlot3.hasAttacked && state.player1Turn && state.player1FieldSlot3.position !== "def") {
				state.attacker = [{ ...state.player1FieldSlot3, owner: "p1" }, action.payload.slotId];
			} else if (action.payload.slotId === "cs4" && !state.player2FieldSlot1.hasAttacked && state.player2Turn && state.player2FieldSlot1.position !== "def") {
				state.attacker = [{ ...state.player2FieldSlot1, owner: "p2" }, action.payload.slotId];
			} else if (action.payload.slotId === "cs5" && !state.player2FieldSlot2.hasAttacked && state.player2Turn && state.player2FieldSlot2.position !== "def") {
				state.attacker = [{ ...state.player2FieldSlot2, owner: "p2" }, action.payload.slotId];
			} else if (action.payload.slotId === "cs6" && !state.player2FieldSlot3.hasAttacked && state.player2Turn && state.player2FieldSlot3.position !== "def") {
				state.attacker = [{ ...state.player2FieldSlot3, owner: "p2" }, action.payload.slotId];
			}
		},

		//CALCULATES DAMAGE FROM BATTLE (ATTACKER AND DEFENDER) AND SETS PLAYER LIFE//
		battleCalculation(state, action) {
			console.log("BATTLE CALCULATION CHECK!");
			if (!state.attacker.length || !state.defender.length) {
				console.log("battle CANCELLED");
				return;
			}

			if (state.defender[0] === "Direct Attack") {
				if (state.attacker[0].owner === "p1") {
					state.player2Life = state.player2Life - state.attacker[0].atk;
					console.log("direct attack hit confirmed!!!");
				} else if (state.attacker[0].owner === "p2") {
					state.player1Life = state.player1Life - state.attacker[0].atk;
					console.log("direct attack hit confirmed!!!");
				}
			}
			//ATTACKER HAS MORE ATK THAN DEFENDERS ATK//
			if (state.attacker[0].atk > state.defender[0].atk && state.defender[0].position === "atk") {
				const dmg = state.attacker[0].atk - state.defender[0].atk;
				console.log("dmg:", dmg);
				if (state.defender[1] === "cs1") {
					state.player1Graveyard.push(state.defender[0]);
					state.player1FieldSlot1 = [];
					state.player1FieldSlot1Playing = false;
					state.player1Life = state.player1Life - dmg;
				} else if (state.defender[1] === "cs2") {
					state.player1Graveyard.push(state.defender[0]);
					state.player1FieldSlot2 = [];
					state.player1FieldSlot2Playing = false;
					state.player1Life = state.player1Life - dmg;
				} else if (state.defender[1] === "cs3") {
					state.player1Graveyard.push(state.defender[0]);
					state.player1FieldSlot3 = [];
					state.player1FieldSlot3Playing = false;
					state.player1Life = state.player1Life - dmg;
				} else if (state.defender[1] === "cs4") {
					state.player2Graveyard.push(state.defender[0]);
					state.player2FieldSlot1 = [];
					state.player2FieldSlot1Playing = false;
					state.player2Life = state.player2Life - dmg;
				} else if (state.defender[1] === "cs5") {
					state.player2Graveyard.push(state.defender[0]);
					state.player2FieldSlot2 = [];
					state.player2FieldSlot2Playing = false;
					state.player2Life = state.player2Life - dmg;
				} else if (state.defender[1] === "cs6") {
					state.player2Graveyard.push(state.defender[0]);
					state.player2FieldSlot3 = [];
					state.player2FieldSlot3Playing = false;
					state.player2Life = state.player2Life - dmg;
				}
			}
			//ATTACKER HAS LESS ATK THAN DEFENDERS ATK //
			if (state.attacker[0].atk < state.defender[0].atk && state.defender[0].position === "atk") {
				const dmg = state.defender[0].atk - state.attacker[0].atk;
				console.log("dmg:", dmg);
				if (state.attacker[1] === "cs1") {
					state.player1Graveyard.push(state.attacker[0]);
					state.player1FieldSlot1 = [];
					state.player1FieldSlot1Playing = false;
					state.player1Life = state.player1Life - dmg;
				} else if (state.attacker[1] === "cs2") {
					state.player1Graveyard.push(state.attacker[0]);
					state.player1FieldSlot2 = [];
					state.player1FieldSlot2Playing = false;
					state.player1Life = state.player1Life - dmg;
				} else if (state.attacker[1] === "cs3") {
					state.player1Graveyard.push(state.attacker[0]);
					state.player1FieldSlot3 = [];
					state.player1FieldSlot3Playing = false;
					state.player1Life = state.player1Life - dmg;
				} else if (state.attacker[1] === "cs4") {
					state.player2Graveyard.push(state.attacker[0]);
					state.player2FieldSlot1 = [];
					state.player2FieldSlot1Playing = false;
					state.player2Life = state.player2Life - dmg;
				} else if (state.attacker[1] === "cs5") {
					state.player2Graveyard.push(state.attacker[0]);
					state.player2FieldSlot2 = [];
					state.player2FieldSlot2Playing = false;
					state.player2Life = state.player2Life - dmg;
				} else if (state.attacker[1] === "cs6") {
					state.player2Graveyard.push(state.attacker[0]);
					state.player2FieldSlot3 = [];
					state.player2FieldSlot3Playing = false;
					state.player2Life = state.player2Life - dmg;
				}
			}
			// ATTACKER AND DEFENDER ATK ARE EQUAL - BOTH DESTROYED //
			if (state.attacker[0].atk === state.defender[0].atk && state.defender[0].position === "atk") {
				if (state.attacker[1] === "cs1") {
					state.player1Graveyard.push(state.attacker[0]);
					state.player1FieldSlot1 = [];
					state.player1FieldSlot1Playing = false;
				} else if (state.attacker[1] === "cs2") {
					state.player1Graveyard.push(state.attacker[0]);
					state.player1FieldSlot2 = [];
					state.player1FieldSlot2Playing = false;
				} else if (state.attacker[1] === "cs3") {
					state.player1Graveyard.push(state.attacker[0]);
					state.player1FieldSlot3 = [];
					state.player1FieldSlot3Playing = false;
				} else if (state.attacker[1] === "cs4") {
					state.player2Graveyard.push(state.attacker[0]);
					state.player2FieldSlot1 = [];
					state.player2FieldSlot1Playing = false;
				} else if (state.attacker[1] === "cs5") {
					state.player2Graveyard.push(state.attacker[0]);
					state.player2FieldSlot2 = [];
					state.player2FieldSlot2Playing = false;
				} else if (state.attacker[1] === "cs6") {
					state.player2Graveyard.push(state.attacker[0]);
					state.player2FieldSlot3 = [];
					state.player2FieldSlot3Playing = false;
				}
				if (state.defender[1] === "cs1") {
					state.player1Graveyard.push(state.defender[0]);
					state.player1FieldSlot1 = [];
					state.player1FieldSlot1Playing = false;
				} else if (state.defender[1] === "cs2") {
					state.player1Graveyard.push(state.defender[0]);
					state.player1FieldSlot2 = [];
					state.player1FieldSlot2Playing = false;
				} else if (state.defender[1] === "cs3") {
					state.player1Graveyard.push(state.defender[0]);
					state.player1FieldSlot3 = [];
					state.player1FieldSlot3Playing = false;
				} else if (state.defender[1] === "cs4") {
					state.player2Graveyard.push(state.defender[0]);
					state.player2FieldSlot1 = [];
					state.player2FieldSlot1Playing = false;
				} else if (state.defender[1] === "cs5") {
					state.player2Graveyard.push(state.defender[0]);
					state.player2FieldSlot2 = [];
					state.player2FieldSlot2Playing = false;
				} else if (state.defender[1] === "cs6") {
					state.player2Graveyard.push(state.defender[0]);
					state.player2FieldSlot3 = [];
					state.player2FieldSlot3Playing = false;
				}
			}
			// ATTACKERS ATK IS MORE THAN DEFENDERS DEF - DEFNDER GETS DESTROYED //
			if (state.attacker[0].atk > state.defender[0].def && state.defender[0].position === "def") {
				if (state.defender[1] === "cs1") {
					state.player1Graveyard.push(state.defender[0]);
					state.player1FieldSlot1 = [];
					state.player1FieldSlot1Playing = false;
				} else if (state.defender[1] === "cs2") {
					state.player1Graveyard.push(state.defender[0]);
					state.player1FieldSlot2 = [];
					state.player1FieldSlot2Playing = false;
				} else if (state.defender[1] === "cs3") {
					state.player1Graveyard.push(state.defender[0]);
					state.player1FieldSlot3 = [];
					state.player1FieldSlot3Playing = false;
				} else if (state.defender[1] === "cs4") {
					state.player2Graveyard.push(state.defender[0]);
					state.player2FieldSlot1 = [];
					state.player2FieldSlot1Playing = false;
				} else if (state.defender[1] === "cs5") {
					state.player2Graveyard.push(state.defender[0]);
					state.player2FieldSlot2 = [];
					state.player2FieldSlot2Playing = false;
				} else if (state.defender[1] === "cs6") {
					state.player2Graveyard.push(state.defender[0]);
					state.player2FieldSlot3 = [];
					state.player2FieldSlot3Playing = false;
				}
			}
			//ATTACKER HAS LESS ATK THAN DEFENDERS DEF - ATTACKER LOSES DIFFERENCE IN LIFE POINTS //
			if (state.attacker[0].atk < state.defender[0].def && state.defender[0].position === "def") {
				if (state.attacker[1] === "cs1" || state.attacker[1] === "cs2" || state.attacker[1] === "cs3") {
					const dmg = state.defender[0].def - state.attacker[0].atk;
					console.log("dmg:", dmg);
					state.player1Life = state.player1Life - dmg;
				} else if (state.attacker[1] === "cs4" || state.attacker[1] === "cs5" || state.attacker[1] === "cs6") {
					const dmg = state.defender[0].def - state.attacker[0].atk;
					console.log("dmg:", dmg);
					state.player2Life = state.player2Life - dmg;
				}
			}
			const fieldSlots = [state.player1FieldSlot1, state.player1FieldSlot2, state.player1FieldSlot3, state.player2FieldSlot1, state.player2FieldSlot2, state.player2FieldSlot3];
			const attackingCard = fieldSlots.find((card) => card.id === state.attacker[0].id);
			if (attackingCard) {
				attackingCard.hasAttacked = true;
			}
			// if (state.AiPlaying && state.player2Turn) {
			// 	state.attacker = state.attacker.splice(0, 2);
			// 	state.defender = state.defender.splice(0, 2);
			// 	// if (!state.attacker.length || !state.defender.length) {
			// 	// 	state.player2Turn = false;
			// 	// }
			// } else {
			state.attacker = [];
			state.defender = [];
			// }
		},

		setPlayerTurn(state, action) {
			if (action.payload === "player2") {
				state.player1Turn = false;
				state.player2Turn = true;
			} else if (action.payload === "player1") {
				state.player2Turn = false;
				state.player1Turn = true;
			}
			state.summonPhase = true;
		},
		setDrawPhase(state, action) {
			action.payload === true ? (state.drawPhase = true) : (state.drawPhase = false);
		},
		setBattlephase(state, action) {
			action.payload === true ? (state.battlePhase = true) : (state.battlePhase = false);
		},
		setSummonPhase(state, action) {
			action.payload === true ? (state.summonPhase = true) : (state.summonPhase = false);
		},
		setHasSummoned(state, action) {
			action.payload === true ? (state.hasSummoned = true) : (state.hasSummoned = false);
		},
		//END TURN LOGIC - CHANGE STATES BACK / RESET HAS ATTACKED BOOLEAN ON PLAYING CARDS / RESET ATTACKER/DEFENDER / INCREASE TURN COUNT //
		endTurn(state) {
			state.drawPhase = true;
			state.battlePhase = false;
			state.summonPhase = false;
			state.hasSummoned = false;

			const fieldSlots = [state.player1FieldSlot1, state.player1FieldSlot2, state.player1FieldSlot3, state.player2FieldSlot1, state.player2FieldSlot2, state.player2FieldSlot3];
			const updatedCards = fieldSlots.filter((card) => card.hasAttacked === true);
			updatedCards.forEach((card) => (card.hasAttacked = false));

			state.attacker = [];
			state.defender = [];
			state.turn = state.turn + 1;

			if (state.player1Turn) {
				state.player1Turn = false;
				state.player2Turn = true;
			} else {
				state.player1Turn = true;
				state.player2Turn = false;
			}
			console.log("draw:", state.drawPhase, "battle:", state.battlePhase, "summon:", state.summonPhase);
		},
		setWinner(state) {
			state.winner = true;
		},
		//********************************************TRIBUTE SUMMON LOGIC*********************************/
		//SET SELECTED CARD THAT WILL BE TRIBUTE SUMMONED//
		setSelectedCard(state, action) {
			if (!action.payload) {
				state.selectedCard = [];
			} else {
				state.selectedCard = action.payload.card;
			}
			console.log(state.selectedCard);
		},
		//CARD TRIBUTE SUMMON FUNCTIONS//
		setIsTributing(state, action) {
			action.payload = true ? (state.isTributing = true) : (state.isTributing = false);
		},
		//set all tribute booleans to false//
		setTributesToFalse(state) {
			state.isTributing = false;
			state.canTributeSummon = false;
		},
		clearSelectedTributes(state) {
			state.tributes = [];
		},
		//set boolean flag for tribute summon button//
		setTributePrompt(state, action) {
			action.payload === true ? (state.tributePrompt = true) : (state.tributePrompt = false);
		},
		selectTributes(state, action) {
			console.log("select tribute fn fired!");
			if (action.payload.slotId === "cs1") {
				state.tributes.push([state.player1FieldSlot1, action.payload.slotId]);
			} else if (action.payload.slotId === "cs2") {
				state.tributes.push([state.player1FieldSlot2, action.payload.slotId]);
			} else if (action.payload.slotId === "cs3") {
				state.tributes.push([state.player1FieldSlot3, action.payload.slotId]);
			} else if (action.payload.slotId === "cs4") {
				state.tributes.push([state.player2FieldSlot1, action.payload.slotId]);
			} else if (action.payload.slotId === "cs5") {
				state.tributes.push([state.player2FieldSlot2, action.payload.slotId]);
			} else if (action.payload.slotId === "cs6") {
				state.tributes.push([state.player2FieldSlot3, action.payload.slotId]);
			}

			if (state.tributes.length === state.selectedCard.tributesRequired) {
				console.log("tribute arry length check!");
				state.canTributeSummon = true;
				state.tributePrompt = true;
			}
		},
		removeTributedCards(state, action) {
			console.log("remove tribute check");
			state.tributes.forEach((tribute) => {
				if (tribute[1] === "cs1") {
					state.player1Graveyard.push(state.player1FieldSlot1);
					state.player1FieldSlot1 = [];
					state.player1FieldSlot1Playing = false;
				} else if (tribute[1] === "cs2") {
					state.player1Graveyard.push(state.player1FieldSlot2);
					state.player1FieldSlot2 = [];
					state.player1FieldSlot2Playing = false;
				} else if (tribute[1] === "cs3") {
					state.player1Graveyard.push(state.player1FieldSlot3);
					state.player1FieldSlot3 = [];
					state.player1FieldSlot3Playing = false;
				} else if (tribute[1] === "cs4") {
					state.player2Graveyard.push(state.player2FieldSlot1);
					state.player2FieldSlot1 = [];
					state.player2FieldSlot1Playing = false;
				} else if (tribute[1] === "cs5") {
					state.player2Graveyard.push(state.player2FieldSlot2);
					state.player2FieldSlot2 = [];
					state.player2FieldSlot2Playing = false;
				} else if (tribute[1] === "cs6") {
					state.player2Graveyard.push(state.player2FieldSlot3);
					state.player2FieldSlot3 = [];
					state.player2FieldSlot3Playing = false;
				}
			});
			state.isTributing = false;
			state.canTributeSummon = false;
			state.tributes = [];
		},
		//AI LOGIC SETTERS/FUNCTIONS//
		removeCard(state, action) {
			if (action.payload === "cs4") {
				state.player2Graveyard.push(state.player2FieldSlot1);
				state.player2FieldSlot1 = [];
				state.player2FieldSlot1Playing = false;
			} else if (action.payload === "cs5") {
				state.player2Graveyard.push(state.player2FieldSlot2);
				state.player2FieldSlot2 = [];
				state.player2FieldSlot2Playing = false;
			} else if (action.payload === "cs6") {
				state.player2Graveyard.push(state.player2FieldSlot3);
				state.player2FieldSlot3 = [];
				state.player2FieldSlot3Playing = false;
			}
		},

		AiBattleCalc(state, action) {},

		setAttackerDefender(state, action) {
			state.attacker = [...state.attacker, action.payload.attacker, action.payload.atkId];
			state.defender = [...state.defender, action.payload.defender, action.payload.defId];
			console.log(state.attacker, state.defender);
		},

		setTributes(state, action) {
			state.tributes.push(action.payload);
			console.log("tributes:", state.tributes);
		},

		checkForTraps(state) {
			if (state.player1Turn && (state.player2SpellSlot1Playing || state.player2SpellSlot2Playing || state.player2SpellSlot3Playing)) {
				console.log("trap menu is open set 1");
				return true;
			} else if (state.player2Turn && (state.player1SpellSlot1Playing || state.player1SpellSlot2Playing || state.player1SpellSlot3Playing)) {
				console.log("trap menu is open set 2");
				return true;
			}
		},
	},
});

export const store = configureStore({
	reducer: { player: playerSlice.reducer },
});

export const playerActions = playerSlice.actions;
