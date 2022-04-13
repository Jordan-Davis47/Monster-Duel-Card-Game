const CardSlot = (props) => {
	return (
		<div onClick={props.onClick} id={props.id} className={props.className}>
			{props.children}
		</div>
	);
};

export default CardSlot;
