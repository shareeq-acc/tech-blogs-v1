import express from "express";
import authentication from "../Middleware/Auth.js";
const router = express.Router();
import {
  createComment,
  getComments,
  deleteComment,
  updateBlogComment,
  likeComment,
  getBlogComments,
} from "../Controller/blogCommentsController.js";

// Get all Comments (Only for Production Purpose)
router.get("/", getComments);

// Get all Comments of a Blog (Does Not Require Authentication)
router.get("/:id", getBlogComments)

// Create a New Comment (Requires Authentication)
router.post("/create/:id", authentication, createComment);

// Delete an Existing Comment (Requires Authentication)
router.delete("/delete/:commentId", authentication, deleteComment);

// Update an Existing Comment (Requires Authentication)
router.put("/update/:commentId", authentication, updateBlogComment);

// Like an Existing Comment (Requires Authentication)
router.put("/like/:id", authentication, likeComment);

export default router;
