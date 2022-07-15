import jwt from "jsonwebtoken";
import { findUser } from "../Services/userServices.js";

export const refreshToken = async (req, res) => {
  console.log("Refreshing Token");
  try {
    let payload;
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken || refreshToken === "") {
      return res.status(401).json({
        auth: false,
        message: "Please Login To Continue",
        success: false,
      });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, data) => {
        if (data) {
          payload = data;
        }
        if (error) {
          // console.log("Error, Jwt not Valid");
          return res.status(401).json({
            auth: false,
            message: "Please Login to Continue",
            success: false,
          });
        }
      }
    );
    const verifyUser = await findUser(payload.data);
    if (!verifyUser) {
      return res.status(401).json({
        error: true,
        success: false,
        auth: false,
      });
    }

    const token = jwt.sign(
      {
        data: payload.data,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "15s",
      }

    );
    res.status(200).json({
      success: true,
      auth: true,
      token: token,
      profileImage: verifyUser.imageUrl,
      userId: verifyUser._id,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      serverError: true,
    });
  }
};

export const checkAuth = async (req, res) => {
  // console.log("Auth")
  try {
    if (!req.user) {
      // console.log("No User");
      return res.status(401).json({
        error: true,
        success: false,
        messsage: "Unauthorized User",
        auth: false,
      });
    }
    const verifyUser = await findUser(req.user);

    if (!verifyUser) {
      return res.status(401).json({
        error: true,
        success: false,
        auth: false,
      });
    }
    res.status(200).json({
      error: false,
      success: true,
      messsage: "Authorized User",
      auth: true,
      profileImage: verifyUser.imageUrl,
      userId: verifyUser._id,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      serverError: true,
    });
  }
};
