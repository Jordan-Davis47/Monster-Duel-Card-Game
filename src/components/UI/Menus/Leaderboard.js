import LeaderboardEntry from "./LeaderboardEntry";
import Button from "../Button";

import classes from "./Leaderboard.module.css";
import { useState, useCallback, useEffect, Fragment } from "react";

const Leaderboard = (props) => {
	const [leaderboardData, setLeaderboardData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchLeaderboardData = async () => {
			const res = await fetch("http://localhost:9000/leaderboard");
			const data = await res.json();

			const dataToBeSorted = [];
			for (const key in data) {
				dataToBeSorted.push({
					id: key,
					player: data[key].player,
					wins: data[key].wins,
					score: data[key].score,
				});
			}
			const rankings = dataToBeSorted.sort((a, b) => b.score - a.score);
			console.log("running");
			setLeaderboardData(rankings);
			setIsLoading(false);
		};
		fetchLeaderboardData();
	}, []);

	console.log(leaderboardData);

	if (isLoading) {
		return <section className={classes.spinner}></section>;
	}

	return (
		<Fragment>
			<h1 className={classes.title}>Leaderboard</h1>
			<div className={classes.leaderboard}>
				{/* {leaderboardData.map} */}
				<div className={classes.leaderboardHeader}>
					<p>Name:</p>
					<p>Wins:</p>
					<p>Score:</p>
				</div>
				{/* <LeaderboardEntry className={classes.ranking} name={"Jordan"} wins={5} score={4000} /> */}
				{leaderboardData.map((ranking, index) => (
					<LeaderboardEntry className={classes.ranking} key={index} rank={index + 1} name={ranking.player} wins={ranking.wins} score={ranking.score} />
				))}
				<Button className={classes.backBtn} onClick={props.onClose}>
					Back
				</Button>
			</div>
		</Fragment>
	);
};

export default Leaderboard;
