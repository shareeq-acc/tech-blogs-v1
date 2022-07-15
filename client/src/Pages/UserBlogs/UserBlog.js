import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBlogsAsync } from "../../Redux-Toolkit/features/Blogs/blogsActions";
import "./user-blog.css";
import BlogCard from "../../Components/Blog-Card/BlogCard";
import Loader from "../../Components/Loader/Loader.js"
import ErrorMessage from "../../Components/Error/ErrorMessage";

const UserBlog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.data.Blogs);
  const status = useSelector(state => state.blogs.status.Blogs)
  const error = useSelector(state => state.blogs.errors.Blogs)

  useEffect(() => {
    dispatch(fetchUserBlogsAsync(id));
  }, [dispatch]);

  return (
    <div className="user-blog-page main-container">
      {status == "pending" && <Loader />}
      {blogs.length > 0 && status !== "pending" ? (
        blogs.map((blog, index) => {
          return <BlogCard blog={blog} key={index} />;
        })
      ) : (
        <div className="no-content">
          {status !== "pending" && <ErrorMessage error={error} />}
        </div>
      )}
    </div>
  );
};

export default UserBlog;
