import Blog from "../Model/blogSchema.js";
import formErrors from "../Common/formErrors.js";
import mongoose from "mongoose";

// This Function fetches Home Blogs based on Categories and Likes
export const findHomeBlogs = async () => {
  try {
    const mainBlog = await Blog.find({}, "title description createdAt creator likes imageUrl").sort({ likesCount: -1 }).limit(1).populate(
      "creator",
      "fname lname imageUrl expertise"
    );

    // Trending
    const trendingBlogs = await Blog.find({}, "title description createdAt creator likes imageUrl").sort({ likesCount: -1 }).skip(1).limit(10)

    // Hardware
    const hardwareBlogs = await Blog.find({ category: "hardware" }, "title description createdAt creator likes imageUrl").sort({ likesCount: -1 }).limit(10)

    // Consoles
    const consoleBlogs = await Blog.find({ category: "consoles" }, "title description createdAt creator likes imageUrl").sort({ likesCount: -1 }).limit(10)

    // Peripherals
    const peripheralBlogs = await Blog.find({ category: "peripherals" }, "title description createdAt creator likes imageUrl").sort({ likesCount: -1 }).limit(10)

    return {
      success: true,
      mainBlog,
      homeBlogsData: [
        {
          category: "Trending",
          blogs: trendingBlogs,
        },
        {
          category: "Hardware",
          blogs: hardwareBlogs,
        },
        {
          category: "Consoles",
          blogs: consoleBlogs,
        },
        {
          category: "Peripherals",
          blogs: peripheralBlogs,
        },
      ]
    };
  } catch (error) {
    console.log(error.message);
    return {
      success: false,
      serverError: true
    };
  }
};

// This Function Fetches All Blogs by a particular user
export const findBlogsByUser = async (userId) => {
  try {
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

// This Function get a Blog Based on the Id Provided
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

// This Function Creates a New Blog
export const createBlog = async (blogData) => {
  try {
    const blog = new Blog(blogData);
    await blog.save();
    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.log(error.message);
    // Check for Validation Errors
    if (error.message.includes("Blog validation failed")) {
      // Pass the Validation Error to formErrors function
      const errData = formErrors(Object.values(error.errors));
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

// This Function Removes a Blog Based on the Id Provided
export const removeBlog = async (id) => {
  try {
    await Blog.findByIdAndRemove(id);
    return true;
  } catch (error) {
    return{
      serverError:true
    }
  }
};

// This Function Updates Blog
export const blogUpdate = async (id, blog, noFile) => {
  try {
    // If file is not present then update other provided fields only
    if (noFile) {
      await Blog.findOneAndUpdate(
        { _id: id },
        {
          title: blog.title,
          description: blog.description,
          content: blog.content,
          category: blog.category,
          subCategory: blog.subCategory,
          otherCategory: blog.otherCategory,
          tags: blog.tags,
          updatedAt: Date.now(),
        }
      );
    } else {
        // If file is present then update other provided fields and file
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

    // Check for Validation Errors
    if (
      error.message.includes("Blog validation failed") ||
      error.message.includes("Validation failed")
    ) {
      console.log("Form Error");
      const errData = formErrors(Object.values(error.errors));
      return {
        error: true,
        formError: errData,
        success:false
      };
    } else {
      // Error while Updating
      return{
        serverError:true,
        success:false
      }
    }
  }
};

// This function Updates User Likes
export const updateLikes = async (blogId, likes, count) => {
  try {
    await Blog.findOneAndUpdate({ _id: blogId }, { likes: likes, likesCount: count });
  } catch (error) {
    return{
      success:false,
      serverError:true
    }
  }
};

// This Function Updates Comments on a Blog
export const updateComments = async (blogId, comments) => {
  try {
    await Blog.findOneAndUpdate({ _id: blogId }, { comments: comments });
    return true;
  } catch (error) {
    console.log(error.message);
    return{
      success:false,
      serverError:true
    }
  }
};
