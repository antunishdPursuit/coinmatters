import { startTransition } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import navLogo from "../Images/navLogo.png";
import "./NavBar.css";
import axios from "axios";
import { AuthData } from "../context/GetUser";
const API = import.meta.env.VITE_API_URL;

function NavBar() {
  const navigate = useNavigate();
  const { loggedIn, logout } = AuthData();

  function LogOut(){
    axios
    .post(`${API}/logout`, {}, { withCredentials: true })
    .then(() => {
      // one update, so a members-only page doesn't send the visitor to log in first
      startTransition(() => {
        navigate("/")
        logout()
      })
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
            <button type="button" className="nav-button" onClick={LogOut}>Log out</button>
          </>
        :
          <Link className="nav-button" to="/login">Log in</Link>
        }
      </nav>
    </header>
  );
}

export default NavBar;
