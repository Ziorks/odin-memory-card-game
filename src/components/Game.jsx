import Card from "./Card";
import Scoreboard from "./Scoreboard";
import "../styles/Game.css";
import { useEffect, useRef, useState } from "react";

async function getAllCards() {
  const url =
    "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/sets/classic";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "17518acd8cmsh26198022283e5b0p1f5363jsn979e85c40785",
      "x-rapidapi-host": "omgvamp-hearthstone-v1.p.rapidapi.com",
    },
  };

  try {
    const resp = await fetch(url, options);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function shuffleArray(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function Game() {
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(0);
  const [cardData, setCardData] = useState([]);
  const highScore = useRef(0);
  const cardPool = useRef(null);

  const prevRound = round - 1;
  const prevRoundsScore =
    round > 0 ? prevRound * 2 + (prevRound / 2) * (2 + prevRound * 2) : 0;
  const currentRoundScore = cardData.filter(({ clicked }) => clicked).length;
  const score = prevRoundsScore + currentRoundScore;
  highScore.current = Math.max(highScore.current, score);

  useEffect(() => {
    let ignore = false;

    getAllCards().then((result) => {
      if (!ignore) {
        cardPool.current = result;
        setRound(1);
        console.log("Card Pool Received!");
      }
    });

    return () => (ignore = true);
  }, []);

  useEffect(() => {
    const promises = [];
    const nCards = round > 0 ? 2 + round * 2 : 0;
    const cardIds = new Set();

    while (cardIds.size < nCards) {
      const randomCardIndex = Math.floor(
        Math.random() * cardPool.current.length
      );
      const randomCardId = cardPool.current[randomCardIndex].cardId;
      cardIds.add(randomCardId);
    }

    cardIds.forEach((id) => {
      const url = "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/" + id;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "17518acd8cmsh26198022283e5b0p1f5363jsn979e85c40785",
          "x-rapidapi-host": "omgvamp-hearthstone-v1.p.rapidapi.com",
        },
      };

      const promise = new Promise((resolve, reject) => {
        fetch(url, options)
          .then((resp) => resp.json())
          .then((data) => {
            console.log(data);
            const cardData = {
              id,
              clicked: false,
              image: data[0].img,
              description: data[0].name,
            };
            resolve(cardData);
          })
          .catch((error) => reject(error));
      });

      promises.push(promise);
    });

    Promise.all(promises).then((cards) => {
      console.log(cards);
      setCardData(cards);
      setLoading(false);
    });
  }, [round]);

  const handleClick = (id) => {
    const clickedCardIndex = cardData.findIndex((card) => card.id === id);

    //if clicked a card that has already been clicked
    if (cardData[clickedCardIndex].clicked) {
      setRound(1);
      setLoading(true);
      return;
    }

    //if clicked last unclicked card of round
    if (currentRoundScore + 1 === cardData.length) {
      setRound(round + 1);
      setCardData([]);
      setLoading(true);
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
      <Scoreboard
        currentScore={score}
        highScore={highScore.current}
        round={round}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
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
      )}
    </main>
  );
}

export default Game;
