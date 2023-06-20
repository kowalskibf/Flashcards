import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { LANGUAGES } from "../Constants";

export default function AddFlashcard() {
  const [title, setTitle] = useState<string>("");
  const [one_side, setOneSide] = useState<string>("");
  const [second_side, setSecondSide] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const add = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Make a request to your API to check if the credentials are valid
    const response = await fetch("http://127.0.0.1:8000/api/flashcard", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: title,
        one_side: one_side,
        second_side: second_side,
        language: selectedLanguage,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("it worked");
          setTitle("");
          setOneSide("");
          setSecondSide("");
          setSelectedLanguage("");
          const info_success = document.getElementById(
            "create-card-success"
          ) as HTMLFormElement;
          info_success.style.display = "block";
          window.scrollTo(0, 0);
        } else {
          const info_error = document.getElementById(
            "create-card-error"
          ) as HTMLFormElement;
          info_error.style.display = "block";
          window.scrollTo(0, 0);
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div>
      <div id="create-card-success">Card created successfully!</div>
      <div id="create-card-error">Some error occurred.</div>
      <form onSubmit={add}>
        <div className="add-card-textlabel-holder-header">
          <br/>Create a new flashcard
        </div>
        <div className="edit-flashcard-main">
          <div className="add-card-textlabel-holder"><br/>Title:</div>
          <input
            className="edit-flashcard-input"
            type="text"
            id="title-box"
            name="title"
            placeholder="Title of your new flashcard"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <div className="add-card-textlabel-holder">Word:</div>
          <input
            className="edit-flashcard-input"
            type="text"
            id="word-box"
            name="word"
            placeholder="This will appear on the screen"
            value={one_side}
            onChange={(event) => setOneSide(event.target.value)}
          />
          <div className="add-card-textlabel-holder">Translation:</div>
          <input
            className="edit-flashcard-input"
            type="text"
            id="trans-box"
            name="translation"
            placeholder="This you will have to write"
            value={second_side}
            onChange={(event) => setSecondSide(event.target.value)}
          />
          <div className="edit-flashcard-language">
          <div className="add-card-textlabel-holder">Language:</div>
          <select
            value={selectedLanguage || ""}
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
  );
}
