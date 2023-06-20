import { Block } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Flashcard = {
  id: number;
  title: string;
  one_side: string;
  second_side: string;
};

type WrongFlashcard = {
  one_side: string;
  second_side: string;
  answer: string;
};

export default function TestSet() {
  const [currentFlashcard, setCurrentFlashcard] = useState<number>(0);

  type Params = {
    id: string;
  };

  const [correctAnswers, setCorrectAnswers] = useState<Flashcard[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<WrongFlashcard[]>([]);

  const { id } = useParams<Params>();

  const [score, setScore] = useState<number>(0);

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
    (
      document.getElementById(
        "btnCheck" + currentFlashcard.toString()
      ) as HTMLFormElement
    ).style.display = "none";
    (
      document.getElementById(
        "btnNext" + currentFlashcard.toString()
      ) as HTMLFormElement
    ).style.display = "inline-block";
    if (translation == flashcards[currentFlashcard].second_side) {
      (
        document.getElementById(
          "ansWrong" + currentFlashcard.toString()
        ) as HTMLFormElement
      ).style.display = "none";
      (
        document.getElementById(
          "ansCorrect" + currentFlashcard.toString()
        ) as HTMLFormElement
      ).style.display = "block";
      setScore(score + 1);
      setCorrectAnswers((prev) => [
        ...prev,
        {
          id: 0,
          title: "",
          one_side: flashcards[currentFlashcard].one_side,
          second_side: flashcards[currentFlashcard].second_side,
        },
      ]);
    } else {
      (
        document.getElementById(
          "ansCorrect" + currentFlashcard.toString()
        ) as HTMLFormElement
      ).style.display = "none";
      (
        document.getElementById(
          "ansWrong" + currentFlashcard.toString()
        ) as HTMLFormElement
      ).style.display = "block";
      setWrongAnswers((prev) => [
        ...prev,
        {
          one_side: flashcards[currentFlashcard].one_side,
          second_side: flashcards[currentFlashcard].second_side,
          answer: translation,
        },
      ]);
    }
  };

  const fetchFinished = async () => {
    // fetch flashcards from API
    const score = correctAnswers.length / flashcards.length;
    fetch("http://127.0.0.1:8000/api/stats", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        score: score,
      }),
    });
  };

  const handleNext = async () => {
    try {
      if (currentFlashcard == flashcards.length - 1) {
        (document.getElementById("results") as HTMLFormElement).style.display =
          "inline-block";
        if (
          wrongAnswers.some(
            (wrongAnswer) =>
              wrongAnswer.one_side ===
                flashcards[flashcards.length - 1].one_side &&
              wrongAnswer.second_side ===
                flashcards[flashcards.length - 1].second_side
          )
        ) {
          (
            document.getElementById(
              "circle" + (flashcards.length - 1).toString()
            ) as HTMLFormElement
          ).className =
            "flashcard-progress-circle flashcard-progress-incorrect";
        } else {
          (
            document.getElementById(
              "circle" + (flashcards.length - 1).toString()
            ) as HTMLFormElement
          ).className = "flashcard-progress-circle flashcard-progress-correct";
        }

        (document.getElementById("divAgain") as HTMLFormElement).style.display =
          "flex";
        fetchFinished();
      }
      if (currentFlashcard == flashcards.length - 2) {
        (
          document.getElementById(
            "btnNext" + (flashcards.length - 1)
          ) as HTMLFormElement
        ).style.display = "none";
      }
      (
        document.getElementById(
          "ansWrong" + currentFlashcard.toString()
        ) as HTMLFormElement
      ).style.display = "none";
      (
        document.getElementById(
          "ansCorrect" + currentFlashcard.toString()
        ) as HTMLFormElement
      ).style.display = "none";
      (
        document.getElementById(
          "div" + currentFlashcard.toString()
        ) as HTMLFormElement
      ).style.display = "none";
      (
        document.getElementById(
          "div" + (currentFlashcard + 1).toString()
        ) as HTMLFormElement
      ).style.display = "block";
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
      .then((data) => {
        setFlashcards(data);
      });
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
        <React.Fragment>
          <div className="flashcard-progress">
            {flashcards.map((_, index) => (
              <div
                id={"circle" + index.toString()}
                key={index}
                className={`flashcard-progress-circle ${
                  index === currentFlashcard
                    ? "flashcard-progress-current"
                    : index < currentFlashcard
                    ? "flashcard-progress-filled"
                    : "flashcard-progress-empty"
                } ${
                  wrongAnswers.some(
                    (wrongAnswer) =>
                      wrongAnswer.one_side === flashcards[index].one_side &&
                      wrongAnswer.second_side === flashcards[index].second_side
                  )
                    ? "flashcard-progress-incorrect"
                    : correctAnswers.some(
                        (correctAnswer) =>
                          correctAnswer.one_side ===
                            flashcards[index].one_side &&
                          correctAnswer.second_side ===
                            flashcards[index].second_side
                      )
                    ? "flashcard-progress-correct"
                    : ""
                }`}
              ></div>
            ))}
          </div>

          {flashcards.map((flashcard, index) => (
            <div
              key={index}
              id={"div" + index.toString()}
              className="study-set-one-flashcard"
            >
              <div className="flashcard-study">{flashcard.one_side}</div>
              <div className="study-input">
                <input
                  type="text"
                  value={translation}
                  onChange={(event) => setTranslation(event.target.value)}
                  placeholder="Type translation here..."
                ></input>
              </div>
              <br />
              <div className="test-sets-section">
                <button
                  id={"btnCheck" + index.toString()}
                  className="start-check-next-button"
                  onClick={handleCheck}
                >
                  Check!
                </button>
                <div
                  id={"ansCorrect" + index.toString()}
                  className="study-set-one-flashcard-correct-answer"
                >
                  Correct!
                </div>
                <div
                  id={"ansWrong" + index.toString()}
                  className="study-set-one-flashcard-incorrect-answer"
                >
                  Correct answer: {flashcard.second_side}
                </div>
                <button
                  id={"btnNext" + index}
                  className="test-next-button"
                  onClick={handleNext}
                  // className="test-set-next-btn"
                >
                  Next
                </button>
              </div>
            </div>
          ))}
        </React.Fragment>
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
        {/* <div className="test-result-section"> */}
        <div id="results" className="test-result-section">
            <br />
            <div className="test-result-headline-section">
              Result: {score}/{flashcards.length} (
              {Math.round((100 * score) / flashcards.length)}%)
            </div>
            <br />
            <br />

          <div className="test-answers-block">
            Wrong answers:
            <br />
            {wrongAnswers.length === 0
              ? "None :)"
              : wrongAnswers.map((wrongAnswer, index) => (
                  <p style={{ color: "red" }} key={index}>
                    {wrongAnswer.one_side} - {wrongAnswer.second_side}, your
                    answer: {wrongAnswer.answer}
                  </p>
                ))}
          </div>
          <br />

          <div className="test-answers-block">
            Correct answers:
            <br />
            {correctAnswers.length === 0
              ? "None :("
              : correctAnswers.map((correctAnswer, index) => (
                  <p style={{ color: "lime" }} key={index}>
                    {correctAnswer.one_side} - {correctAnswer.second_side}
                  </p>
                ))}
          </div>
        <div className="test-answers-block-elem"></div>         
      </div>

      <div className="test-sets-section2">
        <div id="divAgain" className="test-button-back">
          <a href={"/test/" + id}>Again</a>
        </div>      
        <div className="test-button-back">
            <a href="/test">Back</a>
        </div>
      </div>
    </div>
  </div>
  );
}
