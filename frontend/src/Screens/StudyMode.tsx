import React, { useState, useEffect } from "react";
import { Button, Typography } from "@material-ui/core";
import SingleFlipCard from "../components/SingleFlipCard";
import { LANGUAGES } from "../Constants";

type FlashCard = {
  id: number;
  title: string;
  one_side: string;
  second_side: string;
  language: string;
  set_flashcards: number;
  set_flashcards_title: string;
  set_flashcards_language: string;
};

export default function StudyMode() {
  const [index, setIndex] = useState<number>(0);
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedSet, setSelectedSet] = useState<number | null>(null);

  useEffect(() => {
    // fetch flashcards from API
    fetch("http://127.0.0.1:8000/api/flashcards/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFlashcards(data));
  }, []);

  const uniqueSets = Array.from(
    new Set(flashcards.map((flashcard) => flashcard.set_flashcards))
  ).filter((set) => set !== null);

  const filteredSets = selectedLanguage
    ? uniqueSets.filter((set) =>
        flashcards.some(
          (flashcard) =>
            flashcard.set_flashcards === set &&
            flashcard.language === selectedLanguage
        )
      )
    : uniqueSets;

  const filteredFlashcards = flashcards.filter(
    (flashcard) =>
      (flashcard.language === selectedLanguage || selectedLanguage === "") &&
      (flashcard.set_flashcards === selectedSet || selectedSet === null)
  );

  const handleClickNext = () => {
    setIndex((index + 1) % filteredFlashcards.length);
  };

  const handleClickPrev = () => {
    setIndex((index === 0 ? filteredFlashcards.length : index) - 1);
  };

  return (
    <div className="study-card-holder">
      <React.Fragment>
        {/* <Typography variant="h4" gutterBottom align="center">
          Study Mode:
        </Typography> */}
        <div className="create-set-textlabel-holder">
          <br />
          Study mode
        </div>

        <div className="study-mode-filter-by-language">
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              setSelectedSet(null); // Reset selected set when language changes
              setIndex(0);
            }}
            disabled={selectedSet !== null}
          >
            <option value="">All Languages</option>
            {LANGUAGES.map(([code, name, flag]) => (
              <option key={code} value={code}>
                {flag}&nbsp;{name}
              </option>
            ))}
          </select>
        </div>

        <div className="study-mode-filter-by-language">
          <select
            value={selectedSet || ""}
            style={{ marginTop: 0 }}
            onChange={(e) => {
              setSelectedSet(e.target.value ? parseInt(e.target.value) : null);
              setIndex(0);
            }}
          >
            <option value="">All Sets</option>
            {filteredSets.map((set) => {
              const setFlashcard = flashcards.find(
                (flashcard) =>
                  flashcard.set_flashcards === set &&
                  (!selectedLanguage || flashcard.language === selectedLanguage)
              );
              // Get the language flag for the set if available
              const setLanguageFlag =
                LANGUAGES.find(
                  ([code, name, flag]) =>
                    setFlashcard &&
                    code === setFlashcard.set_flashcards_language
                )?.[2] ?? "";

              return (
                <option key={set} value={set}>
                  {setLanguageFlag}{" "}
                  {setFlashcard && setFlashcard.set_flashcards_title}
                </option>
              );
            })}
          </select>
        </div>
        {filteredFlashcards.length !== 0 ? (
          <div className="flipcard-border-placeholder">
            <div className="flipcard-place-holder">
              <div className="study-mode-prev-next-button">
                <button
                  onClick={handleClickPrev}
                  disabled={filteredFlashcards.length <= 1}
                >
                  Prev
                </button>
              </div>
              <div className="study-mode-flashcard">
                <SingleFlipCard
                  id={filteredFlashcards[index].id}
                  title={filteredFlashcards[index].title}
                  one_side={filteredFlashcards[index].one_side}
                  second_side={filteredFlashcards[index].second_side}
                />
              </div>
              <div className="study-mode-prev-next-button">
                <button
                  onClick={handleClickNext}
                  disabled={filteredFlashcards.length <= 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mysets-holder">
            <div className="empty-sets-holder">
              <div className="empty-text-holder">Seems empty... Maybe... </div>
              <a href="/flashcard/add">
                <h1>Create a new Flashcard</h1>
              </a>
              {/* // <h2>No flashcards</h2> */}
            </div>
          </div>
        )}
      </React.Fragment>
    </div>
  );
}
