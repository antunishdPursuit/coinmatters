import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/Register.css"

const API = process.env.REACT_APP_API_URL;

function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
      username: "",
      email: "",
      password: "",
    });

    const instance = axios.create({
      withCredentials: true,
   })

    const addUser = (newUser) => {
        console.log(newUser)
        instance
          .post(`${API}/register`, newUser)
          .then(
          (res) => {
          navigate(`/login`);
          })
          .catch((c) => {
            console.error("catch", c)
          });
      };

      // If email was previouls used, it will not work
    const handleTextChange = (event) => {
        setUser({ ...user, [event.target.id]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        addUser(user)
    };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <h3>Coinsmatter will save your lists, saved for your future needs</h3>
        <div className="input-box">
          <label htmlFor="username"><h3>Username:</h3> </label>
          <input
          id="username" 
          type="text" 
          value={user.username}
          onChange={handleTextChange}
          className="form-control" 
          placeholder="Like... Rex45"
          required
          />
        </div>
          <br></br>
        <div className="input-box">
          <label htmlFor="email"><h3>Email:</h3> </label>
          <input
          id="email" 
          type="email" 
          value={user.email}
          onChange={handleTextChange}
          className="form-control" 
          placeholder=" test@gmail.com"
          required
          />
        </div>
          <br></br>
        <div className="input-box">
          <label htmlFor="password"><h3>Password:</h3> </label>
          <input 
          id="password"
          type="password" 
          value={user.password}
          checked={user.password}
          onChange={handleTextChange}
          className="form-control" 
          placeholder="Rememorable!"
          />
        </div>
          <br></br>
        <div className="input-box button">
          <input 
          type="submit" 
          />
        </div>
        <br></br>
        <div className="text">
          <h3>Already have an account? <a href="/login">Login now</a></h3>
        </div>
      </form>
    </div>
  )
}

export default Register