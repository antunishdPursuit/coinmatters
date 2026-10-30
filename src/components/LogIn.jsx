import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Register.css"
import { AuthData } from "../context/GetUser"

function LogIn() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { logInUser } = AuthData();

  const handleSubmit = (event) => {
      event.preventDefault();
      if (logInUser) {
        logInUser(user)
        navigate('/')
      }
  };

  // If email was previouls used, it will not work
  const handleTextChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value });
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <h3>For all your list saving needs!</h3>
        <div className="input-box">
          <label htmlFor="email"><h3>Email:</h3> </label>
          <input
          id="email" 
          type="email" 
          value={user.email}
          onChange={handleTextChange}
          className="form-control" 
          placeholder="email:"
          required
          />
        </div>
          <br></br>
        <div className="input-box">
          <label  htmlFor="password"><h3>Password:</h3> </label>
          <input 
          id="password"
          type="password" 
          value={user.password}
          onChange={handleTextChange}
          className="form-check-input" 
          placeholder="Rememorable!"
          />
        </div>
          <br></br>
        <div className="input-box button">
          <input type="submit" />
        </div>
        <div className="text">
          <h3>Dont Have An Account? <a href="/register">Register</a></h3>
        </div>
      </form>
    </div>
  )
}

export default LogIn