// This is not implemented  ----> ignore


import {
  createReply,
  findReplies,
  getReply,
  removeReply,
  updateCommentReply,
  updateCommentLikes
} from "../Services/blogCommentReplyService.js";
import {
  findComment,
  updateCommentReplies,
} from "../Services/blogCommentsService.js";
import { findUser } from "../Services/userServices.js";

export const getReplies = async (req, res) => {
  try {
    const allReplyData = await findReplies();
    res.status(200).json({
      data: allReplyData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};
export const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user;
    const { text } = req.body;
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
      return res.status(400).json({
        error: true,
        message: "Comment Does Not Exists",
        comment: false,
      });
    }
    const payload = {
      text,
      creatorId: validUser._id,
    };

    const reply = await createReply(validComment._id, payload);
    console.log("Reply is", reply);
    if (reply.blogErrors) {
      return res.status(400).json({
        error: true,
        blogErrors: reply.blogErrors,
      });
    }
    validComment.replies = validComment.replies.push(reply.id);
    const updateReplies = await updateCommentReplies(
      validComment._id,
      validComment.replies
    );
    if (updateCommentReplies.commentError) {
      return res.status(400).json({
        error: true,
        commentError: updateReplies.commentErrors,
      });
    }
    res.status(201).json({
      error: true,
      message: "Successfully Replied",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;
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
        error: true,
        auth: false,
        message: "Please Login",
      });
    }
    const checkReply = await getReply(replyId);
    if (!checkReply) {
      return res.status(404).json({
        error: true,
        message: "Comment does Not Exist",
      });
    }
    if (!checkReply.creatorId.equals(validUser._id)) {
      return res.status(401).json({
        error: true,
        message: "You Cannot Delete This Comment Reply",
      });
    }
    const commentId = checkReply.commentId;
    await removeReply(replyId);
    const validComment = await findComment(commentId);
    const newRepliesArray = validComment.replies.filter(
      (reply) => !reply.equals(checkReply._id)
    );
    console.log(newRepliesArray);
    await updateCommentReplies(commentId, newRepliesArray);

    res.status(200).json({
      error: false,
      message: "Successfully Deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};

export const updateReply = async (req, res) => {
  try {
    const { id } = req.params;
    // const id = req.params.replyId
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
    const validReply = await getReply(id);
    if (!validReply) {
      return res.status(404).json({
        error: true,
        message: "Comment not Found",
      });
    }
    const updCommentReply = await updateCommentReply(id, text);
    if (updCommentReply.commentErrors) {
      return res.status(400).json({
        error: true,
        commentErrors: updCommentReply.commentErrors,
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
export const likeReply = async (req, res) => {
  try {
    const { replyId } = req.params;
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
    const validReply = await getReply(replyId);
    if (!validReply) {
      return res.status(404).json({
        error: true,
        message: "Comment Not Found",
      });
    }
    if (
      validReply.likes.length === 0 ||
      validReply.likes.includes(validUser._id) === -1
    ) {
      validReply.likes = validReply.likes.push(validUser._id);
      await updateCommentLikes(validUser._id, validReply.likes);
      return res.status(200).json({
        error: false,
        success: true,
        message: "You Liked This Comment",
      });
    } else {
      validReply.likes = validReply.likes.filter(
        (like) => !validUser.equals(like)
      );
      await updateCommentLikes(validUser._id, validReply.likes);
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
