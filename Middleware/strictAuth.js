import jwt from "jsonwebtoken";
const strictAuthentication = (req, res, next) => {
  const accessToken = req.header("Authorization")?.split(" ")[1];
  // const accessToken = req.cookies["accessToken"];

  // console.log("AccessTokein is ", accessToken)
  if (accessToken) {
    console.log("access Token is Present");
    jwt.verify(accessToken, process.env.TOKEN_SECRET, (error, data) => {
      if (data) {
        req.user = data.data;
      } else {
        return res.status(401).json({
          error: true,
          success: false,
          auth: false,
        });
      }
    });
  } else {
    return res.status(401).json({
      error: true,
      success: false,
      auth: false,
    });
  }
  next();
};

export default strictAuthentication;
