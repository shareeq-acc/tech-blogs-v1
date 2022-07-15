
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { checkUserAsync } from "./Redux-Toolkit/features/User/userActions";
import { ToastContainer } from 'react-toastify';
import Navbar from "./Components/Navbar/Navbar";
import BlogDetail from "./Pages/BlogDetail/BlogDetail";
import { CreateBlog } from "./Pages/Create/CreateBlog";
import EditBlog from "./Pages/EditBlog/EditBlog";
import { Home } from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Profile from "./Pages/Profile/Profile";
import Register from "./Pages/Register/Register";
import UserBlog from "./Pages/UserBlogs/UserBlog";
import Activation from "./Pages/Activation/Activation";
import Setup from "./Pages/Setup/Setup";
import "./modal.css"
import 'react-toastify/dist/ReactToastify.css';
import { authCheck } from "./Redux-Toolkit/features/User/userSlice";
import RequireAuth from "./Components/RequireAuth/RequireAuth";
import NotFound from "./Pages/NotFound/NotFound";

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      console.log("Auth Check")
      dispatch(checkUserAsync())
    }
    dispatch(authCheck())
  }, [dispatch])

  return (
    <div className="App">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog/:id" element={<BlogDetail />} />

        {/* Private Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/blog/edit/:id" element={<EditBlog />} />
          <Route path="/blog/user/:id" element={<UserBlog />} />
          <Route path="/user/settings" element={<Profile />} />
          <Route path="/user/activate/:token" element={<Activation />} />
          <Route path="/user/account-setup" element={<Setup />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
