import express from "express";
import uploads from "../Utility/multer.js";
import authentication from "../Middleware/Auth.js";
import {
  createNewBlog,
  getHomeBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
  likeBlog,
  getUserBlogs,
} from "../Controller/blogController.js";
const router = express.Router();

// Get Home Blogs 
router.get("/", getHomeBlogs);

// Get all Blogs Based on User Id
router.get("/user/:userId", authentication, getUserBlogs);

// Create a New Blog - Requires Auth
router.post("/create", authentication, uploads.single("file"), createNewBlog);

// get a particular blog
router.post("/view/:id", authentication, getBlog);

// Delete Blog - Requires Auth
router.delete("/delete/:id", authentication, deleteBlog);

// Update Blog - Requires Auth
router.put("/update/:blogId", authentication, uploads.single("file"), updateBlog);

// Like/Unlike a Blog - Requires Auth
router.put("/like/:id", authentication, likeBlog);

export default router;
