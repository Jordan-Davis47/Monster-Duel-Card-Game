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
		return tributeMonster;
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
	console.log(targets);
	console.log(oppSlots);
	console.log(slots);
	const s1Targets = targets.filter((card) => card.atk < slots[0][0].atk);
	const s2Targets = targets.filter((card) => card.atk < slots[1][0].atk);
	const s3Targets = targets.filter((card) => card.atk < slots[2][0].atk);
	if (s1Targets.length) {
		s1TargetInfo = oppSlots.find((array) => array[0].atk === s1Targets[0].atk);
	}
	if (s2Targets.length) {
		s2TargetInfo = oppSlots.find((array) => array[0].atk === s2Targets[0].atk);
	}
	if (s3Targets.length) {
		s3TargetInfo = oppSlots.find((array) => array[0].atk === s3Targets[0].atk);
	}
	console.log(s1TargetInfo, s2TargetInfo, s3TargetInfo);
	return [s1TargetInfo, s2TargetInfo, s3TargetInfo];
}

export function champCheckForSpellCard(hand) {
	const card = hand.find((card) => card.type === "spell");
	const spellCard = { ...card, owner: "p2" };
	if (card) {
		return spellCard;
	}
}
