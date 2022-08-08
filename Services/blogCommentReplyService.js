import mongoose from "mongoose";
import BlogCommentReplies from "../Model/blogCommentReplies.js";
import formErrors from "../Common/formErrors.js";

// This Function finds All Comment Replies (only for Production Purpose)
export const findReplies = async () => {
  try {
    const replies = await BlogCommentReplies.find();
    return replies;
  } catch (error) {
    console.log(error.message);
    throw new Error("Server Error");
  }
};

// This Function Find All Replies on a Comment
export const findCommentReplies = async (id) => {
  try {
    const replies = await BlogCommentReplies.find({ commentId: id }).sort({ createdAt: 1 }).populate("creatorId",
      "fname lname imageUrl");
    return {
      error: false,
      success: true,
      replies
    };
  } catch (error) {
    console.log(error.message);
    return {
      error: true,
      serverError: true,
      success: false
    }
  }
};

// This Function Creates a New Reply on an Existing Comment
export const createReply = async (commentId, data) => {
  try {
    const { text, creatorId } = data;

    // Validate Id
    const checkID = mongoose.Types.ObjectId.isValid(commentId);
    // If Not a Valid Id
    if (!checkID) {
      return {
        error: true,
        user: false,
        message: "Please Login Again"
      };
    }

    // Create a New Reply
    const commentReply = new BlogCommentReplies({
      text: text,
      creatorId: creatorId,
      commentId: commentId,
    });

    // Save
    const newReply = await commentReply.save()

    // Populate the New Reply
    const populatedReply = await newReply.populate("creatorId", "fname lname imageUrl")
    return {
      error: false,
      success: true,
      id: populatedReply?._id,
      comment: populatedReply
    };
  } catch (error) {
    console.log(error.message);

    // if Validation Fails
    if (error.message.includes("BlogCommentReplies validation failed")) {

      // Pass the Validation Error Object to formErrors
      const errData = formErrors(Object.values(error.errors));
      return {
        error: true,
        commentErrors: errData,
      };
    } else {
      return{
        serverError:true,
        success:false
      }
    }
  }
};

// This Function gets a particular Reply Based on the Id
export const getReply = async (id) => {
  try {
    // Validate Id
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return false;
    }

    // Find Reply
    const replyData = await BlogCommentReplies.findById(id);
    if (!replyData) {
      return false;
    }
    return replyData;
  } catch (error) {
    console.log(error.essage);
    return{
      serverError:true,
      success:false
    }
  }
};

// This Function Deletes a Reply
export const removeReply = async (id) => {
  try {
    await BlogCommentReplies.findByIdAndDelete(id);
  } catch (error) {
    console.log(error.message);
    return {
      serverError:true,
      success:false
    }
  }
};

// This Function Removes All Replies from a Particular Comment
export const removeCommentReplies = async (id) => {
  try {
    await BlogCommentReplies.deleteMany({ commentId: id });
    return true
  } catch (error) {
    console.log(error.message);
    return {
      serverError:true,
      success:false
    }
  }
};

// This Function Updates a particular Comment Reply
export const updateCommentReply = async (replyId, text) => {
  try {
    // Update
    await BlogCommentReplies.findOneAndUpdate({ _id: replyId }, { text: text, updatedAt: Date.now() }, { new: true });
    
    // Get the Populated Updated Reply
    const populatedReply = await BlogCommentReplies.findById(replyId).populate("creatorId",
      "fname lname imageUrl")
    return {
      error: false,
      success: true,
      reply:populatedReply
    };
  } catch (error) {
    console.log(error.message);

    // Check for Validation Errors
    if (error.message.includes("Validation failed")) {
      const errData = formErrors(Object.values(error.errors));
      return {
        error: true,
        commentErrors: errData,
      };
    }
    return{
      serverError:true,
      success:false
    }
  }
};

// This Function Updates Likes on a Particular Comment Reply
export const updateCommentReplyLikes = async (replyId, likes) => {
  try {
    await BlogCommentReplies.findOneAndUpdate({ _id: replyId }, { likes: likes });
  } catch (error) {
    console.log(error.message);
    return{
      serverError:true,
      success:false
    }
  }
};
