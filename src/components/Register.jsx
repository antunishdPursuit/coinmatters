import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

//the Register form; title makes its sign the page's h1
function Register({ title, onRegistered }) {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const Heading = title ? "h1" : "h2";

  const handleTextChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setRegistered(false);
    const newUser = { ...user, email: user.email.trim() };
    if (new TextEncoder().encode(newUser.password).length > 72) {
      setError("That password is too long. It can be at most 72 bytes, and accented letters and emoji take 2 to 4 bytes each.");
      return;
    }
    axios
      .post(`${API}/register`, newUser, { withCredentials: true })
      .then(() => {
        setRegistered(true);
        onRegistered(newUser.email);
        setUser({ username: "", email: "", password: "" });
      })
      .catch((e) => setError(e.response?.data?.error || "We couldn't register you. Please try again."));
  };

  return (
    <section className="account-form" aria-labelledby="register-title">
      <div className="sign">
        <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
        <Heading id="register-title">Register</Heading>
      </div>
      <form onSubmit={handleSubmit}>
        <p className="account-intro">CoinMatters will save your lists for your future needs.</p>
        <div className="account-field">
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            name="username"
            className="field-input"
            value={user.username}
            onChange={handleTextChange}
            placeholder="Like... Rex45"
            aria-describedby="register-username-hint"
            autoComplete="username"
            pattern="[A-Za-z0-9_.\-]{3,30}"
            required
          />
          <span id="register-username-hint" className="account-hint">3 to 30 letters, numbers, dots, dashes or underscores.</span>
        </div>
        <div className="account-field">
          <label htmlFor="register-email">Email</label>
          <input id="register-email" name="email" type="email" className="field-input" value={user.email} onChange={handleTextChange} placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div className="account-field">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            className="field-input"
            value={user.password}
            onChange={handleTextChange}
            aria-describedby="register-password-hint"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
          />
          <span id="register-password-hint" className="account-hint">At least 8 characters and at most 72 bytes. Most characters take 1 byte; accented letters and emoji take 2 to 4.</span>
        </div>
        {error && <p className="account-error" role="alert">{error}</p>}
        <p id="register-status" className="account-status" role="status">{registered && "You're registered. Log in to start saving."}</p>
        <button type="submit" className="button-primary">Register</button>
        <p className="account-switch">Already have an account? <Link to="/login">Log in now</Link></p>
      </form>
    </section>
  )
}

export default Register
