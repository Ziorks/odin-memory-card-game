import Card from "./Card";
import Scoreboard from "./Scoreboard";
import "../styles/Game.css";

import image1 from "../images/ragnaros.png";
import image2 from "../images/angryChicken.png";
import image3 from "../images/youthfulBrewmaster.png";
import image4 from "../images/chillwindYeti.png";
import { useRef, useState } from "react";

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

const generateCardData = () => {
  const data = [
    {
      id: 0,
      clicked: false,
      image: image1,
      description: "Ragnaros the Firelord",
    },
    {
      id: 1,
      clicked: false,
      image: image2,
      description: "Angry Chicken",
    },
    {
      id: 2,
      clicked: false,
      image: image3,
      description: "Youthful Brewmaster",
    },
    {
      id: 3,
      clicked: false,
      image: image4,
      description: "Chillwind Yeti",
    },
  ];
  shuffleArray(data);
  return data;
};

function Game() {
  const [cardData, setCardData] = useState(generateCardData());
  const highScore = useRef(0);
  const score = cardData.filter(({ clicked }) => clicked).length;
  highScore.current = Math.max(highScore.current, score);

  const handleClick = (id) => {
    const clickedCardIndex = cardData.findIndex((card) => card.id === id);
    if (cardData[clickedCardIndex].clicked) {
      setCardData(generateCardData());
    } else {
      const newCardData = cardData.map((card) => ({ ...card }));
      newCardData[clickedCardIndex].clicked = true;
      shuffleArray(newCardData);
      setCardData(newCardData);
    }
  };

  return (
    <main className="game">
      <Scoreboard currentScore={score} highScore={highScore.current} />
      <div className="cardsContainer">
        {cardData.map(({ id, image, description }) => (
          <Card
            key={id}
            image={image}
            description={description}
            onClick={() => handleClick(id)}
          />
        ))}
      </div>
    </main>
  );
}

export default Game;
