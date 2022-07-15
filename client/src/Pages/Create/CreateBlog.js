import "./create-blog.css";
import BlogForm from "../../Components/Blog-Form/BlogForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBlogAsync } from "../../Redux-Toolkit/features/Blogs/blogsActions";
export const CreateBlog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const createNewBlog = (formData) => {
    dispatch(createBlogAsync({ blog: formData, navigate }));
  };

  return (
    <div className="blog-form-page">
      <BlogForm title={"Create a New Blog"} onSubmit={createNewBlog} />
    </div>
  );
};
