import { useState } from "react"
import { useSelector } from "react-redux"
import Account from "../../Components/Profile-Components/Account/Account";
import BlogManagement from "../../Components/Profile-Components/BlogManagement/BlogManagement";
import PasswordManagement from "../../Components/Profile-Components/Password-Management/PasswordManagement";
import "./profile.css";
const Profile = () => {
  const [currentTab, setCurrentTab] = useState("account")
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false)
  const user = useSelector(state => state.user.data.login)
  return <div className="profile profile-container main-container">
    {user &&
      <div className="profile-wrap">
        <div className="sidebar">
          <ul className="sidebarlist">
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



