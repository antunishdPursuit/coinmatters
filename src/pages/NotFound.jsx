import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="rail" aria-hidden="true"></div>
      <div className="sign">
        <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
        <h1>Page not found</h1>
      </div>
      <p>We couldn't find that page.</p>
      <Link className="button-primary" to="/">Go to the home page</Link>
    </div>
  );
}
