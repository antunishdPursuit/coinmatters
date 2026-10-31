import { useState } from "react";
import LogIn from "../components/LogIn";
import Register from "../components/Register";
import "./Account.css";

//Register and Log in side by side. The form the visitor came for comes first
//and carries the page title.
export default function Account({ start }) {
  //after registering, the log in form starts over with the new email filled in,
  //so the visitor only needs to type their password
  const [registeredEmail, setRegisteredEmail] = useState("");

  const register = <Register key="register" title={start === "register"} onRegistered={setRegisteredEmail} />;
  const logIn = <LogIn key={`login-${registeredEmail}`} title={start === "login"} registeredEmail={registeredEmail} />;

  return (
    <div className="account-page">
      <div className="rail" aria-hidden="true"></div>
      <div className="account-grid">
        {start === "register" ? [register, logIn] : [logIn, register]}
      </div>
    </div>
  );
}
