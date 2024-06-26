import "../styles/Scoreboard.css";

function Scoreboard({ currentScore, highScore }) {
  return (
    <div className="scoreboard">
      <h2>Score: {currentScore}</h2>
      <h2>High Score: {highScore}</h2>
    </div>
  );
}

export default Scoreboard;
