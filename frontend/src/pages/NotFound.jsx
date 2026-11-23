import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="row">
      <div className="alert alert-danger col-md-6 offset-md-3" role="alert">
        <h5 className="alert-heading">Page not found!</h5>
        <Link to="/">Back to listings</Link>
      </div>
    </div>
  );
}
