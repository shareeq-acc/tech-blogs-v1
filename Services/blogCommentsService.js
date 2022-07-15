import mongoose from "mongoose";
import formErrors from "../Common/formErrors.js";
import BlogComments from "../Model/blogCommentSchema.js";

export const addComment = async (text, userId, blogId) => {
  try {
    const newComment = new BlogComments({
      text: text,
      blogID: blogId,
      creatorID: userId,
    });
    // console.log(newComment);
    await newComment.save();
    return {
      success: true,
      error: false,
      id: newComment._id,
    };
  } catch (error) {
    console.log(error.message);
    if (error.message.includes("BlogComments validation failed")) {
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

export const viewComments = async () => {
  try {
    const allComments = await BlogComments.find();
    // console.log(allComments)
    return allComments;
  } catch (error) {
    console.log(error.message);
  }
};

export const findComment = async (id) => {
  try {
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return false;
    }
    const validComment = await BlogComments.findById(id);
    if (!validComment) {
      return false;
    }
    return validComment;
  } catch (error) {
    console.log(error.message);
    throw new Error("Server Error");
  }
};

export const removeComment = async (id) => {
  try {
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return false;
    }
    await BlogComments.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateComment = async (id, text) => {
  try {
    await BlogComments.findOneAndUpdate({ id: id }, { text: text });
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

export const updateCommentReplies = async (commentId, reply) => {
  try {
    await BlogComments.findOneAndUpdate({ id: commentId }, { replies: reply });
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

export const updateLikes = async (id, likes) => {
  try {
    await BlogComments.findOneAndUpdate({ id: id }, { likes: likes });
  } catch (error) {
    console.log(error.message);
    throw new Error("Server Error");
  }
};
