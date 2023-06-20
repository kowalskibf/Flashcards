import React from "react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const logout = () => {
    let url = "http://127.0.0.1:8000/api-token-logout/";
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (response.ok) {
        localStorage.clear();
        console.log("Logout successful");
      } else {
        console.log("invalid data");
      }
    });
  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
    window.location.replace("/login");
  };

  const [freeAccessPages, setFreeAccessPages] = useState<string[]>(["/login", "/register", "/"]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/my-flashcards", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if(!response.ok && !freeAccessPages.includes(window.location.pathname))
        {
          window.location.replace("/login");
        }
      });
  }, []);

  return (
    <nav className="nav">
      <a href="/home" className="return-home">
        Home
      </a>
      <ul>
        <li>
          <a href="/profile">Profile</a>
        </li>
        {/* <li>
          <a href="#">Info</a>
        </li> */}
        <li>
          <a href="#" onClick={handleLogout}>
            Log out
          </a>
        </li>
      </ul>
    </nav>
  );
}
