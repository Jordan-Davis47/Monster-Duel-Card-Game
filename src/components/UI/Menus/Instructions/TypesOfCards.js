const TypesOfCards = (props) => {
	return (
		<div className={props.className}>
			<h3>The 3 Card Types</h3>
			<h5>Monster Cards</h5>
			<p>
				These are your main source of damage dealing and defence, each monster card has a attack and defence stat. To defeat an opponents monster card your monster must have a higher attack than their attack or defence (if they are in defence
				position)
			</p>
			<h5>Spell Cards</h5>
			<p>
				Spell cards are your source spells to help improve your chances in a match or really cement your victory. Spell cards have a variety of effects including healing your life points, taking your opponents life points, destroying and powering up
				cards and more.{" "}
			</p>
			<p>You can only use a spell card once from your hand and it is then sent to your graveyard</p>
			<h5>Trap Cards</h5>
			<p>
				Trap cards are your last line of defence from an attack, if your opponent attacks one of your cards or your life points directly, you have an option to activate any trap card you have previously placed onto the field, the effects vary from
				softening a blow to turning the tables on your opponent
			</p>
		</div>
	);
};

export default TypesOfCards;
