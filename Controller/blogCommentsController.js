import { findUser } from "../Services/userServices.js";
import { findBlog, updateComments } from "../Services/blogServices.js";
import {
  addComment,
  viewComments,
  findComment,
  removeComment,
  updateComment,
  updateLikes,
  fetchBlogComments,
  findTotalDocs
} from "../Services/blogCommentsService.js";
import { removeCommentReplies } from "../Services/blogCommentReplyService.js";

// Only for Production Purpose
export const getComments = async (req, res) => {
  const commentsData = await viewComments();
  res.json({
    success: true,
    data: commentsData,
  });
};

// Get all Comments on a Particular Blog
export const getBlogComments = async (req, res) => {
  try {
    // Pagination Implemented
    const { id } = req.params // BlogID
    const start = parseInt(req.query.start) // Start position of Comments as Pagination is implemented
    let end = false
    const totalDocuments = await findTotalDocs(id) // Find Total Comments
    const limit = 5 // Limit for Comments
    const stop = start + limit // Stop is the end position for fetching Comments

    // If Start Postion is greater than Total Documents, then no more documents are to be fetched
    if (start > totalDocuments?.total) {
      return res.status(202).json({
        error: false,
        success: true,
        end: true,
        comments: [],
        noContent: true
      })
    }

    // If the Last Position of comments (stored in stop) that are yet to be fetched is greator or equals to the total Documents, then there would be no more further fetching Comments (Pagination End)
    if (stop >= totalDocuments?.total) {
      end = true
    }

    // Get Comments
    const blogComments = await fetchBlogComments(id, start, limit);

    // If Blog Does Not Exists
    if (blogComments?.error) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Blog Does Not Exists, It may be deleted"
      })
    }

    // If Error Occurred while fetching comments
    if (blogComments?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      })
    }

    res.json({
      success: true,
      comments: blogComments.comments,
      nextStart: stop,
      end,
    });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      serverError: true,
      success: false
    })
  }
};

// Creating a New Comment on a Blog
export const createComment = async (req, res) => {
  try {
    const userId = req.user;
    const { text } = req.body; // Comment Text
    const { id } = req.params; // Blog Id

    // If  no userId provided
    if (!userId) {
      return res.status(401).json({
        error: true,
        success: false,
        auth: false,
      });
    }

    // Find Total documents (Comments)
    const totalDocuments = await findTotalDocs(id)

    // Internal Server Error While Finding Total Documents
    if (totalDocuments?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      })
    }

    // Find User Based on the userId
    const validUser = await findUser(userId);

    // If User Does Not Exists
    if (!validUser) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Please Login Again",
      });
    }
    // If Error Occurred while Finding user
    if (validUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Find Blog Based on the Blog Id provided (in the parametre)
    const validBlog = await findBlog(id);

    // If Blog Does Not Exists
    if (!validBlog.blog) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Blog does not Exists, It may be Deleted",
      });
    }
    // If Error Occurred while Finding Blog
    if (validBlog?.serverError) {
      return res.status(500).json({
        error: true,
        success: false,
      });
    }

    // Save Comment to database
    const newComment = await addComment(text, userId, id);

    // Check for Validation errors
    if (newComment.commentErrors) {
      return res.status(400).json({
        error: true,
        commentErrors: newComment.commentErrors,
        success: false
      });
    }
    // If Error Occurred While Saving Comment
    if (newComment?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }

    // Add the Comment Id to the Blog's Comment Array
    validBlog.blog.comments = validBlog.blog.comments.push(newComment.id);

    // Update Comments on the Blog
    const updateBlogCommentsOnDB = await updateComments(validBlog.blog._id, validBlog.blog.comments);

    // if Error Occurred While Updating Blog Comments
    if (updateBlogCommentsOnDB?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      })
    }

    res.status(201).json({
      success: true,
      error: false,
      message: "Successfully Created a Comment",
      comment: newComment.comment,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};

// Delete a Comment on a Blog
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user;

    // No User Id Provided
    if (!userId) {
      return res.status(401).json({
        auth: false,
        success: false,
        error: true,
      });
    }

    // Find User Based on the Id
    const validUser = await findUser(userId);

    // If No user found with the Id
    if (!validUser) {
      return res.status(403).json({
        auth: false,
        error: true,
        success: false
      });
    }
    // If Error Occuured While Finding User
    if (validUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }

    // Find Comment
    const validComment = await findComment(commentId);

    // If No Comment Found
    if (!validComment) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Comment Does Not Exists, It May Be Deleted",
      });
    }
    // If Error Occurred while Finding Comment
    if (validComment?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Check if Comment Creator Id is equals to the UserId
    const isAuthor = validComment.creatorId.equals(validUser._id);

    // If The User Id is different from the Comment's creatorId - Unauthorized User
    if (!isAuthor) {
      return res.status(403).json({
        error: true,
        success: false,
        unAuthorizedUser: true
      });
    }

    // Find Blog
    const validBlog = await findBlog(validComment.blogID);

    // If No Blog Found
    if (!validBlog.blog) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Blog Does Not Exists, It May be Deleted",
      });
    }
    // If Error Occurred While Finding Blog
    if (validBlog?.serverError) {
      return res.status(500).json({
        error: true,
        success: false,
      });
    }

    // Remove Comment
    const removeCommentonDB = await removeComment(commentId);

    // If Error Occurred While Removing Comment
    if (removeCommentonDB?.serverError) {
      return res.status(500).json({
        error: true,
        success: false,
      });
    }

    // Remove Comment Id from the Blog's Comment Array
    validBlog.blog.comments = validBlog.blog.comments.filter(
      (comment) => !comment.equals(validComment._id)
    );

    // Update Blog's Comment Array
    await updateComments(validBlog?.blog?._id, validBlog.blog.comments);

    // Delete All Replies on the Comment
    const deleteReplies = await removeCommentReplies(commentId)

    // If Error Occurred
    if (!deleteReplies) {
      res.status(500).json({
        serverError: true,
        success: false,
      });
    }

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

// Update a Blog Comment
export const updateBlogComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user;

    // If No userId provided
    if (!userId) {
      return res.status(401).json({
        error: true,
        auth: false
      });
    }

    // Find User Based on the userId
    const validUser = await findUser(userId);

    // If No user found
    if (!validUser) {
      return res.status(403).json({
        error: true,
        auth: false,
        message: "Please Login",
      });
    }
    // If Error Occurred While Finding User
    if (validUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }

    // Find Comment based on the Comment Id
    const validComment = await findComment(commentId);

    // If No Comment Found
    if (!validComment) {
      return res.status(400).json({
        error: true,
        message: "Comment not Found",
      });
    }
    // If Error Occurred While Finding Comment
    if (validComment?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }

    // Comment Text Validation
    if (text?.length > 150) {
      return res.status(400).json({
        error: true,
        message: "Comment should not exceed Characters"
      })
    }
    if (text?.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Please Enter Comment"
      })
    }

    // Update Comment
    const updComment = await updateComment(commentId, text);

    // Validation Error
    if (updComment.commentErrors) {
      return res.status(400).json({
        error: true,
        commentErrors: updComment.commentErrors,
      });
    }

    // If Error Occurred While Updating Comments
    if (updComment.serverError) {
      return res.status(500).json({
        error: true,
        serverError: true,
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Comment Successfully Updated",
      comment: updComment?.comment //New Updated Comment
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      serverError: true,
    });
  }
};

// Like a Comment on a Blog
export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;  // CommentId
    const userId = req.user;

    // If No User Id Provided
    if (!userId) {
      return res.status(401).json({
        error: true,
        auth: false,
        message: "Unauthorized User",
      });
    }

    // Find User Based on the User Id
    const validUser = await findUser(userId);

    // If User does Not Exists
    if (!validUser) {
      return res.status(403).json({
        error: true,
        auth: false,
      });
    }

    // If Error Occurred while Finding User
    if (validUser?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Find Comment based on the Comment Id provided (in the parameter)
    const validComment = await findComment(id);

    // If No Comment Found
    if (!validComment) {
      return res.status(404).json({
        error: true,
        message: "Comment Not Found",
      });
    }
    // If Error Occurred while Finding Comment
    if (validComment?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }

    // If Comment is Not Likes
    if (
      validComment.likes.length === 0 ||
      validComment.likes.includes(validUser._id) === -1
    ) {
      // Add CommentId to the Array
      validComment.likes = validComment.likes.push(validUser._id);

      // Update Likes
      const newLikesArrayDb = await updateLikes(id, validComment.likes);

      // If Error Occurred
      if (newLikesArrayDb?.serverError) {
        res.status(500).json({
          error: true,
          serverError: true,
        });
      }
      return res.status(200).json({
        error: false,
        success: true,
        liked: true,
        user: userId
      });
    } else {

      // Remove CommentId from the Array
      validComment.likes = validComment.likes.filter(
        (like) => !validUser.equals(like)
      );

      // Update Likes
      const newLikesArrayDb = await updateLikes(id, validComment.likes);

      // If Error Occurred
      if (newLikesArrayDb?.serverError) {
        res.status(500).json({
          error: true,
          serverError: true,
        });
      }
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
