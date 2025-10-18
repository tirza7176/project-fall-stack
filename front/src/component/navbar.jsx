import { Link, NavLink } from "react-router";
import Logo from "../component/logo";
import { useAuth } from "../context/authContext";

import { useSearch } from "../context/searchProvider";
import { useEffect, useState } from "react";

function Navbar() {
  const { user } = useAuth();
  const { inputSearch, setInputsearch } = useSearch();

  const [theme, setTheme] = useState(false);
  useEffect(() => {
    const mode = theme ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", mode);
  }, [theme]);

  function handleToggle() {
    if (!theme) {
      setTheme(true);
    } else {
      setTheme(false);
    }
  }

  return (
    <nav
      className="navbar navbar-expand-md  bg-opacity-75 shadow-sm"
      aria-label="navbar"
      style={{ backgroundColor: "#8B4513", color: "white", padding: "20px" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand text-white fw-bold fs-3" to="/events">
          <Logo />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample04"
          aria-controls="navbarsExample04"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample04">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/events/about">
                אודות
              </NavLink>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link text-white"
                    to="/events/myOrders"
                  >
                    My orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link text-white"
                    to="/events/createnewOrder"
                  >
                    התחל הזמנה
                  </NavLink>
                </li>
              </>
            )}
            {user?.isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/events/orders">
                    הזמנות
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="input-group w-25">
            <input
              type="text"
              className="form-control"
              placeholder="search"
              aria-label="search"
              value={inputSearch}
              onChange={(e) => setInputsearch(e.target.value)}
            ></input>
          </div>
          <button className="ms-2 btn btn-link-dark" onClick={handleToggle}>
            {theme ? (
              <i className="bi bi-brightness-high"></i>
            ) : (
              <i className="bi bi-moon-fill"></i>
            )}
          </button>
          <ul className="navbar-nav ms-auto mb-2 mb-md-0">
            {user ? (
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/events/signout">
                  התנתקות
                </NavLink>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/events/signup">
                    הרשמה
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/events/signin">
                    התחברות
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
