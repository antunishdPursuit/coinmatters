import React from "react";
import { Link } from "react-router-dom";
import navLogo from "../Images/navLogo.png";
import "./NavBar.css";
import axios from "axios";
import { AuthData } from "../context/GetUser";
const API = process.env.REACT_APP_API_URL;

function NavBar() { 
  const { loggedIn } = AuthData();
  const { logout } = AuthData();
  const { user } = AuthData()
  
  function LogOut(){
    axios
    .post(`${API}/logout`, {}, { withCredentials: true })
    .then((res) => {
      window.location.reload();
      logout()
    })
    .catch((error) => {
      console.error("catch", error);
    });
  }

  return (
    <nav className="navbar">
      <div className="logo-div">
        <Link to="/">
          <img src={navLogo} alt="My App Logo" className="nav-logo" />
        </Link>
        <span className="nav-title">CoinsMatter</span>
      </div>
      <div className="navbar-links">
        <Link className="links-tab" to="/">Home</Link>
        <Link className="links-tab" to="/about">About</Link>
        <Link className="links-tab" to="/search">Search</Link>
        {loggedIn ? 
          <>
            <Link className="links-tab" to={`/${user.username}`}>Profile</Link>
            <Link className="links-tab" onClick={LogOut}>Log Out</Link>
          </>
          
        : 
          <Link className="links-tab" ></Link>
        }
      </div>
    </nav>
  );
}

export default NavBar;
