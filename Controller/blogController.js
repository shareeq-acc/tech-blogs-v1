import { findUser } from "../Services/userServices.js";
import {
  createBlog,
  findBlog,
  removeBlog,
  blogUpdate,
  updateLikes,
  findHomeBlogs,
  findBlogsByUser,
} from "../Services/blogServices.js";
import { validateBlog } from "../Common/validateBlog.js";
import uploadFile from "../Common/upload.js";
import deleteBlogImage from "../Common/deleteBlogImage.js";

export const getBlogs = async (req, res) => {
  // console.log("Getting Blogs")
  try {
    const blogs = await findHomeBlogs();
    if (blogs.success) {
      return res.status(200).json({
        data: blogs,
        success: true,
        error: false,
      });
    } else {
      throw new Error("Failed to Load Blogs");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      serverError: true,
      success: false,
      message: "Failed to Load Blogs Please Try Again",
    });
  }
};
export const getUserBlogs = async (req, res) => {
  const userId = req.params.userId;
  try {
    const validUser = await findUser(userId);
    if (!validUser) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "User Does Not Exists",
      });
    }
    const findUserBlogs = await findBlogsByUser(userId);
    if (!findUserBlogs.success) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }
    res.status(200).json({
      error: false,
      success: true,
      blogs: findUserBlogs.blogs,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      serverError: true,
      success: false,
    });
  }
};
export const getBlog = async (req, res) => {
  // console.log("Getting Single Blog")
  try {
    let sameUser = false;
    const { id } = req.params;
    const user = req.user;

    const { strict } = req.body
    // if Strict set to true than User Must Be Logged in
    if (strict && !user) {
      return res.status(401).json({
        error: true,
        success: false,
        auth: false,
        message: "Please Login To Continue"
      })
    }

    const blogData = await findBlog(id);
    // console.log(blogData);
    if (!blogData.blog) {
      return res.status(404).json({
        error: true,
        success: false,
        sameUser: false,
        message: "Blog does not Exist",
        blog: false,
      });
    }
    if (blogData.blog.creator._id == user) {
      const checkUser = await findUser(user);
      if (checkUser) {
        sameUser = true;
      }
    }
    if (!sameUser) {
      return res.status(200).json({
        error: false,
        success: true,
        blog: blogData.blog,
        sameUser: false,
      });
    } else {
      return res.status(200).json({
        error: false,
        success: true,
        blog: blogData.blog,
        sameUser: true,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      serverError: true,
      message: "Something Went Wrong, Please Try Again"
    });
  }
};

export const createNewBlog = async (req, res) => {
  try {
    //  User from JWT Token
    const userId = req.user;

    // File from Front-end
    const file = req.file;
    console.log(file)
    // Form Data
    const { title, description, content, tags, category, otherCategory } =
      req.body;

    if (!userId) {
      return res.status(401).json({
        error: true,
        authError: true,
        success: false,
        message: "Please Login",
        formError: {
          main: "Please Login"
        }
      });
    }
    // Validate User
    const isUser = await findUser(userId);
    if (!isUser) {
      return res.status(401).json({
        error: true,
        authError: true,
        success: false,
        message: "User does not Exists or is Deleted",
        formError: {
          main: "Please Login"
        }
      });
    }

    // Validate Blog
    const validate = validateBlog({
      title,
      content,
      description,
      tags,
      category,
      otherCategory,
      file,
      noFile: false,
    });
    console.log(validate);
    // Send Error if Validation Failed
    if (validate.error) {
      return res.status(400).json({
        success: false,
        error: true,
        formError: validate.form,
      });
    }
    const fileUpload = await uploadFile(file.path, process.env.BLOG_MAIN_IMAGE_UPLOAD_PRESET_CLOUDINARY);
    console.log(fileUpload);
    if (fileUpload.serverError) {
      return res.status(500).json({
        success: false,
        serverError: true,
      });
    }
    const newBlog = await createBlog({
      title,
      description,
      content,
      category,
      otherCategory,
      tags: tags.split(" "),
      imageUrl: fileUpload.url,
      likes: [],
      comments: [],
      creator: userId,
    });
    // console.log(newBlog);
    if (newBlog.serverError) {
      return res.status(500).json({
        success: false,
        serverError: true,
      });
    }
    if (newBlog.formError) {
      return res.status(400).json({
        error: true,
        success: false,
        formError: newBlog.formError,
      });
    }

    res.status(201).json({
      message: "Successfully Created a New Blog",
      success: true,
      creator: userId,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      serverError: true,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Please Login",
        success: false,
        auth: false,
      });
    }
    const validBlog = await findBlog(id);
    if (!validBlog.blog) {
      return res.status(400).json({
        error: true,
        message: "Blog Does Not Exists",
        success: false,
        blog: false,
      });
    }
    if (validBlog.blog.creator._id != user) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized User",
        success: false,
        auth: false,
      });
    }
    let fileUrl = validBlog.blog.imageUrl
    // console.log(fileUrl)
    await removeBlog(id);
    deleteBlogImage(fileUrl)
    res.status(200).json({
      message: "Blog Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      serverError: true,
      message: "Something Went Wrong, Please Try Again.",
      success: false,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const user = req.user;
    const file = req.file;
    const { title, description, content, tags, category, otherCategory } =
      req.body;
    if (!user) {
      return res.status(401).json({
        error: true,
        authError: true,
        success: false,
        message: "Please Login",
        formError: {
          field: "main",
          message: "Please Login",
        }
      });
    }
    const validBlog = await findBlog(blogId);
    if (!validBlog.blog) {
      return res.status(400).json({
        error: true,
        success: false,
        blog: false,
        message: "Blog Does Not Exist",
        formError: {
          main: "Blog Does Not Exist, It may be deleted"
        }
      });
    }
    if (validBlog.blog.creator._id != user) {
      return res.status(401).json({
        error: true,
        authError: true,
        success: false,
        message: "Unauthorized User",
        formError: {
          main: "You do not have Permission to Update Blog"
        }
      });
    }
    // Validate Blog

    // Validate Blog
    const validate = validateBlog({
      title,
      content,
      description,
      tags,
      category,
      otherCategory,
      file,
      noFile: file ? false : true,
    });
    if (validate.error) {
      return res.status(400).json({
        success: false,
        error: true,
        formError: validate.form,
      });
    }
    // console.log(validate)
    let fileUrl;
    if (file) {
      const fileUpload = await uploadFile(file.path, process.env.BLOG_MAIN_IMAGE_UPLOAD_PRESET_CLOUDINARY);
      if (fileUpload.serverError) {
        return res.status(500).json({
          success: false,
          serverError: true,
        });
      }
      fileUrl = fileUpload.url;
    }
    // Delete the previous Blog Image if the User wants to Update it with a newer Image
    if (file) {
      const previousFileUrl = validBlog.blog.imageUrl
      deleteBlogImage(previousFileUrl)
    }
    const BlogDetails = {
      title,
      description,
      content,
      category,
      otherCategory,
      tags: tags.split(" "),
      imageUrl: fileUrl,
    };

    // console.log(blogDetails)
    const update = await blogUpdate(blogId, BlogDetails, file ? false : true);

    if (update.error && update.formError) {
      return res.status(400).json({
        error: true,
        blogErrors: update.blogErrors,
        success: false,
      });
    }
    return res.status(200).json({
      message: "User Updated Successfully",
      success: true,
      creator: validBlog.blog.creator._id,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: true,
      serverError: true,
      success: false,
      message: "Something Went Wrong, Please Try Again",
    });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Blog ID", id);
    const userId = req.user;
    // console.log(userId);
    if (!userId) {
      return res.status(401).json({
        error: true,
        auth: false,
        message: "Please Login",
      });
    }
    const validBlog = await findBlog(id);
    // console.log(validBlog);
    if (!validBlog.blog) {
      return res.status(400).json({
        error: true,
        message: "Blog Does Not Exists",
      });
    }
    const validUser = await findUser(userId);
    if (!validUser) {
      return res.status(400).json({
        error: true,
        auth: false,
        message: "Please Login",
      });
    }
    // console.log("Likes:", validBlog.blog.likes);
    // console.log(validUser._id);
    if (
      validBlog.blog.likes.length === 0 ||
      validBlog.blog.likes.indexOf(validUser._id) === -1
    ) {
      // console.log("Liking");
      validBlog.blog.likes = validBlog.blog.likes.push(validUser._id);
      // console.log("new Array", validBlog.blog.likes);
      await updateLikes(id, validBlog.blog.likes);
      return res.status(200).json({
        error: false,
        success: true,
        message: "You Liked This Blog",
        liked: true,
      });
    }
    if (validBlog.blog.likes.includes(validUser._id)) {
      // console.log("Disliking");
      const filteredLikesArray = validBlog.blog.likes.filter(
        (like) => !like.equals(validUser._id)
      );
      console.log(filteredLikesArray);
      // console.log(filteredLikesArray)
      await updateLikes(id, filteredLikesArray);
      return res.status(200).json({
        error: false,
        success: true,
        message: "You Disliked This Blog",
        liked: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};
