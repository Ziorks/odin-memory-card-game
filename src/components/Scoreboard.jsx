import "../styles/Scoreboard.css";

function Scoreboard({ currentScore, highScore, round }) {
  return (
    <div className="scoreboard">
      <h2>High Score: {highScore}</h2>
      <h2>Round: {round}</h2>
      <h2>Score: {currentScore}</h2>
    </div>
  );
}

export default Scoreboard;
