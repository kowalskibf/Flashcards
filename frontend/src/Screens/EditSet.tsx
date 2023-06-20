import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import FlashcardsList from "../components/CreateSetFlashcards";
import { Link, useParams } from "react-router-dom";
import { LANGUAGES } from "../Constants";

type Set = {
  id: number;
  title: string;
  description: string;
};

type Params = {
  id: string;
};

export default function EditSet() {
  const { id } = useParams<Params>();
  const [title, setTitle] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFlashcardId, setSelectedFlashcardId] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const editSet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/api/set/" + id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        id: id,
        title: title,
        description: description,
        flashcards: selectedFlashcardId,
        language: selectedLanguage,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("it worked");
          (document.getElementById(
            "create-set-error"
          ) as HTMLFormElement).style.display = "none";
          (document.getElementById(
            "create-set-success"
          ) as HTMLFormElement).style.display = "block";
          window.scrollTo(0, 0);
        } else {
          (document.getElementById(
            "create-set-success"
          ) as HTMLFormElement).style.display = "none";
          (document.getElementById(
            "create-set-error"
          ) as HTMLFormElement).style.display = "block";
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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/set/all_data/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedFlashcardId(data.flashcards);
        setTitle(data.title);
        setDescription(data.description);
        setSelectedLanguage(data.language);
      });
  }, []);

  return (
    <div className="create-set-page-holder">
      <div id="create-set-success">Set edited successfully!</div>
      <div id="create-set-error">Some error occured.</div>
      <div className="create-set-textlabel-holder">Edit your study set</div>
      <form className="add-set-holder" onSubmit={editSet}>
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
          <button className="create-set-save-and-continue-button" type="submit">Save and continue</button>
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
              setID={id}
              searching={search}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </form>
      </div>
  );
}
