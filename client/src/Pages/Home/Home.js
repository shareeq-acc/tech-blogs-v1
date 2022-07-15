import React, { useEffect } from "react";
import MainCard from "../../Components/Main-Card/MainCard";
import { Link } from "react-router-dom";
import "./home.css";
import BlogCard from "../../Components/Blog-Card/BlogCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogsAsync } from "../../Redux-Toolkit/features/Blogs/blogsActions";
import Loader from "../../Components/Loader/Loader";

export const Home = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs.data.Blogs)
  const status = useSelector((state) => state.blogs.status.Blogs);
  // const error = useSelector((state) => state.blogs.error.Blogs);

  useEffect(() => {
    dispatch(fetchBlogsAsync());
    console.log(blogs)
  }, []);

  const RenderBlogs = () => {
    if (status === "rejected") {
      return (
        <div className="no-content">
          <p className="no-content-message">Something Went Wrong</p>
        </div>
      );
    }
    if (blogs.length > 0 && status === "completed") {
      return (
        <div className="blog-container">
          {blogs.map((blog, index) => {
            if (index !== 0) {
              return <BlogCard blog={blog} key={index} />;
            }
          })}
        </div>
      );
    }
  };
  return (
    <div className="home main-container">
      {status === "pending" && <Loader/>}
      {blogs.length > 0 && status === "completed" && (
        <div className="main-highlighted-blog">
          <MainCard blog={blogs[0]} key={0} />
        </div>
      )}
      <RenderBlogs />
    </div>
  );
};
