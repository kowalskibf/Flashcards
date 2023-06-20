import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";

export default function ChangePassword() {
  const [old_password, setOldPassword] = useState<string>("");
  const [new_password, setNewPassword] = useState<string>("");

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = (document.getElementById("error-password-change") as HTMLFormElement);
    const success = (document.getElementById("success-password-change") as HTMLFormElement);
    error.innerHTML = "";
    success.innerHTML = "";
    if(new_password.length === 0)
    {
        error.innerHTML = "New password cannot be empty";
    }
    else
    {
        const response = await fetch("http://127.0.0.1:8000/api/change-password", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            old_password: old_password,
            new_password: new_password,
        }),
        })
        .then((response) => {
            window.scrollTo(0, 0);
            if (response.ok) {
                setOldPassword("");
                setNewPassword("");
                success.innerHTML = "Password successfully changed!";
            } else if(response.status === 400) {
                error.innerHTML = "Old password is wrong";
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
    <div>
        <div id="change-password-container">
            <div className="change-password-form-container">
                <div className="change-password-title">
                    Change Password
                </div>
                <form onSubmit={changePassword}>
                    <div className="change-password-label">
                        Old password:<br/>
                        <input 
                            className="change-password-input"
                            type="password"
                            id="old_password"
                            name="old_password" 
                            placeholder="Type your old password here"
                            value={old_password}
                            onChange={(event) => setOldPassword(event.target.value)}
                        />
                    </div>
                    <div className="change-password-label">
                        New password:<br/>
                        <input 
                            className="change-password-input"
                            type="password"
                            id="new_password"
                            name="new_password" 
                            placeholder="Type your new password here"
                            value={new_password}
                            onChange={(event) => setNewPassword(event.target.value)}
                        />
                    </div>
                    <div id="error-password-change"></div>
                    <div id="success-password-change"></div>
                    <button type="submit" className="change-password-submit">Change Password</button>
                </form>
            </div>
        </div>
    </div>
  );
}