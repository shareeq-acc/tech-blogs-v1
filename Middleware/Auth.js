import jwt from "jsonwebtoken";

// This Middleware authenticates User by decoding the JWT Token and attaching the userId in req
// It does not throw an error or send back a Response if Token is not Present
const authentication = (req, res, next) => {
  // Get AccessToken - Format : Bearer ${Token}
  const accessToken = req.header("Authorization")?.split(" ")[1];
  let expired = false
  if (accessToken) {
    jwt.verify(accessToken, process.env.TOKEN_SECRET, (error, data) => {
      if (!error && data) {
        req.user = data.data;
      } else {
        // Token is Expired
        expired = true
        return res.status(401).json({
          error: true,
          success: false,
          tokenExpired: true
        })
      }
    });
  }
  !expired && next();
};

export default authentication;
