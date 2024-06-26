import Card from "./Card";
import Scoreboard from "./Scoreboard";
import "../styles/Game.css";

import image1 from "../images/ragnaros.png";
import image2 from "../images/angryChicken.png";
import image3 from "../images/youthfulBrewmaster.png";
import image4 from "../images/chillwindYeti.png";
import { useRef, useState } from "react";

const testImages = [image1, image2, image3, image4];
const shuffleArray = (array) => {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};

function Game() {
  const [score, setScore] = useState(0);
  const [images, setImages] = useState(testImages);
  const highScore = useRef(score);

  return (
    <main
      className="game"
      onClick={() => {
        const newImages = [...images];
        shuffleArray(newImages);
        setImages(newImages);
        setScore(Math.random() > 0.05 ? score + 1 : 0);
        highScore.current = Math.max(highScore.current, score + 1);
      }}
    >
      <Scoreboard currentScore={score} highScore={highScore.current} />
      {images.map((image) => (
        <Card image={image} />
      ))}
    </main>
  );
}

export default Game;
