import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthData } from "../context/GetUser"

//the Log in form; title makes its sign the page's h1
function LogIn({ title, registeredEmail }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: registeredEmail || "",
    password: "",
  });
  const [error, setError] = useState("");
  const { logInUser } = AuthData();
  const Heading = title ? "h1" : "h2";

  const handleTextChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    logInUser(user)
      .then(() => navigate("/"))
      .catch((e) => setError(e.message));
  };

  return (
    <section className="account-form" aria-labelledby="login-title">
      <div className="sign">
        <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
        <Heading id="login-title">Log in</Heading>
      </div>
      <form onSubmit={handleSubmit}>
        <p className="account-intro">For all your list saving needs!</p>
        <div className="account-field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" className="field-input" value={user.email} onChange={handleTextChange} placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div className="account-field">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" className="field-input" value={user.password} onChange={handleTextChange} autoComplete="current-password"
            autoFocus={Boolean(registeredEmail)}
            //the focus lands here right after registering, so the field also reads out the "You're registered" message
            aria-describedby={registeredEmail ? "register-status" : undefined}
            required
          />
        </div>
        {error && <p className="account-error" role="alert">{error}</p>}
        <button type="submit" className="button-primary">Log in</button>
        <p className="account-switch">Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </section>
  )
}

export default LogIn
