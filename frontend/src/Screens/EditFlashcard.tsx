import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LANGUAGES } from "../Constants";

type Flashcard = {
  id: number;
  title: string;
  one_side: string;
  second_side: string;
  language: string;
};

type Params = {
  id: string;
};

export default function EditFlashcard() {
  const [flashcard, setFlashcard] = useState<Flashcard | undefined>({
    id: 0,
    title: "Loading...",
    one_side: "Loading...",
    second_side: "Loading...",
    language: "",
  });
  const { id } = useParams<Params>();

  const editFlashcard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (flashcard === undefined) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/flashcard/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(flashcard),
        }
      );

      if (response.ok) {
        (document.getElementById("error") as HTMLFormElement).style.display =
          "none";
        (document.getElementById("success") as HTMLFormElement).style.display =
          "block";
      } else {
        (document.getElementById("success") as HTMLFormElement).style.display =
          "none";
        (document.getElementById("error") as HTMLFormElement).style.display =
          "block";
        console.log(response.status);
        throw Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFlashcard((prevFlashcard) => {
      if (prevFlashcard) {
        return {
          ...prevFlashcard,
          title: event.target.value,
        };
      }
      return prevFlashcard;
    });
  };

  const handleOneSideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFlashcard((prevFlashcard) => {
      if (prevFlashcard) {
        return {
          ...prevFlashcard,
          one_side: event.target.value,
        };
      }
      return prevFlashcard;
    });
  };

  const handleSecondSideChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFlashcard((prevFlashcard) => {
      if (prevFlashcard) {
        return {
          ...prevFlashcard,
          second_side: event.target.value,
        };
      }
      return prevFlashcard;
    });
  };

  const handleLanguageChange = (event: { target: { value: any } }) => {
    setFlashcard((prevFlashcard) => {
      if (prevFlashcard) {
        return {
          ...prevFlashcard,
          language: event.target.value,
        };
      }
      return prevFlashcard;
    });
  };
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/flashcard/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFlashcard(data));
  }, []);

  return (
    <div className="edit-flashcard-container">
      {flashcard === undefined ? (
        <h1>Loading...</h1>
      ) : (
        <React.Fragment>
          <div>
            <div id="success">Card edited successfully!</div>
            <div id="error">Some error occurred.</div>
            <div>
              <a href="/my-flashcards">
                <button className="edit-flashcard-button">Back to my flashcards</button>
              </a>
            </div>

            <form onSubmit={editFlashcard}>
              <div className="edit-flashcard-main">
                <div className="add-card-textlabel-holder">Title:</div>
                <input
                  className="edit-flashcard-input"
                  type="text"
                  id="title-box"
                  name="title"
                  placeholder="Type title here..."
                  value={flashcard.title}
                  onChange={handleTitleChange}
                />
                <div className="add-card-textlabel-holder">Word:</div>
                <input
                  className="edit-flashcard-input"
                  type="text"
                  id="word-box"
                  name="word"
                  placeholder="Type new word here..."
                  value={flashcard.one_side}
                  onChange={handleOneSideChange}
                />
                <div className="add-card-textlabel-holder">Translation:</div>
                <input
                  className="edit-flashcard-input"
                  type="text"
                  id="trans-box"
                  name="translation"
                  placeholder="Type translation here..."
                  value={flashcard.second_side}
                  onChange={handleSecondSideChange}
                />
                <div className="add-card-textlabel-holder">Language:</div>
                <div className="edit-flashcard-language">
                <select
                  className="edit-flashcard-language"
                  value={flashcard.language || ""}
                  onChange={handleLanguageChange}
                >
                  <option value="">None</option>
                  {LANGUAGES.map(([code, name, flag]) => (
                    <option key={code} value={code}>
                      {flag}&nbsp;{name}
                    </option>
                  ))}
                </select>
              </div>

                <button className="edit-flashcard-button" type="submit">Save and continue</button>
              </div>
            </form>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}


