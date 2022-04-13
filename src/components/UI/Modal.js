import { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";

const Backdrop = (props) => {
	return <div className={classes.backdrop} onClick={props.onClose}></div>;
};

const ModalOverlay = (props) => {
	let modalClass;
	props.className === "trapPrompt" ? (modalClass = `${classes.trapPrompt}`) : (modalClass = `${classes.modal}`);

	return <div className={modalClass}>{props.children}</div>;
};

const portalElement = document.getElementById("overlay");

const Modal = (props) => {
	return (
		<Fragment>
			{ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)}
			{ReactDOM.createPortal(<ModalOverlay className={props.className}>{props.children}</ModalOverlay>, portalElement)}
		</Fragment>
	);
};

export default Modal;
