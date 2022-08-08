import "./blog-detail.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { dispayDate, displayTimePassed } from "../../Helpers/date";
import { blogLikeAction, fetchSingleBlogAsync } from "../../Redux-Toolkit/features/Blogs/blogsActions";
import Author from "../../Components/Author/Author";
import Loader from "../../Components/Loader/Loader";
import ErrorMessage from "../../Components/Error/ErrorMessage";
import calculateNumber from "../../Helpers/calculateNum.js"
import PublishComment from "../../Components/PublishComment/PublishComment";
import CommentContainer from "../../Containers/CommentContainer/CommentContainer";
import ButtomLoader from "../../Components/ButtonLoader/ButtomLoader";
import { getCommentsAsync } from "../../Redux-Toolkit/features/Blogs/blogCommentAction";

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch()
  const status = useSelector(state => state.blogs.status.CurrentBlog)
  const error = useSelector(state => state.blogs.errors.CurrentBlog)
  const Blog = useSelector(state => state.blogs.data.CurrentBlog)
  const comments = useSelector(state => state.blogs.data.comments)
  const commentStatus = useSelector(state => state.blogs.status.comments)
  const editComment = useSelector(state => state.blogs.data.editComment)
  const pagination = useSelector(state => state.blogs.data.commentPagination)
  const user = useSelector(state => state.user.data.login)
  const navigate = useNavigate()

  const paginationLength = 5

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleBlogAsync({ blogId: id, strict: false, start: pagination.start }))
    }
  }, []);
  const handleLikeAction = () => {
    // Like/Unlike Blog
    dispatch(blogLikeAction({ id, navigate }))
  }
  const getMoreComments = () => {
    // Comments Pagination
    dispatch(getCommentsAsync({ id, start: pagination.start }))
  }
  return (
    <div className="blog-details-container main-container">
      {status === "pending" && <Loader />}
      {error && error !== "ServerError" && (
        <ErrorMessage error={error} />
      )}
      {
        error === "ServerError" && <div>oops Something Went Wrong</div>
      }
      {/* Blog Data  */}
      {Blog && status !== "pending" && (
        <div className="blog-details">
          <h1 className="blog-details-title">{Blog.title}</h1>

          <div className="blog-publish-date">
            <div className="blog-details-date">
              <i className="fa-solid fa-clock blog-date-icon"></i>
              <span className="blog-date">{dispayDate(Blog.createdAt)}</span>
            </div>
            {/* Show Edit Div if Blog is Edited */}
            {Blog?.updatedAt && Blog?.createdAt != Blog?.updatedAt && (
              <div className="blog-edit">
                <i className="fa-solid fa-pencil blog-date-icon"></i>
                <span className="blog-date">{displayTimePassed(
                  Blog?.updatedAt
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
            {/* Blog Markdown (Main Content) */}
            <ReactMarkdown className="blog-content">
              {Blog.content}
            </ReactMarkdown>
          </div>
          {/* Blog Author Details  */}
          {
            !error & status !== "pending" && <Author author={Blog.creator} />
          }

          {/* Blog Like div */}
          <div className={`blog-like-wrap ${Blog.liked ? "liked" : ""}`}>
            <i className={"fa-solid fa-heart blog-like"} onClick={handleLikeAction}></i>
            <span className="likes-count">{calculateNumber(Blog?.likesCount)}</span>
          </div>

          {/* Blog Comments */}
          <div className="comments-wrap">
            <h2 className="comments-title">Comments - <span className="comments-count">{Blog?.comments?.length}</span></h2>
            {user && <PublishComment id={Blog._id} />}
            {comments.length > 0 &&
              comments.map((comment, index) => (
                comment._id === editComment.id ? <PublishComment text={editComment?.text} update={true} id={Blog._id} key={index} commentId={editComment.id} /> : (<CommentContainer blogId={Blog._id} comment={comment} commentIndex={index} key={index} />)

              ))
            }
            {/* Comments Loader */}
            {
              commentStatus === "pending" && !comments?.length > 0 && <Loader className={"comments-loader"} />
            }
            {/* Pagination Button */}
            {pagination.end === false && <ButtomLoader text={"Load More"} className={"comments-loader-btn"} loadingText={"Getting Comments"} status={commentStatus} onClick={getMoreComments} />}
          </div>
        </div>
      )}

    </div>
  );
};
export default BlogDetail;
