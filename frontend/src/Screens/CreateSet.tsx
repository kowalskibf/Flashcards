import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import FlashcardsList from "../components/CreateSetFlashcards";
import { LANGUAGES } from "../Constants";

export default function CreateSet() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectedFlashcardId, setSelectedFlashcardId] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const add = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Make a request to your API to check if the credentials are valid
    const response = await fetch("http://127.0.0.1:8000/api/set", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        flashcards: selectedFlashcardId,
        language: selectedLanguage,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("it worked");
          setTitle("");
          setDescription("");
          setSelectedFlashcardId([]);
          setSelectedLanguage("");
          const info_success = document.getElementById(
            "create-set-success"
          ) as HTMLFormElement;
          info_success.style.display = "block";
          window.scrollTo(0, 0);
        } else {
          const info_error = document.getElementById(
            "create-set-error"
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
  const toggleSetSelectedFlashcardId = (id: number) => {
    if (selectedFlashcardId.includes(id)) {
      setSelectedFlashcardId(
        selectedFlashcardId.filter((flashcardId) => flashcardId !== id)
      );
    } else {
      setSelectedFlashcardId([...selectedFlashcardId, id]);
    }
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div className="create-set-page-holder">
      <div id="create-set-success">Set created successfully!</div>
      <div id="create-set-error">Some error occured.</div>
      <div className="create-set-textlabel-holder">Create a new study set</div>
      <div className="add-set-holder">
        <div className="create-set-title-description-holder">
          <div className="create-set-textlabel-holder">Title:</div>
          <input
            type="text"
            id="title-box"
            name="title"
            placeholder="Type title here..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <div className="create-set-textlabel-holder">Description:</div>
          <input
            type="text"
            id="word-box"
            name="Description"
            placeholder="Type description here..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="create-set-textlabel-holder">Language:</div>
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
        <div className="create-set-right-side">
          <input
            className="searching"
            value={search}
            placeholder="Search flashcards..."
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="create-set-flashcards-list">
            <FlashcardsList
              toggle={toggleSetSelectedFlashcardId}
              selectedFlashcardId={selectedFlashcardId}
              searching={search}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              language={selectedLanguage}
            />
          </div>
          <button
            className="create-set-save-and-continue-button"
            type="button"
            onClick={add}
          >
            Save and continue
          </button>
        </div>
      </div>
    </div>
  );
}
