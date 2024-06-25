import Card from "./Card";
import Scoreboard from "./Scoreboard";
import "../styles/Game.css";

function Game() {
  return (
    <main className="game">
      <Scoreboard />
      <Card />
    </main>
  );
}

export default Game;
