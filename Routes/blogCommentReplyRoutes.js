import express from "express";
import {
  addReply,
  getReplies,
  deleteReply,
  updateReply,
  likeReply,
  getCommentReplies,
} from "../Controller/blogCommentReplyController.js";
import authentication from "../Middleware/Auth.js";
const router = express.Router();



// Get Comment Replies
router.get("/:commentId", getCommentReplies);

// Add a New Reply to a Comment -  Requires Auth
router.post("/create/:commentId", authentication, addReply);

// Delete a Reply -  Requires Auth
router.delete("/delete/:replyId", authentication, deleteReply);

// Update a Comment Reply - Requires Auth
router.put("/update/:replyId", authentication, updateReply);

// Like a Comment Reply - Requires Auth
router.put("/like/:replyId", authentication, likeReply);
export default router;
