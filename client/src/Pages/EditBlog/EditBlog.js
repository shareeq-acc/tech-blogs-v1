import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../../Components/Blog-Form/BlogForm";
import ErrorMessage from "../../Components/Error/ErrorMessage";
import { fetchSingleBlogAsync, updateBlogAsync } from "../../Redux-Toolkit/features/Blogs/blogsActions";
import "./edit-blog.css";
const EditBlog = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const currblog = useSelector((state) => state.blogs.data.CurrentBlog);
  const error = useSelector(state => state.blogs.errors.CurrentBlog)
  const status = useSelector(state => state.blogs.CurrentBlog)
  useEffect(() => {
    console.log("UseEffect");
    if (id) {
      dispatch(fetchSingleBlogAsync({ blogId: id, strict: true }));
    }

  }, [dispatch]);

  const editBlog = (formData) => {
    dispatch(updateBlogAsync({ blogId: id, blog: formData, navigate }))
  };
  return (
    <div className="blog-form-page">
      {currblog && (
        <BlogForm
          title={"Edit This Blog"}
          onSubmit={editBlog}
          action="update"
          blog={currblog}
        />
      )}
      {
        error && <div>
          {status !== "pending" && <ErrorMessage error={error} />}
        </div>
      }
    </div>
  );
};

export default EditBlog;
