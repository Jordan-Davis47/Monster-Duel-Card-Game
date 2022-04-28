import { Fragment, useState } from "react";
import MenuButton from "./MenuButton";

import classes from "./MainMenu.module.css";
import DuelMenu from "./DuelMenu";
import HowToPlay from "./HowToPlay";
import Leaderboard from "./Leaderboard";
import Button from "../Button";
import SignUp from "../Forms/SignUp";
import CreateDeck from "../Forms/CreateDeck";
import CustomDeckMenu from "./CustomDeckMenu";

const MainMenu = (props) => {
	const [openDuelMenu, setOpenDuelMenu] = useState(false);
	const [howToPlayIsOpen, setHowToPlayIsOpen] = useState(false);
	const [leaderboardIsOpen, setLeaderboardIsOpen] = useState(false);
	const [signUpOpen, setSignUpOpen] = useState(false);
	const [createDeckIsOpen, setCreateDeckIsOpen] = useState(false);

	function openDuelMenuHandler() {
		setOpenDuelMenu(true);
	}
	function closeDuelMenuHandler() {
		setOpenDuelMenu(false);
	}

	function openHowToPlayHandler() {
		setHowToPlayIsOpen(true);
	}

	function closeHowToPlayHandler() {
		setHowToPlayIsOpen(false);
	}

	function openLeaderboardHandler() {
		setLeaderboardIsOpen(true);
	}

	function closeLeaderboardHandler() {
		setLeaderboardIsOpen(false);
	}

	function showSignUpFormHandler() {
		setSignUpOpen(true);
	}

	function openCreateDeckHandler() {
		setCreateDeckIsOpen(true);
	}

	const mainMenuOpen = !openDuelMenu && !howToPlayIsOpen && !leaderboardIsOpen && !signUpOpen && !createDeckIsOpen;

	return (
		<Fragment>
			<div className={classes.mainMenu}>
				<div className={classes.accountHeader}>
					{mainMenuOpen && (
						<Button className={classes.signUpBtn} onClick={showSignUpFormHandler}>
							Sign Up
						</Button>
					)}
					{mainMenuOpen && <Button className={classes.signInBtn}>Log In</Button>}
				</div>

				{mainMenuOpen && <h1 className={classes.mainTitle}>Monster Duels</h1>}
				<div className={classes.menuBtnContainer}>
					{mainMenuOpen && (
						<MenuButton onClick={openDuelMenuHandler} className={classes.menuButton}>
							<p>Start Duel</p>
						</MenuButton>
					)}
					{mainMenuOpen && (
						<MenuButton onClick={openHowToPlayHandler} className={classes.menuButton}>
							<p>How To Play</p>
						</MenuButton>
					)}
					{mainMenuOpen && (
						<MenuButton onClick={openCreateDeckHandler} className={classes.menuButton}>
							<p>Create A Deck</p>
						</MenuButton>
					)}
					{mainMenuOpen && (
						<MenuButton onClick={openLeaderboardHandler} className={classes.menuButton}>
							<p>Leaderboard</p>
						</MenuButton>
					)}
				</div>
				{openDuelMenu && <DuelMenu onClose={closeDuelMenuHandler} onPickDeck={props.onPickDeck} />}
				{howToPlayIsOpen && <HowToPlay onClose={closeHowToPlayHandler} />}
				{leaderboardIsOpen && <Leaderboard onClose={closeLeaderboardHandler} />}
				{signUpOpen && <SignUp />}
				{createDeckIsOpen && <CustomDeckMenu />}
				{/* {createDeckIsOpen && <CreateDeck />} */}
			</div>
		</Fragment>
	);
};

export default MainMenu;
