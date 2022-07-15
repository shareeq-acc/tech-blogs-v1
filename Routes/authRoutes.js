import express from "express";
import { refreshToken, checkAuth } from "../Controller/authController.js";
import authentication from "../Middleware/Auth.js";
const router = express.Router();

router.post("/refresh", refreshToken);
router.post("/", authentication, checkAuth);

export default router;
