import mongoose from "mongoose";
import BlogCommentReplies from "../Model/blogCommentReplies.js";
import formErrors from "../Common/formErrors.js";

export const findReplies = async () => {
  try {
    const replies = await BlogCommentReplies.find();
    return replies;
  } catch (error) {
    console.log(error.message);
    throw new Error("Server Error");
  }
};
export const createReply = async (commentId, data) => {
  try {
    const { text, creatorId } = data;
    // console.log(commentId, creatorId)
    const checkID = mongoose.Types.ObjectId.isValid(commentId);
    if (!checkID) {
      return false;
    }
    const blogReply = new BlogCommentReplies({
      text: text,
      creatorId: creatorId,
      commentId: commentId,
    });
    console.log(blogReply);

    await blogReply.save();
    return {
      error: false,
      blogErrors: false,
      id: blogReply._id,
    };
  } catch (error) {
    console.log(error.message);
    if (error.message.includes("BlogCommentReplies validation failed")) {
      // console.log("Validation Failed")
      const errData = formErrors(Object.values(error.errors));
      return {
        error: true,
        blogErrors: errData,
      };
    } else {
      throw new Error("Server Error");
    }
  }
};

export const getReply = async (id) => {
  try {
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return false;
    }
    const replyData = await BlogCommentReplies.findById(id);
    if (!replyData) {
      return false;
    }
    return replyData;
  } catch (error) {
    console.log(error.essage);
    throw new Error("Server Error");
  }
};

export const removeReply = async (id) => {
  try {
    await BlogCommentReplies.findByIdAndDelete(id);
  } catch (error) {
    console.log(error.message);
    throw new Error("Server Error");
  }
};

export const updateCommentReply = async (replyId, text) => {
  try {
    await BlogCommentReplies.findOneAndUpdate({ id: replyId }, { text: text });
    return {
      error: false,
      success: true,
    };
  } catch (error) {
    console.log(error.message);
    if (error.message.includes("Validation failed")) {
      const errData = formErrors(Object.values(error.errors));
      return {
        error: true,
        commentErrors: errData,
      };
    }
    throw new Error("Server Error");
  }
};

export const updateCommentLikes = async (replyId, likes) => {
  try {
    await BlogCommentReplies.findOneAndUpdate({ id: replyId }, { likes: likes });
  } catch (error) {
    console.log(error.message);
    throw new Error("Server Error");
  }
};
