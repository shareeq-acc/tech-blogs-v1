import {
  createReply,
  findReplies,
  getReply,
  removeReply,
  updateCommentReply,
  findCommentReplies,
  updateCommentReplyLikes
} from "../Services/blogCommentReplyService.js";
import {
  findComment,
  updateCommentReplies,
} from "../Services/blogCommentsService.js";
import { findUser } from "../Services/userServices.js";

// Get All Replies (only for production purpose)
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

// Get All Replies of a Particular Comment
export const getCommentReplies = async (req, res) => {
  try {
    const { commentId } = req.params

    // Find Comment
    const validComment = await findComment(commentId)

    // If Comment does Not Exists
    if (!validComment) {
      return res.status(400).json({
        error: true,
        message: "Comment not Found",
      });
    }
    // If Error while Finding Comment
    if (validComment?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }

    // Find All Replies of a Comment
    const findReplies = await findCommentReplies(commentId)

    // If error Occurred 
    if (findReplies.error) {
      return res.status(500).json({
        serverError: true,
        success: false
      })
    }

    // Success
    res.status(200).json({
      success: true,
      error: false,
      replies: findReplies?.replies
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};

// Create a New Reply on a Comment
export const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user;
    const { text } = req.body; // New Comment Text

    // If No UserId provided
    if (!userId) {
      return res.status(401).json({
        error: true,
        auth: false,
      });
    }

    // Find User Based on userId
    const validUser = await findUser(userId);

    // If No User Exists
    if (!validUser) {
      return res.status(403).json({
        error: true,
        auth: false,
        message: "Please Login",
      });
    }
    // If error while finding User
    if (validUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Find Comment
    const validComment = await findComment(commentId);

    // If Comment Does Not exists
    if (!validComment) {
      return res.status(400).json({
        error: true,
        message: "Comment Does Not Exists, It May Be Deleted",
        comment: false,
      });
    }
    // If Error While finding Comment
    if (validComment?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    const payload = {
      text,
      creatorId: validUser._id,
    };
    // Save Reply
    const reply = await createReply(validComment._id, payload);

    // If Validation Error
    if (reply?.commentErrors) {
      return res.status(400).json({
        error: true,
        message: reply.commentErrors,
      });
    }
    // If Error Occcurred While Saving Reply
    if (reply?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }

    // Add Reply Id to the Comment's replies Array
    validComment.replies = validComment.replies.push(reply?.id);

    // Update Comment's replies Array
    const updateReplies = await updateCommentReplies(
      validComment._id,
      validComment.replies
    );

    // If Error Occurred
    if (!updateReplies.success) {
      return res.status(500).json({
        error: true,
        success: false,
        serverError: true
      })
    }

    // Success 
    res.status(201).json({
      error: false,
      message: "Successfully Replied",
      id: reply?._id,
      comment: reply?.comment
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};

// Delete a Reply on a Comment
export const deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user;

    // If No UserId provided
    if (!userId) {
      return res.status(401).json({
        auth: false,
        error: true,
      });
    }

    // Find user with the provided UserId
    const validUser = await findUser(userId);

    // If User Does Not Exists
    if (!validUser) {
      return res.status(403).json({
        error: true,
        auth: false,
        message: "Please Login",
      });
    }
    // If Error While Finding User
    if (validUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Find Reply that is to be deleted
    const checkReply = await getReply(replyId);

    // If Reply Does Not Exists
    if (!checkReply) {
      return res.status(400).json({
        error: true,
        message: "Comment does Not Exist",
      });
    }
    // If Error While Finding Reply
    if (checkReply?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }

    // If Reply Creator Id is not Equals to the provided UserId
    if (!checkReply.creatorId.equals(validUser._id)) {
      return res.status(401).json({
        error: true,
        message: "You Cannot Delete This Comment Reply",
      });
    }

    // Remove Reply
    const commentId = checkReply.commentId;
    await removeReply(replyId);

    // Remove ReplyId from the Comment's replies Array
    const validComment = await findComment(commentId);
    const newRepliesArray = validComment.replies.filter(
      (reply) => !reply.equals(checkReply._id)
    );

    // Update Comment's Replies Array
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

// Update Comment Reply
export const updateReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const { text } = req.body;
    const userId = req.user;

    // If No User Id Provided
    if (!userId) {
      return res.status(401).json({
        error: true,
        success: false,
        auth: false,
      });
    }

    // Find User With the User ID
    const validUser = await findUser(userId);

    // If user does not exists
    if (!validUser) {
      return res.status(401).json({
        error: true,
        success: false,
        auth: false,
        message: "Please Login",
      });
    }
    // If error while finding user
    if (validUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Find Reply
    const validReply = await getReply(replyId);

    // If No Reply Exists
    if (!validReply) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Comment Reply not Found, Kindly Refresh Page",
      });
    }
    // If Error While Finding Reply
    if (validReply?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Find Comment
    const validComment = findComment(validReply.commentId)

    // If Comment Does Not Exists
    if (!validComment) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Comment not Found, Kindly Refresh Page",
      });
    }

    // If Error While Finding Comment
    if (validComment?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Update Reply
    const updCommentReply = await updateCommentReply(replyId, text);

    // If Validation Error
    if (updCommentReply.commentErrors) {
      return res.status(400).json({
        error: true,
        commentErrors: updCommentReply.commentErrors, // Validation Error
      });
    }
    // If Internal Error  Occurred while Updating Reply
    if (updCommentReply.commentErrors) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      error: false,
      message: "Comment Successfully Updated",
      reply: updCommentReply?.reply  // New Updated Reply
    }); 
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};

// Like a Reply on a Comment
export const likeReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user;

    // If No UserID is Present
    if (!userId) {
      return res.status(401).json({
        error: true,
        auth: false,
      });
    }

    // Find user based on the userId
    const validUser = await findUser(userId);

    // If No User Exists
    if (!validUser) {
      return res.status(403).json({
        error: true,
        auth: false,
        message: "Please Login",
      });
    }

    // If Internal Server Error While Finding User
    if (validUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success:false
      });
    }

    // Find Reply
    const validReply = await getReply(replyId);

    // If Reply Does Not Exists
    if (!validReply) {
      return res.status(400).json({
        error: true,
        message: "Comment Not Found",
      });
    }
    // If Internal Server Error while Finding reply
    if (validReply?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }

    // If User did not like this Reply - Add Like
    if (
      validReply.likes.length === 0 ||
      validReply.likes.includes(validUser._id) === -1
    ) {
      // Add UserId to Likes Array
      validReply.likes = validReply.likes.push(validUser._id);

      // Update Reply Likes  Array
      await updateCommentReplyLikes(replyId, validReply.likes);
      return res.status(200).json({
        error: false,
        success: true,
        liked: true,
        user: userId
      });
    } else {
      // Remove Like - Remove UserId from the Reply Likes Array
      validReply.likes = validReply.likes.filter(
        (like) => !validUser.equals(like)
      );

      // Update Likes
      await updateCommentReplyLikes(replyId, validReply.likes);
      return res.status(200).json({
        error: false,
        success: true,
        liked: false,
        user: userId
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
