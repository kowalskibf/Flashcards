import React, { useEffect, useState } from "react";
import "../App.css";
import BadgeSvg from "../components/BadgeSvg";

type User = {
  email: string;
  id: number;
  username: string;
};

type Stats = {
  created_flashcards: number;
  created_sets: number;
  finished_tests: number;
  passed_tests: number;
  total_languages: number;
};

type Badge = {
  name: string;
  desc: string;
  count: number;
  level: number;
  fill: (string | undefined)[];
  levels: (number | undefined)[];
};

export default function Profile() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [user, setUser] = useState<User>();
  const [stats, setStats] = useState<Stats>();

  const flashcardsBadgeLevels = [0, 1, 5, 20, 50, 100];
  const setsBadgeLevels = [0, 1, 3, 5, 10, 20];
  const learnerBadgeLevels = [0, 1, 5, 20, 50, 100];
  const polyglotBadgeLevels = [0, 1, 3, 5, 10, 20];
  const experiencedBadgeLevels = [0, 1, 3, 5, 10, 20];

  const flashcardsToBadgeLevel = (flashcards: any) => {
    if (flashcards === 0) {
      return 0;
    }
    if (flashcards < 5) {
      return 1;
    }
    if (flashcards < 20) {
      return 2;
    }
    if (flashcards < 50) {
      return 3;
    }
    if (flashcards < 100) {
      return 4;
    } else {
      return 5;
    }
  };

  const setsToBadgeLevel = (sets: any) => {
    if (sets === 0) {
      return 0;
    }
    if (sets < 3) {
      return 1;
    }
    if (sets < 5) {
      return 2;
    }
    if (sets < 10) {
      return 3;
    }
    if (sets < 20) {
      return 4;
    } else {
      return 5;
    }
  };

  const learnerToBadgeLevel = (sets: any) => {
    if (sets === 0) {
      return 0;
    }
    if (sets < 5) {
      return 1;
    }
    if (sets < 20) {
      return 2;
    }
    if (sets < 50) {
      return 3;
    }
    if (sets < 100) {
      return 4;
    } else {
      return 5;
    }
  };

  const polyglotToBadgeLevel = (sets: any) => {
    if (sets === 0) {
      return 0;
    }
    if (sets < 3) {
      return 1;
    }
    if (sets < 5) {
      return 2;
    }
    if (sets < 10) {
      return 3;
    }
    if (sets < 20) {
      return 4;
    } else {
      return 5;
    }
  };

  const experiencedToBadgeLevel = (sets: any) => {
    if (sets === 0) {
      return 0;
    }
    if (sets < 3) {
      return 1;
    }
    if (sets < 5) {
      return 2;
    }
    if (sets < 10) {
      return 3;
    }
    if (sets < 20) {
      return 4;
    } else {
      return 5;
    }
  };

  const flashcardsFillGenerator = (n: any, flashcards: any) => {
    for (let i = 1; i <= 5; i++) {
      if (n == i) {
        if (flashcards >= flashcardsBadgeLevels[i]) {
          return "100%";
        }
        if (flashcards < flashcardsBadgeLevels[i - 1]) {
          return "0%";
        }
        return (
          (
            100 *
            ((flashcards - flashcardsBadgeLevels[i - 1]) /
              (flashcardsBadgeLevels[i] - flashcardsBadgeLevels[i - 1]))
          ).toString() + "%"
        );
      }
    }
  };

  const setsFillGenerator = (n: any, sets: any) => {
    for (let i = 1; i <= 5; i++) {
      if (n == i) {
        if (sets >= setsBadgeLevels[i]) {
          return "100%";
        }
        if (sets < setsBadgeLevels[i - 1]) {
          return "0%";
        }
        return (
          (
            100 *
            ((sets - setsBadgeLevels[i - 1]) /
              (setsBadgeLevels[i] - setsBadgeLevels[i - 1]))
          ).toString() + "%"
        );
      }
    }
  };

  const learnerFillGenerator = (n: any, tests: any) => {
    for (let i = 1; i <= 5; i++) {
      if (n == i) {
        if (tests >= learnerBadgeLevels[i]) {
          return "100%";
        }
        if (tests < learnerBadgeLevels[i - 1]) {
          return "0%";
        }
        return (
          (
            100 *
            ((tests - learnerBadgeLevels[i - 1]) /
              (learnerBadgeLevels[i] - learnerBadgeLevels[i - 1]))
          ).toString() + "%"
        );
      }
    }
  };

  const polyglotFillGenerator = (n: any, langs: any) => {
    for (let i = 1; i <= 5; i++) {
      if (n == i) {
        if (langs >= polyglotBadgeLevels[i]) {
          return "100%";
        }
        if (langs < polyglotBadgeLevels[i - 1]) {
          return "0%";
        }
        return (
          (
            100 *
            ((langs - polyglotBadgeLevels[i - 1]) /
              (polyglotBadgeLevels[i] - polyglotBadgeLevels[i - 1]))
          ).toString() + "%"
        );
      }
    }
  };

  const experiencedFillGenerator = (n: any, tests: any) => {
    for (let i = 1; i <= 5; i++) {
      if (n == i) {
        if (tests >= experiencedBadgeLevels[i]) {
          return "100%";
        }
        if (tests < experiencedBadgeLevels[i - 1]) {
          return "0%";
        }
        return (
          (
            100 *
            ((tests - experiencedBadgeLevels[i - 1]) /
              (experiencedBadgeLevels[i] - experiencedBadgeLevels[i - 1]))
          ).toString() + "%"
        );
      }
    }
  };

  const fetchUser = async () => {
    // fetch flashcards from API
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

  const fetchUserStats = async () => {
    // fetch flashcards from API
    fetch("http://127.0.0.1:8000/api/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const flashcardsBadgeLevels = [0, 1, 5, 20, 50, 100];
        const setsBadgeLevels = [0, 1, 3, 5, 10, 20];
        const learnerBadgeLevels = [0, 1, 5, 20, 50, 100];
        const polyglotBadgeLevels = [0, 1, 3, 5, 10, 20];
        const experiencedBadgeLevels = [0, 1, 3, 5, 10, 20];
        setStats(data);
        setBadges([
          {
            name: "Creator",
            desc: "Upgrade your Creator Badge by creating flashcards!",
            count: data["created_flashcards"],
            level: flashcardsToBadgeLevel(data["created_flashcards"]),
            fill: [
              flashcardsFillGenerator(1, data["created_flashcards"]),
              flashcardsFillGenerator(2, data["created_flashcards"]),
              flashcardsFillGenerator(3, data["created_flashcards"]),
              flashcardsFillGenerator(4, data["created_flashcards"]),
              flashcardsFillGenerator(5, data["created_flashcards"]),
            ],
            levels: [1, 5, 20, 50, 100],
          },
          {
            name: "Categorizer",
            desc: "Upgrade your Categorizer Badge by creating sets!",
            count: data["created_sets"],
            level: setsToBadgeLevel(data["created_sets"]),
            fill: [
              setsFillGenerator(1, data["created_sets"]),
              setsFillGenerator(2, data["created_sets"]),
              setsFillGenerator(3, data["created_sets"]),
              setsFillGenerator(4, data["created_sets"]),
              setsFillGenerator(5, data["created_sets"]),
            ],
            levels: [1, 3, 5, 10, 20],
          },
          {
            name: "Learner",
            desc: "Upgrade your Learner Badge by finishing tests!",
            count: data["finished_tests"],
            level: learnerToBadgeLevel(data["finished_tests"]),
            fill: [
              learnerFillGenerator(1, data["finished_tests"]),
              learnerFillGenerator(2, data["finished_tests"]),
              learnerFillGenerator(3, data["finished_tests"]),
              learnerFillGenerator(4, data["finished_tests"]),
              learnerFillGenerator(5, data["finished_tests"]),
            ],
            levels: [1, 5, 20, 50, 100],
          },
          {
            name: "Polyglot",
            desc: "Upgrade your Polyglot Badge by learning more unique languages!",
            count: data["total_languages"],
            level: polyglotToBadgeLevel(data["total_languages"]),
            fill: [
              polyglotFillGenerator(1, data["total_languages"]),
              polyglotFillGenerator(2, data["total_languages"]),
              polyglotFillGenerator(3, data["total_languages"]),
              polyglotFillGenerator(4, data["total_languages"]),
              polyglotFillGenerator(5, data["total_languages"]),
            ],
            levels: [1, 3, 5, 10, 20],
          },
          {
            name: "Experienced",
            desc: "Upgrade your Experienced Badge by scoring at least 80% at tests!",
            count: data["passed_tests"],
            level: polyglotToBadgeLevel(data["passed_tests"]),
            fill: [
              polyglotFillGenerator(1, data["passed_tests"]),
              polyglotFillGenerator(2, data["passed_tests"]),
              polyglotFillGenerator(3, data["passed_tests"]),
              polyglotFillGenerator(4, data["passed_tests"]),
              polyglotFillGenerator(5, data["passed_tests"]),
            ],
            levels: [1, 3, 5, 10, 20],
          },
        ]);
      });
  };

  useEffect(() => {
    fetchUser();
    fetchUserStats();
  }, []);

  if (user === undefined || stats === undefined || badges === undefined) {
    return (
      <div>
        <div className="skeleton"></div>
        <div className="skeleton"></div>
        <div className="skeleton"></div>
        <div className="skeleton"></div>
      </div>
    );
  }

  return (
    <div className="profile-main">
      <div className="profile-section">
        <div className="profile-achievements-header">Profile</div>
        <div className="profile-top-half">
          <div className="profile-top-half-container">
            <div className="profile-top-half-elem">
              <div className="profile-top-half-elem-key">
                <span className="profile-gray">Username: </span>
              </div>
              <div className="profile-top-half-elem-value">
                {user.username}
                <span className="profile-gray">#{user.id}</span>
              </div>
            </div>
            <div className="profile-top-half-elem">
              <div className="profile-top-half-elem-key">
                <span className="profile-gray">E-mail: </span>
              </div>
              <div className="profile-top-half-elem-value">
                {user.email === "" ? "not set" : user.email}
              </div>
            </div>
            <div className="profile-top-half-elem">&nbsp;</div>
            <div className="profile-top-half-elem">
              <div className="profile-change-password">
                <a href="/change-password">
                  <span className="profile-secondary-color">
                    Change Password
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-top-half">
          <div className="profile-top-half-container">
            <div className="profile-top-half-elem">
              <div className="profile-top-half-elem-key">
                <span className="profile-gray">Flashcards: </span>
              </div>
              <div className="profile-top-half-elem-value">
                {stats.created_flashcards}
              </div>
            </div>
            <div className="profile-top-half-elem">
              <div className="profile-top-half-elem-key">
                <span className="profile-gray">Sets: </span>
              </div>
              <div className="profile-top-half-elem-value">
                {stats.created_sets}
              </div>
            </div>
            <div className="profile-top-half-elem">
              <div className="profile-top-half-elem-key">
                <span className="profile-gray">Tests: </span>
              </div>
              <div className="profile-top-half-elem-value">
                {stats.finished_tests}
              </div>
            </div>
            <div className="profile-top-half-elem">
              <div className="profile-top-half-elem-key">
                <span className="profile-gray">Laguages: </span>
              </div>
              <div className="profile-top-half-elem-value">
                {stats.total_languages}
              </div>
            </div>
            <div className="profile-top-half-elem">
              <div className="profile-top-half-elem-key">
                <span className="profile-gray">Passed tests: </span>
              </div>
              <div className="profile-top-half-elem-value">
                {stats.passed_tests}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-achievements">
          <div className="profile-achievements-header">Achievements</div>
          {badges.map((badge) => (
            <div className="profile-achievement-container">
              <div className="profile-achievement-header">{badge.name}</div>
              <div className="profile-achievement-desc">
                <span className="profile-gray">{badge.desc}</span>
              </div>
              <div className="profile-achievement-main">
                <div className="profile-achievement-level">
                  Your current {badge.name} Badge level: {badge.level}
                </div>
                <div className="profile-achievement-bar-legend">
                  {(() => {
                    const divs = [];
                    for (let i = 0; i < 5; i++) {
                      divs.push(
                        <div
                          id={badge.name + i.toString()}
                          className="profile-achievement-bar-legend-part"
                        >
                          {badge.levels[i]}
                        </div>
                      );
                    }
                    return divs;
                  })()}
                </div>
                <div className="profile-achievement-bar">
                  {(() => {
                    const divs = [];
                    for (let i = 0; i < 5; i++) {
                      divs.push(
                        <div
                          id={badge.name + i.toString()}
                          className="profile-achievement-bar-part"
                        >
                          <div
                            id={badge.name + i.toString() + "inside"}
                            className="profile-achievement-bar-part-inside"
                            style={{ width: badge.fill[i] }}
                          >
                            &nbsp;
                          </div>
                        </div>
                      );
                    }
                    return divs;
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
