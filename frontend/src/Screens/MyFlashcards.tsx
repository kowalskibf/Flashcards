import React, { useEffect, useState } from "react";
import { LANGUAGES } from "../Constants";

type Flashcard = {
  id: number;
  title: string;
  one_side: string;
  second_side: string;
  language: string;
};

const flashcardsPerPage = 5;

export default function MyFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [search, setSearch] = useState<string>("");

  const fetchFlashcards = async () => {
    // fetch flashcards from API
    fetch("http://127.0.0.1:8000/api/my-flashcards", {
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
    fetchFlashcards();
  }, []);

  const filteredFlashcards = flashcards
    .filter(
      (flashcard) =>
        flashcard.language === selectedLanguage || selectedLanguage === ""
    )
    .filter(
      (flashcard) =>
        flashcard.title.includes(search) ||
        flashcard.one_side.includes(search) ||
        flashcard.second_side.includes(search)
    );

  // Calculate indexes of the first and last flashcards on the current page
  const indexOfLastFlashcard = currentPage * flashcardsPerPage;
  const indexOfFirstFlashcard = indexOfLastFlashcard - flashcardsPerPage;
  const currentFlashcards = filteredFlashcards.slice(
    indexOfFirstFlashcard,
    indexOfLastFlashcard
  );

  const deleteFlashcard = async (
    event: React.FormEvent<HTMLFormElement>,
    flashcardId: number
  ) => {
    event.preventDefault();
    const response = await fetch(
      "http://127.0.0.1:8000/api/flashcard/" + flashcardId,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          index_of_flashcard_to_delete: flashcardId,
        }),
      }
    );

    if (response.ok) {
      setFlashcards(
        flashcards.filter((flashcard) => flashcard.id !== flashcardId)
      );
    } else {
      console.log(response.status);
      throw new Error("Something went wrong");
    }
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };



  return (
    <div className="myflashcards-holder">
      <div className="my-flashcards-textlabel-holder">
        My Flashcards
        <br />
        &nbsp;
      </div>
      <div className="my-flashcards-filter-by-language">
        <select
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Languages</option>
          {LANGUAGES.map(([code, name, flag]) => (
            <option key={code} value={code}>
              {flag}&nbsp;{name}
            </option>
          ))}
        </select>
        <input
          className="searching"
          style={searchStyle}
          value={search}
          placeholder="Search..."
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      
        {filteredFlashcards.length === 0 ? (
          <div>
          <br />
          <div className="test-empty-section">
            <div className="test-empty-section-elem">
              <div className="test-sets-section">
                <div className="test-empty-headline-section">
                  Seems <span className="span-test-empty-section"> empty</span>...
                  Maybe...
                </div>
              </div>
            </div>
            <div className="test-empty-section-elem">         
              <div className="test-button-holder">
                <a href="/flashcard/add">Create a new Flashcard</a>
              </div>
            </div>
          </div>
        </div>

        ) : (
      <div className="myflashcards-list-holder">

          <>
            <ul className="my-flashcards-list">
              {currentFlashcards
                .filter((flashcard) => {
                  const searchTermLowercase = search.toLowerCase();
                  const titleLowercase = flashcard.title.toLowerCase();
                  const oneSideLowercase = flashcard.one_side.toLowerCase();
                  const secondSideLowercase =
                    flashcard.second_side.toLowerCase();

                  return (
                    titleLowercase.includes(searchTermLowercase) ||
                    oneSideLowercase.includes(searchTermLowercase) ||
                    secondSideLowercase.includes(searchTermLowercase)
                  );
                })
                .map((flashcard) => (
                  <div
                    className="flashcard-edit-btn-delete-btn-holder"
                    key={flashcard.id}
                    data-flashcard-index={flashcard.id}
                  >
                    <div className="my-flashcards-flashcard-details">
                      <h2>{flashcard.title}</h2>
                      {LANGUAGES.map(([code, name, flag]) =>
                        code === flashcard.language ? (
                          <span key={code}>
                            {flag}&nbsp;{name}
                          </span>
                        ) : (
                          ""
                        )
                      )}
                      <span>{flashcard.one_side}</span>
                      <span>{flashcard.second_side}</span>
                    </div>
                    <div className="myflashcards-buttons-section">
                      {/* <div className="edit-delete-btns-holder"> */}
                        <div className="my-flashcard-edit-btn">
                          <a
                            key={flashcard.id}
                            href={"/flashcard/edit/" + flashcard.id}
                          >
                            <button>Edit</button>
                          </a>
                        </div>

                        <form
                          onSubmit={(event) =>
                            deleteFlashcard(event, flashcard.id)
                          }
                        >
                          <input type="hidden" value={flashcard.id} />
                          
                          <button
                            className="delete-flashcard-btn"
                            type="submit">
                            Delete
                          </button>
                        </form>
                      </div>
                    {/* </div> */}
                  </div>
                ))}
            </ul>
          </>
      </div>
        )}
      <div className="pagination">
        {Array.from(
          Array(Math.ceil(filteredFlashcards.length / flashcardsPerPage)).keys()
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => paginate(pageNumber + 1)}
            className={`pagination-button ${
              currentPage === pageNumber + 1 ? "active" : ""
            }`}
          >
            {pageNumber + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

const searchStyle = {
  margin: 0,
};
