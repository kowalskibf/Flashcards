import React, { useEffect, useState } from "react";
import "../App.css";
import { useParams } from "react-router-dom";

type Params = {
  id: string;
};

type FlashCard = {
  id: number;
  title: string;
  one_side: string;
  second_side: string;
};

export default function FlashCard() {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [flashcard, setFlashcard] = useState<FlashCard | undefined>();
  const { id } = useParams<Params>();

  useEffect(() => {
    // fetch flashcard from API
    fetch("http://127.0.0.1:8000/api/flashcard/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFlashcard(data));
  }, []);
  console.log(flashcard);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div>
      {flashcard === undefined ? (
        <h1>Loading...</h1>
      ) : (
        <React.Fragment>
          <h1>{flashcard.title}</h1>
          <div
            className={`flip-card ${isFlipped ? "flipped" : ""}`}
            onClick={handleClick}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h2>{flashcard.one_side}</h2>
                <p>Click to flip</p>
              </div>
              <div className="flip-card-back">
                <h2>{flashcard.second_side}</h2>
                <p>Click to flip back</p>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
