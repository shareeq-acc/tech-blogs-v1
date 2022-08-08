import express from "express";
import { refreshToken, checkAuth } from "../Controller/authController.js";
import authentication from "../Middleware/Auth.js";
const router = express.Router();

// Refresh Token (When AccessToken Expires)
router.post("/refresh", refreshToken);

// Check User Auth - Requires Authentication
router.post("/", authentication, checkAuth);

export default router;
