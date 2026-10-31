import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>Page not found</h1>
      <p>We couldn't find that page.</p>
      <Link to="/">Go to the home page</Link>
    </div>
  );
}
