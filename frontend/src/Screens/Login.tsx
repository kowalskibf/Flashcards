import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
          (document.getElementById("login-invalid-placeholder") as HTMLFormElement).style.display = "none";
          (document.getElementById("login-invalid") as HTMLFormElement).style.display = "block";
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="login-main-container">
      <div className="login-half-container">
        <div className="login-left-container">
          Welcome <span className="span-secondary-color">back</span>!
        </div>
      </div>
      <div className="login-half-container">
        <div className="login-right-container">
          <div className="login-right-header">
            Login
          </div>
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="login-form-label">
                Username
              </div>
              <div className="login-form-input-container">
                <input
                  type="text"
                  className="login-form-input"
                  placeholder="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="login-form-label">
                Password
              </div>
              <div className="login-form-input-container">
                <input
                  type="password"
                  className="login-form-input"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div id="login-invalid-placeholder"></div>
              <div id="login-invalid">
                Invalid credentials.
              </div>
              <div className="login-form-input-container">
                <button type="submit" className="login-form-button">
                  Log In
                </button>
              </div>
            </form>
            <div className="login-no-account">
              Don't have an account? <a href="/register"><span className="span-secondary-color">Register here</span></a>!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
