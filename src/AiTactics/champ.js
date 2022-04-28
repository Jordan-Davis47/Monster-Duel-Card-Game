export function champChooseCard(hand, slots) {
	const reducer = (sum, value) => {
		return sum > value ? sum : value;
	};
	let tributesAvailable = 0;
	let statNums = [];

	for (let i = 0; i < 3; i++) {
		if (slots[i][0].id && slots[i][0].tributesRequired !== 2 && tributesAvailable !== 2) {
			tributesAvailable++;
		}
	}
	const tributeMonster = hand.find((card) => card.tributesRequired === tributesAvailable);
	if ((slots[0][0].id || slots[1][0].id || slots[2][0].id) && tributeMonster) {
		console.log("tribute check check");
		let tributeCard;
		tributeMonster.def > tributeMonster.atk ? (tributeCard = { ...tributeMonster, position: "def" }) : (tributeCard = { ...tributeMonster, position: "atk" });
		return tributeCard;
	}
	const stats = hand.map((card) => (card.type === "monster" && !card.tributesRequired ? [card.atk, card.def] : ""));
	stats.forEach((array) => (statNums = [...statNums, ...array]));
	const highStat = statNums.reduce(reducer, 0);
	let card = hand.find((card) => (card.atk === highStat ? true : card.def === highStat ? true : false));
	if (!card) {
		return;
	}
	card = card.def > card.atk ? (card = { ...card, position: "def" }) : (card = { ...card, position: "atk" });

	console.log(hand, stats, highStat, card);
	return card;
}

export function champBattleTactic(slots, oppSlots) {
	let s1TargetInfo = [];
	let s2TargetInfo = [];
	let s3TargetInfo = [];
	const targets = oppSlots.map((stats) => stats[0]);
	// console.log(targets);
	// console.log(oppSlots);
	// console.log(slots);
	const s1Targets = targets.filter((card) => card.atk < slots[0][0].atk);
	const s2Targets = targets.filter((card) => card.atk < slots[1][0].atk);
	const s3Targets = targets.filter((card) => card.atk < slots[2][0].atk);
	if (s1Targets.length) {
		if (slots[0][0].position === "atk") {
			s1TargetInfo = oppSlots.find((array) => array[0].atk === s1Targets[0].atk);
		}
	}
	if (s2Targets.length) {
		if (slots[1][0].position === "atk") {
			s2TargetInfo = oppSlots.find((array) => array[0].atk === s2Targets[0].atk);
		}
	}
	if (s3Targets.length) {
		if (slots[2][0].position === "atk") {
			s3TargetInfo = oppSlots.find((array) => array[0].atk === s3Targets[0].atk);
		}
	}
	// console.log(s1TargetInfo, s2TargetInfo, s3TargetInfo);
	return [s1TargetInfo, s2TargetInfo, s3TargetInfo];
}

export function champCheckForSpellCard(hand) {
	const card = hand.find((card) => card.type === "spell");
	const spellCard = { ...card, owner: "p2" };
	if (card) {
		return spellCard;
	}
}

export function champCheckForTrapCard(hand) {
	const card = hand.find((card) => card.type === "trap");
	const trapCard = { ...card, owner: "p2" };
	if (card) {
		// console.log(trapCard);
		return trapCard;
	}
}

export function champSelectTrap(ss1, ss2, ss3) {
	const trapSlots = [ss1, ss2, ss3];
	let trapCard;
	// ss3.id ? (trapCard = ss3) : ss2.id ? (trapCard = ss2) : ss1.id ? (trapCard = ss1) : '';
	if (ss3.id) {
		trapCard = ss3;
	} else if (ss2.id) {
		trapCard = ss2;
	} else if (ss1.id) {
		trapCard = ss1;
	}
	// console.log("trapCard:", trapCard);
	return trapCard;
}
