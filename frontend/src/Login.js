import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("https://ai-medical-system-5olk.onrender.com/login", {
        username,
        password,
      });

      if (res.data.status === "success") {
        setIsLoggedIn(true);
      } else {
        alert("Invalid credentials");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🧬 AI Health System</h1>
        <p>Doctor Login</p>

        <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Login;