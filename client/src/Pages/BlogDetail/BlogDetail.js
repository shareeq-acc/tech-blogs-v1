import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./blog-detail.css";
import { dispayDate, displayTimePassed } from "../../Helpers/date";
import { fetchSingleBlogAsync } from "../../Redux-Toolkit/features/Blogs/blogsActions";
import Author from "../../Components/Author/Author";
import Loader from "../../Components/Loader/Loader";
import ErrorMessage from "../../Components/Error/ErrorMessage";

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch()
  const status = useSelector(state => state.blogs.status.CurrentBlog)
  const error = useSelector(state => state.blogs.errors.CurrentBlog)
  const Blog = useSelector(state => state.blogs.data.CurrentBlog)
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleBlogAsync({ blogId: id, strict: false }))
    }
  }, []);
  return (
    <div className="blog-details-container main-container">
      {status === "pending" && <Loader />}
      {error && error !== "ServerError" && (
        <ErrorMessage error={error} />
      )}
      {
        error === "ServerError" && <div>oops Something Went Wrong</div>
      }
      {Blog && status !== "pending" && (
        <div className="blog-details">
          <h1 className="blog-details-title">{Blog.title}</h1>
          <div className="blog-publish-date">
            <div className="blog-details-date">
              <i className="fa-solid fa-clock blog-date-icon"></i>
              <span className="blog-date">{dispayDate(Blog.createdAt)}</span>
            </div>
            {Blog?.createdAt != Blog?.updatedAt && (
              <div className="blog-edit">
                <i className="fa-solid fa-pencil blog-date-icon"></i>
                <span className="blog-date">{displayTimePassed(
                  Blog.updatedAt
                )}
                </span>
              </div>
            )}
          </div>
          <div className="blog-details-img-wrap">
            <img
              className="blog-detail-img"
              src={Blog.imageUrl}
              alt="blog"
            />
          </div>
          <div className="blog-details-content">
            <ReactMarkdown className="blog-content">
              {Blog.content}
            </ReactMarkdown>
          </div>
          {
            !error & status !== "pending" && <Author author={Blog.creator} />
          }
        </div>
      )}

    </div>
  );
};
export default BlogDetail;
