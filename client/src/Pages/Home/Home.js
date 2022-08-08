import React, { useEffect } from "react";
import MainCard from "../../Components/Main-Card/MainCard";
import { Link } from "react-router-dom";
import "./home.css";
import BlogCard from "../../Components/Blog-Card/BlogCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogsAsync } from "../../Redux-Toolkit/features/Blogs/blogsActions";
import Loader from "../../Components/Loader/Loader";
import ErrorMessage from "../../Components/Error/ErrorMessage";
import BlogsCategorySliders from "../../Containers/BlogsCategorySlider/BlogsCategorySliders";

export const Home = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.blogs.status.Blogs);
  const mainBlog = useSelector(state => state.blogs.data.Blogs.mainBlog)
  const blogs = useSelector((state) => state.blogs.data.Blogs.homeBlogs);

  useEffect(() => {
    dispatch(fetchBlogsAsync());
  }, []);

  const RenderBlogs = () => {
    if (status === "rejected") {
      // Server Error
      return (
        <ErrorMessage error={"Something Went Wrong"} />
      );
    }
    if (blogs?.length > 0 && status === "completed") {
      return (
        <div>
          {blogs.map((blog, index) => {
            return <div className="blog-container" key={index}>
              <BlogsCategorySliders data={blog} key={index} />
            </div>
          })}
        </div>
      );
    }
  };

  return (
    <div className="home main-container">
      {status === "pending" && <Loader />}
      {
        // Home Main BLog Card
        status !== "pending" && mainBlog && <div className="main-highlighted-blog">
          <MainCard blog={mainBlog[0]} key={0} />
        </div>
      }
      <RenderBlogs />
    </div>
  );
};
