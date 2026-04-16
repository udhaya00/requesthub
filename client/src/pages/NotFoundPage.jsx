import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="screen-centered">
    <div className="card not-found-card">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The page you requested does not exist in Smart Request Hub.</p>
      <Link className="primary-button button-link" to="/dashboard">
        Return to dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;

