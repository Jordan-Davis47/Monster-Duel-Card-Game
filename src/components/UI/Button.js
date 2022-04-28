import classes from "./Button.module.css";

let buttonClass;

const Button = (props) => {
	if (props.className === "button") {
		buttonClass = classes.button;
	} else if (props.className === "backButton") {
		buttonClass = `${classes.backButton}`;
	} else {
		buttonClass = `${props.className}`;
	}

	return (
		<button onClick={props.onClick} className={buttonClass}>
			{props.children}
		</button>
	);
};

export default Button;
