import React from "react";

const LeaderboardEntry = (props) => {
	console.log(props);
	return (
		<div className={props.className}>
			<p>#{props.rank}</p>
			<p>{props.name}</p>
			<p>{props.wins}</p>
			<p>{props.score}</p>
		</div>
	);
};

export default LeaderboardEntry;
