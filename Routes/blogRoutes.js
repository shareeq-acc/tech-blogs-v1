import express from "express";
import uploads from "../Utility/multer.js";
import authentication from "../Middleware/Auth.js";
import {
  createNewBlog,
  getBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
  likeBlog,
  getUserBlogs,
} from "../Controller/blogController.js";
const router = express.Router();

// Get All Blogs (Only for production purpose)
router.get("/", authentication, getBlogs);

// Get all Blogs Based on User Id
router.get("/user/:userId", authentication, getUserBlogs);

// Create a New Blog
router.post("/create", authentication, uploads.single("file"), createNewBlog);

// get a particular blog
router.post("/view/:id", authentication, getBlog);

// Delete Blog
router.delete("/delete/:id", authentication, deleteBlog);

// Update Blog
router.put("/update/:blogId", authentication, uploads.single("file"), updateBlog);

// Like/Unlike a Blog
router.put("/like/:id", authentication, likeBlog);

export default router;
