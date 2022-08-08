import mongoose from "mongoose";
import formErrors from "../Common/formErrors.js";
import BlogComments from "../Model/blogCommentSchema.js";

// This Function Create a New Comment on a Blog
export const addComment = async (text, userId, blogId) => {
  try {
    const newComment = new BlogComments({
      text: text,
      blogID: blogId,
      creatorId: userId,
    });

    // Save Comment to Database
    const response = await newComment.save()

    // Get the newly saved Comment and populate user fields
    const newAddedComment = await BlogComments.findById(response._id).populate("creatorId",
      "fname lname imageUrl");

    return {
      success: true,
      error: false,
      id: newComment._id,
      comment: newAddedComment
    };
  } catch (error) {
    console.log(error.message);

    // Validation Error Check
    if (error.message.includes("BlogComments validation failed")) {

      // Pass the Validation Error Object to formErrors
      const errData = formErrors(Object.values(error.errors));
      return {
        error: true,
        blogErrors: errData,
      };
    } else {
      return{
        success:false,
        serverError:true
      }
    }
  }
};

// This Function Counts the total Comments on a Blog
export const findTotalDocs = async (blogId) => {
  try {
    const total = await BlogComments.countDocuments({ blogID: blogId })
    return {
      success: true,
      total
    }
  } catch (error) {
    console.log(error.message)
    return {
      success: false,
      serverError:true
    }
  }
}

// This function fetches the comments on a particular blog - Pagination implemented
export const fetchBlogComments = async (blogId, start, limit) => {
  try {

    // Validate id
    const checkID = mongoose.Types.ObjectId.isValid(blogId);
    if (!checkID) {
      return {
        error: true
      }
    }

    // Pagination implemented
    const findComments = await BlogComments.find({ blogID: blogId }).sort({ createdAt: -1 }).skip(start).limit(limit).populate("creatorId",
      "fname lname imageUrl");
    return {
      error: false,
      comments: findComments
    }
  } catch (error) {
    console.log(error.message)
    return {
      serverError: true,
      success:false
    }
  }
}

// This Function Fetches all the Comments (only for production purpose)
export const viewComments = async () => {
  try {
    const allComments = await BlogComments.find();
    return allComments;
  } catch (error) {
    console.log(error.message);
  }
};

// This function finds a particualr comment based on the comment Id
export const findComment = async (id) => {
  try {
    // Validate Id
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return false;
    }
    // Find by Id
    const validComment = await BlogComments.findById(id);
    if (!validComment) {
      return false;
    }
    return validComment;
  } catch (error) {
    console.log(error.message);
    return{
      serverError:true,
      success:false
    }
  }
};

// This Function Deletes a Comment based on the id provided
export const removeComment = async (id) => {
  try {
    await BlogComments.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.log(error.message);
    return{
      serverError:true,
      success:false
    }
  }
};

// This Function Updates a Comment
export const updateComment = async (id, text) => {
  try {
    // Update
    await BlogComments.findOneAndUpdate({ _id: id }, { text: text, updatedAt: Date.now()});

    // Populate the Updated Comment
    const updatedComment = await BlogComments.findById(id).populate("creatorId",
      "fname lname imageUrl")
    return {
      error: false,
      success: true,
      comment: updatedComment
    };
  } catch (error) {
    console.log(error.message);
    return {
      serverError: true,
      success: false
    }
  }
};

// This Function Updates the Comment's Reply Array
export const updateCommentReplies = async (commentId, reply) => {
  try {
    await BlogComments.findOneAndUpdate({ _id: commentId }, { replies: reply });
    return {
      error: false,
      success: true,
    };
  } catch (error) {
    console.log(error.message);
    // Check for Validation Errors (highly unlikely)
    if (error.message.includes("Validation failed")) {
      const errData = formErrors(Object.values(error.errors));
      return {
        error: true,
        success: false,
        validationError: errData,
      };
    } else {
      return {
        success: false,
        serverError: true
      }
    }
  }
}

// This Function Updates the Comments's Likes Array
export const updateLikes = async (id, likes) => {
  try {
    await BlogComments.findOneAndUpdate({ _id: id }, { likes: likes });
  } catch (error) {
    console.log(error.message);
    return{
      success:false,
      error:true
    }
  }
};

// This Function Removes All Comments on a Particular Blog
export const removeBlogComments = async (blogID) => {
  try {
    await BlogComments.deleteMany({ blogID: blogID })
    return true
  } catch (error) {
    return {
      serverError:true,
      success:false
    }
  }
}