import { Link } from "react-router-dom";
import "./blog-card.css";
import "../Main-Card/main-card.css";
import { dispayDate } from "../../Helpers/date";


const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blog/${blog._id}`} className="blog-link">
      <div className="blog">
        <div className="blog-img-wrap">
          <img src={blog.imageUrl} alt="BlogImg" className="blog-img" />
        </div>
        <div className="blog-content-wrap blog-wrapper">
          <p className="blog-date">{dispayDate(blog.createdAt)}</p>
          <h2 className="blog-title">{blog.title}</h2>
          <p className="short-description">{blog.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
