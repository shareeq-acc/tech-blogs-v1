import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";
import "./blog-form.css";
import Button from "../Button/Button.js";
import Loader from "../Loader/Loader.js"
import { addBlogFormError, removeBlogFormError } from "../../Redux-Toolkit/features/Blogs/blogsSlice";
import { categtories } from "../../data/blogCategories";
const BlogForm = ({ title, onSubmit, action, blog }) => {
  const initialData = {
    title: "",
    description: "",
    content: "",
    category: "hardware",
    subCategory: "general",
    otherCategory: "",
    file: null,
  };
  const dispatch = useDispatch();
  const [tags, setTags] = useState([]);
  const [blogFormData, setBlogFormData] = useState(initialData);
  const [file, setFile] = useState(null);
  const [fileSelection, setFileSelection] = useState(true);
  const [showOthersInput, setShowOtherInput] = useState(false);
  // const blog = useSelector((state) => state.blog.currBlog);
  const status = useSelector((state) => state.blogs.status.BlogForm);
  const error = useSelector((state) => state.blogs.errors.BlogForm);
  const user = useSelector(state => state.user.data)

  useEffect(() => {
    if (action === "update" && blog) {
      // Set initial data for updating blog
      setFileSelection(false);
      setBlogFormData({
        title: blog?.title,
        description: blog?.description,
        content: blog?.content,
        category: blog?.category,
        subCategory: blog?.subCategory,
        otherCategory: blog?.otherCategory,
        file: null,
      });
      setTags(blog.tags[0].split(","));
    }
    dispatch(removeBlogFormError())
  }, [blog, dispatch, user]);

  const handleFormChange = (e) => {
    setBlogFormData({ ...blogFormData, [e.target.name]: e.target.value });
  };
  
  const addTags = (e) => {
    // Check if Enter is Pressed
    if (e.key === "Enter") {
      // Validating Tags
      e.preventDefault();
      if (e.target.value.length > 15) {
        dispatch(addBlogFormError({ message: "Tags cannot exceed 15 Characters", field: "tags" }));
        return;
      }
      if (e.target.value.length < 3) {
        dispatch(addBlogFormError({ message: "Tags should be atleast 3 Characters", field: "tags" }));
        return;
      }
      if (tags.length > 5) {
        // Already More than 5 Tags Present
        dispatch(addBlogFormError({ message: "Maximum 6 Tags Allowed", field: "tags" }));
        return;
      }
      if (error) {
        dispatch(removeBlogFormError());
      }
      setTags([...tags, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  // Removing Tags
  const removeTags = (tagIndex) => {
    const filteredArray = tags.filter((tag, index) => index != tagIndex);
    setTags(filteredArray);
  };

  // Setting File in the State
  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  // Displaying The input field when other option is selected
  const setMainCategory = (e) => {
    setShowOtherInput(false);
    if(e.target.value === "laptop"){ // If Laptop is Chosen that Show Input Field
      setShowOtherInput(true)
    }
    setBlogFormData({
      ...blogFormData,
      category: e.target.value,
      // When a Category is Changed, Update the Sub Category to the First SubCategory of the Category Chosen 
      subCategory: e.target.value === "software" ? "" : categtories[e.target.value][0].toLowerCase(),  // If Category Chosen is Software then, set SubCategory to ""
      otherCategory: "",
    });
   
  }
  const checkSelectedValue = (e) => {
    if (e.target.value === "other") {
      // If SubCategory Value is Other, Show Input Field
      setShowOtherInput(true);
      setBlogFormData({ ...blogFormData, subCategory: "other" });
    } else {
      setBlogFormData({
        ...blogFormData,
        subCategory: e.target.value,
        otherCategory: "",
      });
      setShowOtherInput(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (action === "update") {
      // Appending File in FormData only when a New File is selected While Component has an Update Action
      if (fileSelection && file) {
        formData.append("file", file);
      }
    } else {
      formData.append("file", file);
    }
    formData.append("title", blogFormData.title);
    formData.append("description", blogFormData.description);
    formData.append("content", blogFormData.content);
    formData.append("tags", tags);
    formData.append("category", blogFormData.category);
    formData.append("otherCategory", blogFormData.otherCategory);
    formData.append("subCategory", blogFormData.subCategory);
    onSubmit(formData);
  };
  return (
    <form className="blog-form" onSubmit={handleFormSubmit}>
      <h1 className="blog-form-title">{title}</h1>
      {status === "pending" && (
        <Loader />
      )}
      {error?.message && <div className="form-message form-error">{error.message}</div>}
      <input
        type="text"
        placeholder="Enter Blog Title"
        name="title"
        className={`blog-form-title blog-input ${error?.formError?.title ? "blog-input-warning" : ""}`}
        onChange={handleFormChange}
        value={blogFormData.title}
      />
      <textarea
        name="description"
        rows="3"
        className={`blog-form-description blog-input ${error?.formError?.description ? "blog-input-warning" : ""}`}
        placeholder="Enter Short Blog Description"
        onChange={handleFormChange}
        value={blogFormData.description}
      ></textarea>

      {/* Markdown div */}
      <div className={`markdown-wrap ${blogFormData?.content?.length > 0 ? "" : "hide-markdown"}`}>
        <ReactMarkdown className="markdown">
          {blogFormData.content}
        </ReactMarkdown>
      </div>
      <textarea
        name="content"
        rows="10"
        className={`blog-form-description blog-input ${error?.formError?.content ? "blog-input-warning" : ""}`}
        placeholder="Enter Blog Markdown"
        onChange={handleFormChange}
        value={blogFormData.content}
      ></textarea>

      {/* tags */}
      <div className="tags-wrap">
        <div className={`tags-wrapper ${tags?.length > 0 ? "tags-padding" : "zero-padding"}`}>
          {tags.map((tag, index) => (
            <div className="tags" key={index}>
              <p className="tags-content">{tag}</p>
              <span className="tag-destroy" onClick={() => removeTags(index)}>
                x
              </span>
            </div>
          ))}
        </div>
        <input
          className={`tags-input blog-input ${error?.formError?.tags ? "blog-input-warning" : ""}`}
          type="text"
          placeholder="Enter Tags"
          onKeyPress={addTags}
        />
      </div>
      <div className={`${action !== "update" ? "file-category-wrap" : ""}`}>
        <div className="category form-spaces">
          <label htmlFor="category" className="form-label">Select Category</label>
          <select
            name="category"
            className="category-selection"
            onChange={setMainCategory}
            value={blogFormData.category}
            // Categories 
          >{
              categtories.all.map((category, index) => {
                return <option key={index} value={category.toLowerCase()}>{category}</option>
              })
            }
          </select>
          {/* SubCategory Based on the Category Selected */}
          {blogFormData.category !== categtories.noSubCategory.toLowerCase() && <select
            name="subCategory"
            className="category-selection sub-category"
            onChange={checkSelectedValue}
            value={blogFormData.subCategory}
          >
            {/* Not Show option when a category has no Sub Category */}
            {categtories[blogFormData.category].map((category, index) => {
              return <option key={index} value={category.toLowerCase()}>{category}</option>
            })}
          </select>}
          {showOthersInput && (
            <input
              className={`other-category-input blog-input ${error?.content?.otherCategory ? "blog-input-warning" : ""}`}
              type="text"
              placeholder={blogFormData.category === "laptop" ? "Enter Brand (Optional)" : "Enter Blog Category"}
              name="otherCategory"
              onChange={handleFormChange}
              value={blogFormData.otherCategory}
            />
          )}
        </div>
        {fileSelection && (
          <div className="file-wrapper">
            <label htmlFor="file" className="form-label">Select Image for Your Blog</label>
            <input
              type="file"
              className="file-input"
              onChange={selectFile}
              name="image"
            />
          </div>
        )}

        <div className="file-alt-wrap">
          {!fileSelection && (
            <Button
              theme={"white"}
              color={"black"}
              text={"Change Blog Image"}
              onClick={() => setFileSelection(true)}
            />
          )}
          {action == "update" && fileSelection == true && (
            <Button
              theme={"white"}
              color={"black"}
              text={"Cancel"}
              onClick={() => setFileSelection(false)}
            />
          )}

          {action == "update" && (
            <p>*If you do not Select any File Your Image would not Change*</p>
          )}
        </div>
      </div>
      <Button
        theme={"#0EC367"}
        color={"white"}
        text={"Submit"}
        onClick={handleFormSubmit}
      />
    </form>
  );
};

export default BlogForm;
