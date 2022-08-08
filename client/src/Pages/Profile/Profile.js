import { useState } from "react"
import { useSelector } from "react-redux"
import Account from "../../Components/Profile-Components/Account/Account";
import BlogManagement from "../../Components/Profile-Components/BlogManagement/BlogManagement";
import PasswordManagement from "../../Components/Profile-Components/Password-Management/PasswordManagement";
import "./profile.css";
const Profile = () => {
  const [currentTab, setCurrentTab] = useState("account")
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false)
  const [displayMenu, setDisplayMenu] = useState(false)
  const user = useSelector(state => state.user.data.login)

  const handleMenuChange = () => {
    let nextMenuValue = displayMenu
    setDisplayMenu(!nextMenuValue)
  }
  return <div className="profile profile-container main-container">
    {user &&
      <div className="profile-wrap">
        <div className="profile-menu-icon-wrap">
          <i className="fa-solid fa-ellipsis-vertical profile-menu-icon" onClick={handleMenuChange}></i>
        </div>
        {/* Toggle Sidebar on Mobile Screen */}
        <div className={`sidebar ${displayMenu ? "show-sidebar" : ""}`}>
          <ul className="sidebarlist">
            {/* Toggle Active Classes */}
            <li name="manage-blogs" className={`sidebar-item ${currentTab === "manage-blogs" ? "active" : ""}`} onClick={(e) => setCurrentTab("manage-blogs")}>Manage Blogs</li>
            <li name="account" className={`sidebar-item ${currentTab === "account" ? "active" : ""}`} onClick={(e) => setCurrentTab("account")}>Account</li>
            <li name="password" className={`sidebar-item ${currentTab === "password" ? "active" : ""}`} onClick={(e) => setCurrentTab("password")}>Change Password</li>
          </ul>
        </div>
        <div className="profile-content">
          {currentTab === "account" && <Account />}
          {currentTab === "manage-blogs" && <BlogManagement modal={setDisplayDeleteModal} />}
          {currentTab === "password" && <PasswordManagement />}
        </div>
      </div>}
  </div>
};

export default Profile;




