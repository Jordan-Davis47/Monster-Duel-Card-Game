import classes from "./MenuButton.module.css";

const MenuButton = (props) => {
	return (
		<div onClick={props.onClick} className={classes.menuBtn}>
			{props.children}
		</div>
	);
};

export default MenuButton;
