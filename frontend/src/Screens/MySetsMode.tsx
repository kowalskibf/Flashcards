import React, { useEffect, useState } from "react";

type SetType = {
  id: number;
  title: string;
  description: string;
};

export default function MySetsMode() {
  const [sets, setSets] = useState<SetType[]>([]);
  const fetchSets = async () => {
    // fetch flashcards from API
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

  return (
    <div className="mysets-holder">
      <div className="mysets-list-holder">
        <ul>
          {sets.length === 0 ? (
            <div>Empty</div>
          ) : (
            sets.map((set, index) => (
              <a
                key={index}
                href={"/my-sets/" + set.id + "/" + set.title}
              >
                <h2>{set.title}</h2>
                <span>{set.description}</span>
              </a>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
