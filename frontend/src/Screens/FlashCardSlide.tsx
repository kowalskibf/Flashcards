import React, { useState, useEffect } from "react";
import { Typography, Button, Box } from "@material-ui/core";
import SingleFlipCard from "../components/SingleFlipCard";
import { useParams } from "react-router-dom";

type FlashCard = {
  id: number;
  title: string;
  one_side: string;
  second_side: string;
};

type Params = {
  id: string;
  title: string;
};

export default function FlashcardSlide() {
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState<number>(0);
  const { id, title } = useParams<Params>();

  useEffect(() => {
    // fetch flashcards from API
    fetch("http://127.0.0.1:8000/api/sets/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFlashcards(data));
  }, []);

  const handleClickNext = () => {
    setIndex((index + 1) % flashcards.length);
  };

  const handleClickPrev = () => {
    setIndex((index === 0 ? flashcards.length : index) - 1);
  };

  return (
    <div className="flashcard-holder">
      <React.Fragment>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          style={{ marginTop: "200px" }}
        >
          {title}
        </Typography>
        {flashcards.length !== 0 ? (
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleClickPrev}
                disabled={flashcards.length <= 1}
              >
                Prev
              </Button>
            </div>
            <div style={{ flex: 2 }}>
              <SingleFlipCard
                id={flashcards[index].id}
                title={flashcards[index].title}
                one_side={flashcards[index].one_side}
                second_side={flashcards[index].second_side}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleClickNext}
                disabled={flashcards.length <= 1}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <h2>No flashcards</h2>
        )}
      </React.Fragment>
    </div>
  );
}
