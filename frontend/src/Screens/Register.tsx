import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const validUsername = new RegExp("^([a-z0-9]{1,25})$");

  const logIn = async (username: string, password: string) => {
    // Make a request to your API to check if the credentials are valid
    const response = await fetch("http://127.0.0.1:8000/api-token-auth/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              localStorage.setItem("token", data.token);
            })
            .then(() => window.location.replace("/home"));
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const register = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = document.getElementById(
      "register-invalid"
    ) as HTMLFormElement;
    error.innerHTML = "<br/>";

    if (username.length == 0 || username.length > 25) {
      error.innerHTML = "Username must be between 1 and 25 characters long";
    } else if (!validUsername.test(username)) {
      error.innerHTML = "Username must be alphanumeric";
    } else if (email.length == 0 || email.length > 40) {
      error.innerHTML = "Email must be between 1 and 40 characters long";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      error.innerHTML = "Invalid email format";
    } else if (password1.length < 8 || password1.length > 25) {
      error.innerHTML = "Password must be between 1 and 25 characters long";
    } else if (password1 != password2) {
      error.innerHTML = "Passwords do not match";
    } else {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: username,
          password: password1,
          email: email,
        }),
      })
        .then((response) => {
          if (response.ok) {
            logIn(username, password1);
          } else if (response.status === 409) {
            error.innerHTML = "Username already taken";
          } else {
            error.innerHTML = "Something went wrong";
            throw Error("Something went wrong");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="login-main-container">
      <div className="login-half-container">
        <div className="login-left-container">
          Stop <span className="span-secondary-color">waiting</span>,<br />
          register <span className="span-secondary-color">today</span>!
        </div>
      </div>
      <div className="login-half-container">
        <div className="login-right-container">
          <div className="login-right-header">Register</div>
          <div className="login-form">
            <form onSubmit={register}>
              <div className="login-form-label">Username</div>
              <div className="login-form-input-container">
                <input
                  type="text"
                  className="login-form-input"
                  placeholder="Username"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="login-form-label">Email</div>
              <div className="login-form-input-container">
                <input
                  type="text"
                  className="login-form-input"
                  placeholder="Email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="login-form-label">Password</div>
              <div className="login-form-input-container">
                <input
                  type="password"
                  className="login-form-input"
                  placeholder="Password"
                  id="password1"
                  name="password1"
                  value={password1}
                  onChange={(event) => setPassword1(event.target.value)}
                />
              </div>
              <div className="login-form-label">Confirm password</div>
              <div className="login-form-input-container">
                <input
                  type="password"
                  className="login-form-input"
                  placeholder="Confirm password"
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={(event) => setPassword2(event.target.value)}
                />
              </div>
              <div id="register-invalid"></div>
              <div className="login-form-input-container">
                <button type="submit" className="login-form-button">
                  Register
                </button>
              </div>
            </form>
            <div className="login-no-account">
              Already have an account?{" "}
              <a href="/login">
                <span className="span-secondary-color">Login here</span>
              </a>
              !
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
