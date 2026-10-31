import React from "react";
import { Link, NavLink } from "react-router-dom";
import navLogo from "../Images/navLogo.png";
import "./NavBar.css";
import axios from "axios";
import { AuthData } from "../context/GetUser";
const API = import.meta.env.VITE_API_URL;

function NavBar() {
  const { loggedIn } = AuthData();
  const { logout } = AuthData();

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
    <header className="site-header">
      <Link className="site-name" to="/">
        <img src={navLogo} alt="" />
        <span>CoinMatters</span>
      </Link>
      <nav className="site-nav" aria-label="Main">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/search">Search</NavLink>
        {loggedIn ?
          <>
            <NavLink to="/profile">Profile</NavLink>
            <Link className="nav-button" to="/" onClick={LogOut}>Log out</Link>
          </>
        :
          <Link className="nav-button" to="/login">Log in</Link>
        }
      </nav>
    </header>
  );
}

export default NavBar;
