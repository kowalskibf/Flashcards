import { Block } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Flashcard = {
  id: number;
  title: string;
  one_side: string;
  second_side: string;
};

export default function StudySet() {
  const [currentFlashcard, setCurrentFlashcard] = useState<number>(0);

  //const handleNextFlashcard;

  type Params = {
    id: string;
  };

  const { id } = useParams<Params>();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const [translation, setTranslation] = useState<string>("");

  const handleStart = async () => {
    try {
      (document.getElementById("btn") as HTMLFormElement).style.display =
        "none";
      (document.getElementById("div0") as HTMLFormElement).style.display =
        "block";
    } catch (e) {
      return;
    }
  };

  const handleCheck = async () => {
    try {
      if (translation == flashcards[currentFlashcard].second_side) {
        (document.getElementById(
          "ansWrong" + currentFlashcard.toString()
        ) as HTMLFormElement).style.display = "none";
        (document.getElementById(
          "ansCorrect" + currentFlashcard.toString()
        ) as HTMLFormElement).style.display = "block";
      } else {
        (document.getElementById(
          "ansCorrect" + currentFlashcard.toString()
        ) as HTMLFormElement).style.display = "none";
        (document.getElementById(
          "ansWrong" + currentFlashcard.toString()
        ) as HTMLFormElement).style.display = "block";
      }
    } catch (e) {
      return;
    }
  };

  const handleNext = async () => {
    try {
      if (currentFlashcard == flashcards.length - 2) {
        (document.getElementById(
          "btnNext" + (flashcards.length - 1)
        ) as HTMLFormElement).style.display = "none";
        (document.getElementById("divAgain") as HTMLFormElement).style.display =
          "flex";
      }
      (document.getElementById(
        "ansWrong" + currentFlashcard.toString()
      ) as HTMLFormElement).style.display = "none";
      (document.getElementById(
        "ansCorrect" + currentFlashcard.toString()
      ) as HTMLFormElement).style.display = "none";
      (document.getElementById(
        "div" + currentFlashcard.toString()
      ) as HTMLFormElement).style.display = "none";
      (document.getElementById(
        "div" + (currentFlashcard + 1).toString()
      ) as HTMLFormElement).style.display = "block";
      setCurrentFlashcard(currentFlashcard + 1);
      setTranslation("");
    } catch (e) {
      return;
    }
  };

  const fetchSet = async () => {
    fetch("http://127.0.0.1:8000/api/set/random/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFlashcards(data));
  };

  useEffect(() => {
    fetchSet();
  }, []);

  return (
    <div className="test-main">
      <div className="test-section"></div>


      {flashcards === undefined ? (
        <h1>Loading...</h1>

      ) : (

        flashcards.map((flashcard, index) => (
          <div
            key={index}
            id={"div" + index.toString()}
            className="study-set-one-flashcard">
            <div className="flashcard-study">{flashcard.one_side}</div>
            <div className="study-input">
              <input
                type="text"
                value={translation}
                placeholder="Type translete here..."
                onChange={(event) => setTranslation(event.target.value)}
              ></input>
            </div>

            <div className="test-sets-section">
              <button 
                id={"btnCheck" + index.toString()} 
                className="start-check-next-button" 
                onClick={handleCheck}>
                Check!
              </button>
            </div>

            <div
              id={"ansCorrect" + index.toString()}
              className="study-set-one-flashcard-correct-answer">
              Correct!
            </div>           

            <div
              id={"ansWrong" + index.toString()}
              className="study-set-one-flashcard-incorrect-answer">
              Correct answer: {flashcard.second_side}
            </div>

            <button 
              id={"btnNext" + index}
              className="study-mode-next-button"
              onClick={handleNext}>
              Next
            </button>

          </div>
        ))
      )}

      {flashcards === undefined ? (
        " "
      ) : (

        <div className="test-sets-section">
          <button 
            id="btn" 
            className="start-check-next-button" 
            onClick={handleStart}>
            Start
          </button>
        </div>
      )}
      
      <div className="test-sets-section">
        {/* <div className="study-set-after"> */}
          <div id="divAgain" className="test-button-back">
            <a href={"/study/" + id}>Again</a>
          </div>
          <div className="test-button-back">
            <a href="/study">Back</a>
          </div>
        {/* </div> */}
      </div>
    </div>
  );
}
