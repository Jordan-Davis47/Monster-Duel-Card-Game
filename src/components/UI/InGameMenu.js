import Modal from "./Modal";

import classes from "./InGameMenu.module.css";

const InGameMenu = (props) => {
	const phase = props.drawPhase ? "Draw Phase" : props.summonPhase ? "Summon Phase" : props.battlePhase ? "Battle Phase" : "";
	const currentPhase = `Phase: ${phase}`;
	const currentTurn = `Turn: ${props.turn}`;

	return (
		<Modal onClose={props.onCloseMenu}>
			<div className={classes.menu}>
				<h2>Menu</h2>
				<h3 className={classes.currentTurn}>{currentTurn}</h3>
				<h3 className={classes.currentPhase}>{currentPhase}</h3>
				<div className={classes.menuBar} onClick={props.onBattlePhase}>
					<p className={classes.battlePhaseBar}>Enter Battle Phase</p>
				</div>
				<div className={classes.menuBar} onClick={props.onEndTurn}>
					<p className={classes.endTurnBar}>End Turn</p>
				</div>
				<div className={classes.menuBar} onClick={props.onCloseMenu}>
					<p className={classes.closeMenuBar}>Close Menu</p>
				</div>
				<div className={classes.menuBar}>
					<p className={classes.quitGameBar}>Quit Game</p>
				</div>
			</div>
		</Modal>
	);
};

export default InGameMenu;
