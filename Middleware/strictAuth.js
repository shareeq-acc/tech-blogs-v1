import jwt from "jsonwebtoken";

// This Middleware authenticates User by decoding the JWT Token and attaching the userId in req
// It throws an error or sends back a Response if Token is not Present
const strictAuthentication = (req, res, next) => {
  // Get AccessToken - Format : Bearer ${Token}
  const accessToken = req.header("Authorization")?.split(" ")[1];
  if (accessToken) {
    jwt.verify(accessToken, process.env.TOKEN_SECRET, (error, data) => {
      if (data) {
        req.user = data.data;
      } else {
        // Token is Expired
        return res.status(401).json({
          error: true,
          success: false,
          auth: false,
        });
      }
    });
  } else {
    // Token is not Present
    return res.status(401).json({
      error: true,
      success: false,
      auth: false,
    });
  }
  next();
};

export default strictAuthentication;
