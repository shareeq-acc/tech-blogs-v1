import jwt from "jsonwebtoken";
const authentication = (req, res, next) => {
  const accessToken = req.header("Authorization")?.split(" ")[1];
  let expired = false
  if (accessToken) {
    console.log("Access Token is Present")
    jwt.verify(accessToken, process.env.TOKEN_SECRET, (error, data) => {
      if (!error && data) {
        req.user = data.data;
        // console.log(accessToken)
        console.log("Valid Access Token")
      } else {
        console.log("Token Expired")
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
