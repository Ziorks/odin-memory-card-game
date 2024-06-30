import Card from "./Card";
import Scoreboard from "./Scoreboard";
import "../styles/Game.css";
import { useEffect, useRef, useState } from "react";

async function fetchCardData(id) {
  const url = "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/" + id;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "17518acd8cmsh26198022283e5b0p1f5363jsn979e85c40785",
      "x-rapidapi-host": "omgvamp-hearthstone-v1.p.rapidapi.com",
    },
  };

  try {
    const resp = await fetch(url, options);
    if (!resp.ok) {
      throw new Error("bad response");
    }
    const data = await resp.json();
    return {
      id,
      clicked: false,
      image: Math.random() > 0.1 ? data[0].img : data[0].imgGold,
      description: data[0].name,
    };
  } catch (error) {
    console.log(error);
  }
}

function shuffleArray(array) {
  if (array.length <= 1) {
    return;
  }

  const originalArray = [...array];
  let hasChanged = false;

  while (!hasChanged) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    hasChanged = !originalArray.every(
      (element, index) => element === array[index]
    );
  }
}

function Game() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isGameOver, setIsGameOver] = useState(true);
  const [round, setRound] = useState(1);
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

    const fetchAllCards = async () => {
      const url =
        "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/sets/classic";
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "17518acd8cmsh26198022283e5b0p1f5363jsn979e85c40785",
          "x-rapidapi-host": "omgvamp-hearthstone-v1.p.rapidapi.com",
        },
      };

      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          setIsLoading(false);
          setIsError(true);
          return;
        }
        const data = await resp.json();
        if (!ignore) {
          const filtered = data.filter((card) => card.cardId.startsWith("EX1"));
          cardPool.current = filtered;
          setIsGameOver(false);
        }
      } catch (error) {
        console.log(error);
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchAllCards();

    return () => (ignore = true);
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchCards = async () => {
      setIsLoading(true);
      const nCards = round > 0 ? 2 + round * 2 : 0;
      const cards = [];
      const usedIds = new Set();

      while (cards.length < nCards) {
        const promises = [];
        while (promises.length < nCards - cards.length) {
          const randomCardIndex = Math.floor(
            Math.random() * cardPool.current.length
          );
          const randomCardId = cardPool.current[randomCardIndex].cardId;
          if (!usedIds.has(randomCardId)) {
            usedIds.add(randomCardId);
            promises.push(fetchCardData(randomCardId));
          }
        }
        try {
          const fetchedCards = await Promise.all(promises);
          fetchedCards
            .filter((card) => card.image)
            .forEach((card) => cards.push(card));
        } catch (error) {
          console.log(error);
        }
      }

      if (!ignore) {
        setCardData(cards);
        setIsLoading(false);
        setIsGameOver(false);
      }
    };

    if (cardPool.current) {
      fetchCards();
    }

    return () => (ignore = true);
  }, [round, isGameOver]);

  const handleClick = (id) => {
    const clickedCardIndex = cardData.findIndex((card) => card.id === id);

    //if clicked a card that has already been clicked
    if (cardData[clickedCardIndex].clicked) {
      setRound(1);
      setCardData([]);
      setIsGameOver(true);
      return;
    }

    //if clicked last unclicked card of round
    if (currentRoundScore + 1 === cardData.length) {
      setRound(round + 1);
      setCardData([]);
      return;
    }

    //if clicked unclicked card and there are still unclicked cards
    const newCardData = cardData.map((card) => ({ ...card }));
    newCardData[clickedCardIndex].clicked = true;
    shuffleArray(newCardData);
    setCardData(newCardData);
  };

  if (isError) {
    return (
      <main className="game">
        <p className="message">There was an error.</p>
      </main>
    );
  }

  return (
    <main className="game">
      <Scoreboard currentScore={score} highScore={highScore.current} />
      {isLoading ? (
        <p className="message">Loading...</p>
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
