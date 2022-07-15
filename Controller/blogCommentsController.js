// This is not implemented  ----> ignore
import { findUser } from "../Services/userServices.js";
import { findBlog, updateComments } from "../Services/blogServices.js";
import {
  addComment,
  viewComments,
  findComment,
  removeComment,
  updateComment,
  updateLikes,
} from "../Services/blogCommentsService.js";

export const getComments = async (req, res) => {
  const commentsData = await viewComments();
  res.json({
    success: true,
    data: commentsData,
  });
};
export const createComment = async (req, res) => {
  try {
    const userId = req.user;
    const { text } = req.body;
    const { id } = req.params;
    let author = false;
    if (!userId) {
      return res.status(401).json({
        error: true,
        auth: false,
        message: "Please Login",
      });
    }
    const validUser = await findUser(userId);
    if (!validUser) {
      return res.status(400).json({
        error: true,
        message: "Invalid User",
      });
    }
    const validBlog = await findBlog(id);
    if (!validBlog.blog) {
      return res.status(400).json({
        error: true,
        message: "Blog does not Exists",
      });
    }
    // if(validBlog.blog.cr)
    const newComment = await addComment(text, userId, id);
    if (newComment.commentErrors) {
      return res.status(400).json({
        error: true,
        commentErrors: newComment.commentErrors,
      });
    }
    validBlog.blog.comments = validBlog.blog.comments.push(newComment.id);
    await updateComments(validBlog._id, validBlog.blog.comments);
    res.status(201).json({
      success: true,
      error: false,
      message: "Successfully Created a Comment",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({
        auth: false,
        error: true,
        message: "Please Login",
      });
    }
    const validUser = await findUser(userId);
    if (!validUser) {
      return res.status(401).json({
        message: "Please Login",
        auth: false,
        error: true,
      });
    }
    const validComment = await findComment(commentId);
    if (!validComment) {
      return res.status(400).json({
        error: true,
        message: "Comment Does Not Exists",
      });
    }
    console.log(validUser._id);
    console.log(validComment.creatorID);
    const isAuthor = validComment.creatorID.equals(validUser._id);
    if (!isAuthor) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized User",
      });
    }
    const validBlog = await findBlog(validComment.blogID);
    if (!validBlog.blog) {
      return res.status(400).json({
        error: true,
        message: "Blog Does Not Exists",
      });
    }
    await removeComment(commentId);
    validBlog.blog.comments = validBlog.blog.comments.filter(
      (comment) => !comment.equals(validComment._id)
    );
    await updateComments(commentId, validBlog.blog.comments);
    res.status(200).json({
      error: false,
      success: true,
      message: "Successfully Deleted Comment",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};

export const updateBlogComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({
        error: true,
        auth: false,
        message: "Please Login",
      });
    }
    const validUser = await findUser(userId);
    if (!validUser) {
      return res.status(401).json({
        error: true,
        auth: false,
        message: "Please Login",
      });
    }
    const validComment = await findComment(commentId);
    if (!validComment) {
      return res.status(404).json({
        error: true,
        message: "Comment not Found",
      });
    }
    const updComment = await updateComment(commentId, text);
    if (updComment.commentErrors) {
      return res.status(400).json({
        error: true,
        commentErrors: updComment.commentErrors,
      });
    }
    res.status(200).json({
      success: true,
      error: false,
      message: "Comment Successfully Updated",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({
        error: true,
        auth: false,
        message: "Unauthorized User",
      });
    }
    const validUser = await findUser(userId);
    if (!validUser) {
      return res.status(401).json({
        error: true,
        auth: false,
        message: "Please Login",
      });
    }
    const validComment = await findComment(id);
    if (!validComment) {
      return res.status(404).json({
        error: true,
        message: "Comment Not Found",
      });
    }
    if (
      validComment.likes.length === 0 ||
      validComment.likes.includes(validUser._id) === -1
    ) {
      validComment.likes = validComment.likes.push(validUser._id);
      await updateLikes(validUser._id, validComment.likes);
      return res.status(200).json({
        error: false,
        success: true,
        message: "You Liked This Comment",
      });
    } else {
      validComment.likes = validComment.likes.filter(
        (like) => !validUser.equals(like)
      );
      await updateLikes(validUser._id, validComment.likes);
      return res.status(200).json({
        error: false,
        success: true,
        message: "You Disliked This Comment",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};
