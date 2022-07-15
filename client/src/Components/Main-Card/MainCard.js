import React from "react";
import "./main-card.css";
import { Link } from "react-router-dom";
import { dispayDate } from "../../Helpers/date";
const MainCard = ({ blog }) => {
  return (
    <Link to={`/blog/${blog._id}`} className="main-card">
      <div className="blog-main-img-wrap blog-img-wrap">
        <img src={blog.imageUrl} alt="Blog Photo" className="main-blog-img" />
      </div>
      <div className="blog-content-wrap">
        <p className="blog-date">{dispayDate(blog.createdAt)}</p>
        <h1 className="blog-title">{blog.title}</h1>
        <p className="short-description">{blog.description}</p>
        <div className="blog-card-user">
          <div className="blog-author-img-wrap">
            {
              blog.creator.imageUrl ?
                <div className="profile-card-image" style={{ backgroundImage: `url(${blog.creator.imageUrl})` }}></div>
                : <img
                  src="https://static-exp1.licdn.com/sc/h/244xhbkr7g40x6bsu4gi6q4ry"
                  alt="Name"
                  className="blog-author-img"
                />
            }

          </div>
          <div className="blog-author-content">
            <p className="author-name">{`${blog.creator.fname} ${blog.creator.lname}`}</p>
            <p className="author-role">{blog.creator.expertise}</p>
          </div>
        </div>
      </div>

    </Link>
  );
};

export default MainCard;
