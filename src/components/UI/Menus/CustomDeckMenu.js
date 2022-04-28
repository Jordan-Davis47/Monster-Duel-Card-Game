import { Fragment, React, useState } from "react";
import Button from "../Button";
import CreateDeckMenu from "./CreateDeckMenu";

import classes from "./CustomDeckMenu.module.css";

const CustomDeckMenu = () => {
	const [showCreateDeckMenu, setShowCreateDeckMenu] = useState(false);
	const [showDeckOptions, setShowDeckOptions] = useState(true);

	function showCreateDeckMenuHandler() {
		setShowCreateDeckMenu(true);
	}

	function hideCreateDeckMenuHandler() {
		setShowCreateDeckMenu(false);
	}

	function showDeckOptionsHandler() {
		setShowDeckOptions(true);
	}
	return (
		<Fragment>
			{!showCreateDeckMenu && (
				<div>
					<h2 className={classes.decksHeader}>Decks</h2>
					<div className={classes.decksDisplay}>
						<p>Currently no decks</p>
						<div className={classes.deck}>
							<button>Add To Deck</button>
							<button>View Deck</button>
						</div>
					</div>
					<Button onClick={showCreateDeckMenuHandler} className={classes.newDeckBtn}>
						Create New Deck
					</Button>
				</div>
			)}
			{showCreateDeckMenu && <CreateDeckMenu onClose={hideCreateDeckMenuHandler} />}
		</Fragment>
	);
};

export default CustomDeckMenu;
