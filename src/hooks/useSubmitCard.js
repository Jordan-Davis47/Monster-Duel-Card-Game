const useSubmitCard = (card) => {
	const submitMonsterCard = () => {
		fetch("http://localhost:9000/createMonsterCard", {
			method: "POST",
			body: JSON.stringify({
				card: card,
			}),
		});
	};

	submitMonsterCard();
};

export default useSubmitCard;
