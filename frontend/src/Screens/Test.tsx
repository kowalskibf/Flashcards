import React, { useEffect, useState } from "react";
import { LANGUAGES } from "../Constants";

type Set = {
  id: number;
  title: string;
  description: string;
  language: string;
};

export default function Test() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sets, setSets] = useState<Set[]>([]);
  const [search, setSearch] = useState<string>("");
  const fetchSets = async () => {
    fetch("http://127.0.0.1:8000/api/sets/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setSets(data));
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
    <div className="test-main">
      <div className="test-section">
        <h1>Choose a set to test yourself</h1>
      </div>

      <div className="test-filter-by-language">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{ width: "50%", minWidth: "250px" }}
        >
          <option value="">All Languages</option>
          {LANGUAGES.map(([code, name, flag]) => (
            <option key={code} value={code}>
              {flag}&nbsp;{name}
            </option>
          ))}
        </select>{" "}
        <input
          className="searching"
          style={searchStyle}
          value={search}
          placeholder="Search sets..."
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </div>

      {filteredSets.length === 0 ? (
        <div>
          <br />
          <div className="test-empty-section">
            <div className="test-empty-section-elem">
              <div className="test-sets-section">
                <div className="test-empty-headline-section">
                  Seems <span className="span-test-empty-section"> empty</span>
                  ... Maybe...
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
        filteredSets.map((set, index) => (
          <div className="test-sets-section">
            <div className="test-set-button" key={index}>
              <a href={"/test/" + set.id}>
                <div className="test-details">
                  <h2>{set.title}</h2>
                </div>

                  <span>{set.description}</span>
                  {LANGUAGES.map(([code, name, flag]) =>
                    code === set.language ? (
                      <>
                        <br />
                        <span key={code}>
                          {flag}&nbsp;{name}
                        </span>
                      </>
                    ) : (
                      ""
                    )
                  )}
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const searchStyle = {
  marginTop: "20px",
  width: "50%",
};
