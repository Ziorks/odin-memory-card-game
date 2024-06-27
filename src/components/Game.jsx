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

const generateCardData = (nCards) => {
  //replace this with api call
  const testData = [
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

  const result = [];
  for (let i = 0; i < nCards; i++) {
    result.push(testData[Math.floor(Math.random() * testData.length)]);
  }
  shuffleArray(result);
  return result;
};

function Game() {
  const [round, setRound] = useState(1);
  const [cardData, setCardData] = useState(generateCardData(4));
  const highScore = useRef(0);

  const prevRound = round - 1;
  const prevRoundsScore = prevRound * 2 + (prevRound / 2) * (2 + prevRound * 2);
  const currentRoundScore = cardData.filter(({ clicked }) => clicked).length;
  const score = prevRoundsScore + currentRoundScore;
  highScore.current = Math.max(highScore.current, score);

  const handleClick = (id) => {
    const clickedCardIndex = cardData.findIndex((card) => card.id === id);

    //if clicked a card that has already been clicked
    if (cardData[clickedCardIndex].clicked) {
      setRound(1);
      setCardData(generateCardData(4));
      return;
    }

    //if clicked last unclicked card of round
    if (currentRoundScore + 1 === cardData.length) {
      const nextRound = round + 1;
      const nNewCards = 2 + nextRound * 2;
      setRound(nextRound);
      setCardData(generateCardData(nNewCards));
      return;
    }

    //if clicked unclicked card and there are still unclicked cards
    const newCardData = cardData.map((card) => ({ ...card }));
    newCardData[clickedCardIndex].clicked = true;
    shuffleArray(newCardData);
    setCardData(newCardData);
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
