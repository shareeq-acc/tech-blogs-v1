import express from "express";
import authentication from "../Middleware/Auth.js";
import uploads from "../Utility/multer.js";
import {
  loginUser,
  registerUser,
  newPass,
  logoutUser,
  setUpUser,
  emailUser,
  activateAcount,
  getUserInfo
} from "../Controller/userController.js";

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Logout User
router.delete("/logout", logoutUser);

// Setup User Account - Requires Authentication
router.post("/setup/data", uploads.single("file"), authentication, setUpUser)

// Setup User Email Validation - Requires Authentication
router.post("/setup/email", authentication, emailUser)

// Activate User Account - Verify Email
router.get("/activate/:token", activateAcount)

// Get User Details - Requires Authentication
router.post("/", authentication, getUserInfo)

// Change User Password - Requires Authentication
router.put("/new-password/:id", authentication, newPass);

export default router;
