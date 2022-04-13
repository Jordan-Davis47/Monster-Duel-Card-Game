import classes from "./PhaseHeader.module.css";

const PhaseHeader = (props) => {
	let phase;
	if (props.drawPhase) {
		phase = "Draw Phase";
	} else if (props.battlePhase) {
		phase = "Battle Phase";
	} else if (props.summonPhase) {
		phase = "Summon Phase";
	}

	return (
		<div>
			<h2 className={classes.header}>{phase}</h2>
		</div>
	);
};

export default PhaseHeader;
