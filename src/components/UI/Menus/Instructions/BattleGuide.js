const BattleGuide = (props) => {
	return (
		<div className={props.className}>
			<h3>Battling</h3>
			<p>There are a few different outcomes that can come from a battle between two cards</p>
			<p>
				If a card is summoned in attack position (card facing forwards) then it can attack each turn, if it attacks another monster in attack position then the card with the highest attack stat will win, the losing card will be sent to its owners
				graveyard and the difference will be taken from the losing players life points
			</p>

			<p>
				If a card is attacked that was summoned in defence position (card facing sideways) then an attacking monsters attack stat must be higher than the defending monsters defence stat to destroy it, if it is destroyed while in defence mode no life
				points are taken. However if the attackers attack is less than the monsters defence then the difference in damage is taken from the attackers life points
			</p>

			<p>Finally, if a battle between two monsters who have the same attack stat occurs, then both of those monsters are destroyed and sent to their owners graveyards</p>
		</div>
	);
};

export default BattleGuide;
