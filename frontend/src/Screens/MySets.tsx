import React, { useEffect, useState } from "react";
import { LANGUAGES } from "../Constants";

type SetType = {
  id: number;
  title: string;
  description: string;
  language: string;
};

export default function MySets() {
  const [index_of_set_to_delete, setIndexOfSetToDelete] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [search, setSearch] = useState<string>("");

  const deleteSet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(
      "http://127.0.0.1:8000/api/set/" + index_of_set_to_delete,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          index_of_set_to_delete: index_of_set_to_delete,
        }),
      }
    );

    if (response.ok) {
      const setElement = document.querySelector(
        '[data-set-index="' + index_of_set_to_delete.toString() + '"]'
      ) as HTMLDivElement;
      if (setElement) {
        setElement.remove();
      }
    } else {
      throw new Error("Something went wrong");
    }
  };

  const [sets, setSets] = useState<SetType[]>([]);
  const fetchSets = async () => {
    // fetch flashcards from API
    const response = await fetch("http://127.0.0.1:8000/api/sets/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setSets(data);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const filteredSets = sets
    .filter(
      (set) => set.language === selectedLanguage || selectedLanguage === ""
    )
    .filter(
      (set) => set.title.includes(search) || set.description.includes(search)
    );

  return (
    <div className="mysets-holder">
      <div className="create-set-textlabel-holder">
        <br />
        My Sets
      </div>
      <div className="mysets-list-holder">
        <div className="my-sets-filter-by-language">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
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
            }}
          />
        </div>
        <ul>
          {filteredSets.length === 0 ? (
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
                  <a href="/createSet">Create a new Set</a>
                </div>
              </div>
            </div>
          </div>
          ) : (
            filteredSets.map((set) => (
              <div className="my-sets-main">

              <div
                className="set-plus-delete-btn-holder"
                key={set.id}
                data-set-index={set.id}
              >

                <div className="my-sets-one-set-info">
                  <h2>{set.title}</h2>
                  {LANGUAGES.map(([code, name, flag]) =>
                    code === set.language ? (
                      <span style={{ display: "block" }} key={code}>
                        {flag}&nbsp;{name}
                      </span>
                    ) : (
                      ""
                    )
                  )}
                  <span>{set.description}</span>
                </div>

                <div className="my-sets-one-set-20p">
                  <a href={"/set/" + set.id + "/edit"}>
                    <button className="my-sets-edit-btn">Edit</button>
                  </a>
                </div>

                <div className="my-sets-one-set-20p">
                  <form onSubmit={deleteSet}>
                    <input type="hidden" value={set.id} />
                    <button
                      className="my-sets-delete-btn"
                      type="submit"
                      onClick={(event) => setIndexOfSetToDelete(set.id)}
                    >
                      Delete
                    </button>
                  </form>
                </div>
                </div>
              </div>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

const searchStyle = {
  marginTop: 0,
};
