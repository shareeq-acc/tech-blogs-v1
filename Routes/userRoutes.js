import express from "express";
import authentication from "../Middleware/Auth.js";
import uploads from "../Utility/multer.js";
import {
  loginUser,
  registerUser,
  getUsers,
  newPass,
  logoutUser,
  setUpUser,
  emailUser,
  activateAcount,
  getUserInfo
} from "../Controller/userController.js";

const router = express.Router();

// For Production Purpose
router.get("/", getUsers);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.delete("/logout", logoutUser);

router.post("/setup/data", uploads.single("file"), authentication, setUpUser)

router.post("/setup/email", authentication, emailUser)

router.get("/activate/:token", activateAcount)

router.post("/", authentication, getUserInfo)

router.put("/new-password/:id", authentication, newPass);

export default router;
