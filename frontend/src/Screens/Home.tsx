// import React from "react";
import React, { useEffect, useState } from "react";
import "../App.css";


type User = {
  email: string;
  id: number;
  username: string;
};

type Stats = {
  sets: number;
  flashcards: number;
};


export default function Home() {

  const [user, setUser] = useState<User>();
  const fetchUser = async () => {
    fetch("http://127.0.0.1:8000/api/auth/users/me/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        console.log(data);
      });
  };

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

  useEffect(() => {
    fetchUser();
  }, []);

  if (user === undefined) {
    return (
      <div>
        <div className="skeleton"></div>
      </div>
    );
  }

  return (
    <div className="home-main">
        <div className="home-main-container">
            <div className="home-main-section home-main-section-left">
              <div className="home-main-section-left-elem home-main-section-left-elem-top">
                <span className="home-main-section-left-username-span">
                  Hello, <span className="home-main-section-left-username">{user.username}</span>!
                </span>
              </div>
              <div className="home-main-section-left-elem">
                <a href="/profile"><span className="home-link-span">Profile</span></a>
              </div>
              <div className="home-main-section-left-elem">
                <a href="/change-password"><span className="home-link-span">Change Password</span></a>
              </div>
              <div className="home-main-section-left-elem">
                <a href="/my-flashcards"><span className="home-link-span">My Flashcards</span></a>
              </div>
              <div className="home-main-section-left-elem">
                <a href="/my-sets"><span className="home-link-span">My Sets</span></a>
              </div>
              <div className="home-main-section-left-elem">
                <a onClick={handleLogout}><span className="home-link-span home-link-span-logout">Log out</span></a>
              </div>
            </div>
            <div className="home-main-section home-main-section-right">
              <div className="home-main-section-right-container">
                <div className="home-main-section-right-top-elem-container">
                  <div className="home-main-section-right-top-elem">
                    <div className="home-main-section-right-top-elem-header">
                      Want to learn new words from <span className="span-secondary-color">scratch</span>?
                    </div>
                    <div className="home-main-section-right-top-elem-link">
                      <a href="/study-mode">
                        <button className="home-main-section-right-top-elem-button">
                          Study mode
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="home-main-section-right-top-elem-container">
                  <div className="home-main-section-right-top-elem">
                    <div className="home-main-section-right-top-elem-header">
                      Already <span className="span-secondary-color">experienced</span> with your flashcards?
                    </div>
                    <div className="home-main-section-right-top-elem-link">
                      <a href="/study">
                        <button className="home-main-section-right-top-elem-button">
                          Writing mode
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="home-main-section-right-top-elem-container">
                  <div className="home-main-section-right-top-elem">
                    <div className="home-main-section-right-top-elem-header">
                      Want to <span className="span-secondary-color">test</span> yourself?
                    </div>
                    <div className="home-main-section-right-top-elem-link">
                      <a href="/test">
                        <button className="home-main-section-right-top-elem-button">
                          Test mode
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="home-main-section-right-container">
                <div className="home-main-section-right-mid-elem-container">
                  <div className="home-main-section-right-mid-elem">
                    <div className="home-main-section-right-mid-elem-header">
                      Want to <span className="span-secondary-color">see</span> your flashcards <span className="span-secondary-color">sets</span>?
                    </div>
                    <div className="home-main-section-right-mid-elem-link">
                      <a href="/my-sets">
                        <button className="home-main-section-right-top-elem-button">
                          My Sets
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="home-main-section-right-mid-elem-container">
                <div className="home-main-section-right-mid-elem">
                    <div className="home-main-section-right-mid-elem-header">
                      Want to <span className="span-secondary-color">see</span> your <span className="span-secondary-color">flashcards</span>?
                    </div>
                    <div className="home-main-section-right-mid-elem-link">
                      <a href="/my-flashcards">
                        <button className="home-main-section-right-top-elem-button">
                          My Flashcards
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="home-main-section-right-container">
                <div className="home-main-section-right-mid-elem-container">
                  <div className="home-main-section-right-mid-elem">
                    <div className="home-main-section-right-mid-elem-header">
                      Want to <span className="span-secondary-color">create</span> a new flashcards <span className="span-secondary-color">set</span>?
                    </div>
                    <div className="home-main-section-right-mid-elem-link">
                      <a href="/createSet">
                        <button className="home-main-section-right-top-elem-button">
                          Create Set
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="home-main-section-right-mid-elem-container">
                <div className="home-main-section-right-mid-elem">
                    <div className="home-main-section-right-mid-elem-header">
                      Want to <span className="span-secondary-color">create</span> a new <span className="span-secondary-color">flashcard</span>?
                    </div>
                    <div className="home-main-section-right-mid-elem-link">
                      <a href="/flashcard/add">
                        <button className="home-main-section-right-top-elem-button">
                          Create Flashcard
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
  );
};
