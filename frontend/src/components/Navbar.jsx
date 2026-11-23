import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context.jsx";

export default function Navbar() {
  const { user, setUser, setFlash } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  async function logout(e) {
    e.preventDefault();
    close();
    try {
      const d = await api("/auth/logout", { method: "POST" });
      setUser(null);
      setFlash("success", d.message);
      navigate("/");
    } catch (err) {
      setFlash("error", err.message);
    }
  }

  const authLinks = (cls) =>
    user ? (
      <a className={cls} href="#" onClick={logout}><b>Log Out</b></a>
    ) : (
      <>
        <NavLink className={cls} to="/signup" onClick={close}><b>Sign Up</b></NavLink>
        <NavLink className={cls} to="/login" onClick={close}><b>Login</b></NavLink>
      </>
    );

  return (
    <>
      <nav className="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand m-0" to="/"><i className="fa-regular fa-compass"></i></Link>

          <button className="navbar-toggler" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" to="/">WonderLust</Link>
              </li>
            </ul>
            <ul className="navbar-nav me-auto ms-auto nav-search">
              <li className="nav-item">
                <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                  <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                  <button className="btn btn-outline-danger button1" type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i><span> Search</span>
                  </button>
                </form>
              </li>
            </ul>
          </div>

          <ul className="navbar-nav ms-auto d-none d-md-flex">
            <li className="nav-item"><NavLink className="nav-link" to="/listing/new">Add New Listings</NavLink></li>
            {authLinks("nav-link")}
          </ul>
        </div>
      </nav>

      <div
        className={`mobile-menu-overlay ${menuOpen ? "show" : ""}`}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <button className="close-mobile-menu" onClick={close} aria-label="Close menu">
          <i className="fas fa-times"></i>
        </button>
        <Link className="mobile-menu-item" to="/listing/new" onClick={close}>Add New Listings</Link>
        {authLinks("mobile-menu-item")}
      </div>
    </>
  );
}
