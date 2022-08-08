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
import { removeBlogComments } from "../Services/blogCommentsService.js";

// Get Blogs For Home Page
export const getHomeBlogs = async (req, res) => {
  try {
    const blogs = await findHomeBlogs();

    // Check if Error Occurred while fetching Blogs
    if (blogs?.serverError) {
      return res.status(500).json({
        success: false,
        serverError: true
      })
    }
    res.status(200).json({
      error: false,
      success: true,
      blogs: {
        mainBlog: blogs.mainBlog,
        homeBlogs: blogs.homeBlogsData
      }
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      serverError: true,
      success: false,
      message: "Failed to Load Blogs Please Try Again",
    });
  }
};

// Get Blogs Based on User
export const getUserBlogs = async (req, res) => {
  const userId = req.params.userId;
  try {

    // Validate UserId
    const validUser = await findUser(userId);

    // If userId is invalid
    if (!validUser) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "User Does Not Exists",
      });
    }

    // If error occurred while Validating User Id
    if (validUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Find Blogs based on User
    const findUserBlogs = await findBlogsByUser(userId);

    // If Error Occured While Fetching Blogs
    if (!findUserBlogs.success) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Success
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

// Get a Particular blog based on Id
export const getBlog = async (req, res) => {
  try {
    let sameUser = false;  // Same user is True if the Blog Requested is Created by the User making this request
    const { id } = req.params;
    const user = req.user;

    const { strict } = req.body // if Strict set to true than User Must Be Logged in

    // If Strict is true and User is not present
    if (strict && !user) {
      return res.status(401).json({
        error: true,
        success: false,
        auth: false,
        message: "Please Login To Continue"
      })
    }

    // Find Blog Based on Id
    const blogData = await findBlog(id);

    // If Blog Does not Exists
    if (!blogData.blog) {
      return res.status(404).json({
        error: true,
        success: false,
        sameUser: false,
        message: "Blog does not Exist",
        blog: false,
      });
    }

    // Error occurred while finding Blog
    if (blogData?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,

      });
    }

    // If userId (present in the parametre) is same as the Blog Creator Id
    if (blogData.blog.creator._id == user) {
      const checkUser = await findUser(user);
      if (checkUser) {
        sameUser = true;
      }
    }

    // Check is Blog is liked by the user
    let liked = false
    if (user) {
      if (blogData.blog.likes.includes(user)) {
        liked = true
      }
    }

    if (!sameUser) {
      return res.status(200).json({
        error: false,
        success: true,
        blog: { ...blogData.blog.toObject(), liked },
        sameUser: false
      });
    } else {
      return res.status(200).json({
        error: false,
        success: true,
        blog: { ...blogData.blog.toObject(), liked },
        sameUser: true
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

// Create a New Blog
export const createNewBlog = async (req, res) => {
  try {
    //  User from JWT Token
    const userId = req.user;
    // Form Data
    const { title, description, content, tags, category, subCategory, otherCategory } =
      req.body;

    // File from Front-end
    const file = req.file;

    // If User Not Present
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

    // If UserId provided is invalid
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

    // If error occurred while Validating User Id
    if (isUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Validate Blog - Blog Validation is first done Manually, because Blog Image then must be uploaded to 3rd Party Cloud Storage
    const validate = validateBlog({
      title,
      content,
      description,
      tags,
      category,
      otherCategory,
      subCategory,
      file,
      noFile: false,
    });

    // Send Error if Validation Failed 
    if (validate.error) {
      return res.status(400).json({
        success: false,
        error: true,
        formError: validate.form,
      });
    }

    // Upload Blog Image to 3rd Part Cloud Storage (Cloudinary)
    const fileUpload = await uploadFile(file.path, process.env.BLOG_MAIN_IMAGE_UPLOAD_PRESET_CLOUDINARY);
    if (fileUpload.serverError) {
      console.log("failed to upload")
      return res.status(500).json({
        success: false,
        serverError: true,
      });
    }

    console.log(fileUpload?.url)

    // Save the Blog and the Image Url to the Database
    const newBlog = await createBlog({
      title,
      description,
      content,
      category,
      otherCategory,
      subCategory,
      tags: tags.split(" "),
      imageUrl: fileUpload.url,
      likes: [],
      comments: [],
      creator: userId,
      likesCount: 0
    });

    // if Error Occurred while Saving data to the database
    if (newBlog.serverError) {
      return res.status(500).json({
        success: false,
        serverError: true,
      });
    }

    // Check for Validation Errors
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

// Delete a Blog
export const deleteBlog = async (req, res) => {
  try {
    const user = req.user;  // User Id that is sent from the Auth Middleware
    const { id } = req.params; // BlogId
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Please Login",
        success: false,
        auth: false,
      });
    }

    // Find Blog based on the id provided
    const validBlog = await findBlog(id);

    // if Blog does not exist
    if (!validBlog.blog) {
      return res.status(400).json({
        error: true,
        message: "Blog Does Not Exists",
        success: false,
        blog: false,
      });
    }

    // if error occurred while Finding Blog
    if (validBlog?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // If Blog Creator id is different from the userId (Requesting User)
    if (validBlog.blog.creator._id != user) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized User",
        success: false,
        auth: false,
      });
    }

    // Image URl
    let fileUrl = validBlog.blog.imageUrl

    // Remove Blog
    const permanentDelete = await removeBlog(id);

    // If error Occurred While Deleting Blog
    if(permanentDelete?.serverError){
      return res.status(500).json({
        serverError:true,
        success:false
      })
    }

    // Delete Blog Comments
    await removeBlogComments(id)

    //  Delete Blog Image from 3rd party Cloud Storage (Cloudinary)
    deleteBlogImage(fileUrl)

    // Success
    res.status(200).json({
      message: "Blog Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      serverError: true,
      success: false,
    });
  }
};

// Update a Blog
export const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const user = req.user;
    const file = req.file;
    const { title, description, content, tags, category, subCategory, otherCategory } =
      req.body;

    // If User is not Present
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

    // Find Blog based on the BlogID
    const validBlog = await findBlog(blogId);

    // If Blog Not Found
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

    // If Error Occurred while Finding Blog
    if (validBlog.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // If BlogCreatorId is not equals to the userId
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
   
    // Validate Blog - Blog Validation s done Manually First to upload the updated Blog image (if present) to third party cloud storage
    const validate = validateBlog({
      title,
      content,
      description,
      tags,
      category,
      subCategory,
      otherCategory,
      file,
      noFile: file ? false : true,
    });

    // if Validdation Error
    if (validate.error) {
      return res.status(400).json({
        success: false,
        error: true,
        formError: validate.form,
      });
    }

    // If File Present Upload it's url to Cloudinary (3rd Party Cloud Storage)
    let fileUrl;
    if (file) {
      const fileUpload = await uploadFile(file.path, process.env.BLOG_MAIN_IMAGE_UPLOAD_PRESET_CLOUDINARY);
      // If Error While Uploading File 
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

    // Update Blog Data
    const BlogDetails = {
      title,
      description,
      content,
      category,
      otherCategory,
      subCategory,
      tags: tags.split(" "),
      imageUrl: fileUrl,
    };

    const update = await blogUpdate(blogId, BlogDetails, file ? false : true);

    // If Validation Error
    if (update.error && update.formError) {
      return res.status(400).json({
        error: true,
        blogErrors: update.blogErrors,
        success: false,
      });
    }

    // If Error Occurred While Updating Blog
    if (update?.serverError) {
      return res.status(500).json({
        serverError: true,
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

// Like or Unlike a Blog
export const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    let likesCount; 
    
    // Find Blog Based on the Id Provided
    const validBlog = await findBlog(id);

    // If Blog is Not Found
    if (!validBlog.blog) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Blog Does Not Exists",
      });
    }

    // If Error Occurred while Finding Blog
    if (validBlog?.serverError) {
      return res.status(400).json({
        serverError: true,
        success: false,
      });
    }

    // If User Id is not Present
    if (!userId) {
      return res.status(401).json({
        error: true,
        auth: false,
        success: false,
      });
    }

    // Find User
    const validUser = await findUser(userId);

    // If UserId does not exists
    if (!validUser) {
      return res.status(400).json({
        error: true,
        success: false,
        auth: false,
      });
    }

    // If Error While Finding USer
    if (validUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Initial Like Count
    likesCount = validBlog.blog.likes.length

    // If UserId is not present in Likes Array, Add User ID
    if (
      validBlog.blog.likes.length === 0 ||
      validBlog.blog.likes.indexOf(validUser._id) === -1
    ) {
      validBlog.blog.likes = validBlog.blog.likes.push(validUser._id);

      // Increment Likes Count
      likesCount = likesCount + 1

      // Update Likes
      await updateLikes(id, validBlog.blog.likes, likesCount);
      return res.status(200).json({
        error: false,
        success: true,
        message: "Successfully Liked This Blog",
        liked: true,
        likesCount
      });
    }

    // If UserId is present in Likes Array, Remove it
    if (validBlog.blog.likes.includes(validUser._id)) {

      // Decrement likes Count
      likesCount = likesCount - 1

      const filteredLikesArray = validBlog.blog.likes.filter(
        (like) => !like.equals(validUser._id)
      )

      // Update Likes
      await updateLikes(id, filteredLikesArray, likesCount);
      return res.status(200).json({
        error: false,
        success: true,
        message: "You Disliked This Blog",
        liked: false,
        likesCount
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};
