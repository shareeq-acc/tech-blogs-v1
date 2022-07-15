import Blog from "../Model/blogSchema.js";
import formErrors from "../Common/formErrors.js";
import mongoose from "mongoose";

export const findHomeBlogs = async () => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(6).populate(
      "creator",
      "fname lname imageUrl expertise"
    );
    return {
      blogs: blogs,
      success: true,
    };
  } catch (error) {
    console.log(error.message);
    return {
      success: false,
      error: true,
    };
  }
};

export const findBlogsByUser = async (userId) => {
  try {
    // console.log("Searching");
    const blogs = await Blog.find({ creator: userId }).sort({
      createdAt: "desc",
    });
    if (blogs) {
      return {
        success: true,
        error: false,
        blogs: blogs,
      };
    } else
      return {
        success: false,
        error: true,
        blogs: false,
      };
  } catch (error) {
    console.log(error.message);
    return {
      serverError: true,
      success: false,
    };
  }
};
export const findBlog = async (id) => {
  try {
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return {
        blog: false,
      };
    }
    // console.log("Searching");
    const blog = await Blog.findById(id).populate(
      "creator",
      "fname lname imageUrl description expertise"
    );
    if (blog) {
      return {
        blog: blog,
      };
    } else
      return {
        blog: false,
      };
  } catch (error) {
    console.log(error.message);
    return {
      error: true,
      serverError: true,
    };
  }
};

export const createBlog = async (blogData) => {
  try {
    // console.log(blogData)
    const blog = new Blog(blogData);
    await blog.save();
    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.log(error.message);
    if (error.message.includes("Blog validation failed")) {
      const errData = formErrors(Object.values(error.errors));
      // console.log(errData)
      return {
        error: true,
        success: false,
        formError: errData,
      };
    } else {
      return {
        serverError: true,
        success: false,
      };
    }
  }
};

export const removeBlog = async (id) => {
  try {
    await Blog.findByIdAndRemove(id);
    return true;
  } catch (error) {
    console.log(error.message);
    throw new Error("Server Error");
  }
};

export const blogUpdate = async (id, blog, noFile) => {
  try {
    // console.log(id);
    if (noFile) {
      await Blog.findOneAndUpdate(
        { _id: id },
        {
          title: blog.title,
          description: blog.description,
          content: blog.content,
          category: blog.category,
          otherCategory: blog.otherCategory,
          tags: blog.tags,
          updatedAt: Date.now(),
        }
      );
    } else {
      await Blog.findOneAndUpdate(
        { _id: id },
        {
          title: blog.title,
          description: blog.description,
          content: blog.content,
          category: blog.category,
          otherCategory: blog.otherCategory,
          tags: blog.tags,
          imageUrl: blog.imageUrl,
          updatedAt: Date.now(),
        }
      );
    }
    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.log(error.message);
    if (
      error.message.includes("Blog validation failed") ||
      error.message.includes("Validation failed")
    ) {
      console.log("Form Error");
      const errData = formErrors(Object.values(error.errors));
      return {
        error: true,
        formError: errData,
      };
    } else {
      throw new Error("Server Error");
    }
  }
};

export const updateLikes = async (blogId, likes) => {
  try {
    await Blog.findOneAndUpdate({ id: blogId }, { likes: likes });
    // console.log(newLikes);
  } catch (error) {
    console.log(error.message);
    throw new Error("Server Error");
  }
};

export const updateComments = async (commentId, comments) => {
  try {
    // console.log(comments);
    await Blog.findOneAndUpdate({ id: commentId }, { comments: comments });
    return true;
  } catch (error) {
    console.log(error.message);
    throw new Error("Server Error");
  }
};
