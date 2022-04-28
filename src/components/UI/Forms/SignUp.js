import { useRef, Fragment } from "react";

import classes from "./SignUp.module.css";

const SignUp = (props) => {
	const nameInputRef = useRef();
	const passwordInputRef = useRef();

	function formSubmitHandler(e) {
		e.preventDefault();
		console.log(nameInputRef.current.value);
		console.log(passwordInputRef.current.value);
	}

	return (
		<Fragment>
			<h2 className={classes.formTitle}>Register</h2>
			<form className={classes.signUpForm} onSubmit={formSubmitHandler}>
				<div className={classes.formControl}>
					<input type="text" id="username" ref={nameInputRef} />
					<label className={classes.formLabel} htmlFor="username">
						Username
					</label>
				</div>
				<div className={classes.formControl}>
					<input type="password" id="password" ref={passwordInputRef} />
					<label htmlFor="password">Password</label>
				</div>
				<button className={classes.formBtn} type="submit">
					Create Account
				</button>
			</form>
		</Fragment>
	);
};

export default SignUp;
