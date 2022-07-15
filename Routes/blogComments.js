import express from "express";
import authentication from "../Middleware/Auth.js";
const router = express.Router();
import {
  createComment,
  getComments,
  deleteComment,
  updateBlogComment,
  likeComment,
} from "../Controller/blogCommentsController.js";

// Get all Comments (Only for Production Purpose)
router.get("/", getComments);

// Create a New Comment
router.post("/create/:id", authentication, createComment);

// Delete an Existing Comment (Requires Authentication)
router.delete("/delete/:commentId", authentication, deleteComment);

// Update an Existing Comment (Requires Authentication)
router.put("/update/:commentId", authentication, updateBlogComment);

// Like an Existing Comment (Requires Authentication)
router.put("/like/:id", authentication, likeComment);
export default router;
