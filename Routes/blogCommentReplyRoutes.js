import express from "express";
import {
  addReply,
  getReplies,
  deleteReply,
  updateReply,
  likeReply,
} from "../Controller/blogCommentReplyController.js";
import authentication from "../Middleware/Auth.js";
const router = express.Router();

router.get("/", getReplies);

// Add a New Reply to a Comment
router.post("/create/:commentId", authentication, addReply);

// Delete a Reply
router.delete("/delete/:replyId", authentication, deleteReply);

// Update a Comment
router.put("/update/:id", authentication, updateReply);

// Like a Blog
router.put("/like/:replyId", authentication, likeReply);
export default router;
