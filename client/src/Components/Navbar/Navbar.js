import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUserAsync } from "../../Redux-Toolkit/features/User/userActions"


import "./navbar.css";
const Navbar = () => {
  // const loading = useSelector((state) => state.user.loading);
  // const user = useSelector((state) => state.user.user);
  // const loading = useSelector((state) => state.user.isloading);
  const user = useSelector(state => state.user.data)
  const status = useSelector(state => state.user.status.userLogin)
  const [toggleItems, Toggle] = useState(false);
  const dispatch = useDispatch();
  const [userProfileDropdown, setUserProfileDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState("")
  const navigate = useNavigate();

  // Toggle Button Functionality for Navbar
  const renderNavItems = () => {
    if (toggleItems === false) {
      return "main-nav-list";
    } else {
      return "main-nav-list show-links";
    }
  };
  const handleLogout = () => {
    dispatch(logoutUserAsync(navigate));
  };

  return (
    <header className="main-nav-header main-container">
      <nav className="main-nav">
        <Link to={"/"} className="main-nav-link logo-item">
          <span className="logo">TechBlogs</span>
        </Link>
        {status !== "pending" && (
          <ul className={renderNavItems()}>
            <li className={`main-nav-item ${activeLink === "home" ? "active-link" : ""}`}>
              <Link to={"/"} className="main-nav-link" name="home" onClick={(e) => setActiveLink(e.target.name)}>
                Home
              </Link >
            </li>
            {!user.login && (
              <li className={`main-nav-item ${activeLink === "register" ? "active-link" : ""}`}>
                <Link to={"/register"} className="main-nav-link" name="register" onClick={(e) => setActiveLink(e.target.name)}>
                  Register
                </Link>
              </li>
            )}
            {!user.login && (
              <li className={`main-nav-item ${activeLink === "login" ? "active-link" : ""}`}>
                <Link to={"/login"} className="main-nav-link" name="login" onClick={(e) => setActiveLink(e.target.name)}>
                  Login
                </Link>
              </li>
            )}
            {user.login && (
              <li className={`main-nav-item ${activeLink === "create" ? "active-link" : ""}`}>
                <Link to={"/create"} className="main-nav-link" name="create" onClick={(e) => setActiveLink(e.target.name)}>
                  Create
                </Link>
              </li>
            )}
            {user.login && (
              <div
                className="nav-profile-wrap nav-dropdown"
                onClick={() => {
                  setUserProfileDropdown(userProfileDropdown ? false : true);
                }}
              >
                {user.profile && (
                  <img
                    src={user.profile}
                    alt="Profile"
                    className="main-nav-img"
                  />
                )}
                {user.profileImage ?
                  <div className="nav-img" style={{ backgroundImage: `url(${user.profileImage})` }}></div> : <i className="fa-solid fa-user user-icon"></i>
                }
                {userProfileDropdown && (
                  <div className="dropdown-content">
                    <Link
                      to={`/blog/user/${user.id}`}
                      className="dropdown-item"
                    >
                      My Blogs
                    </Link>
                    <Link
                      to={`/user/settings`}
                      className="dropdown-item"
                    >
                      Settings
                    </Link>
                    <p className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </p>
                  </div>
                )}
              </div>
            )}
          </ul>
        )}

        <div
          className="toggle-menu"
          onClick={() => Toggle(!toggleItems ? true : false)}
        >
          <i className="fa-solid fa-bars"></i>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
