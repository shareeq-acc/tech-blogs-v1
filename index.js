import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path"


// Routes
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";
import blogComments from "./Routes/blogComments.js";
import blogCommentReply from "./Routes/blogCommentReplyRoutes.js";

// Database Connection
import dbConnection from "./Model/modelConnect.js";

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.use("/blog/comment", blogComments);
app.use("/blog/comment/reply", blogCommentReply);

// Port
const PORT = process.env.PORT || 8000;
dbConnection();

// --------------------------deployment------------------------------
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  // app.use(express.static(path.join(__dirname, "/client/build")));
  app.use(express.static("/client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}
// --------------------------deployment------------------------------


// Routes
app.listen(PORT, () => {
  console.log("Update 1")
  console.log(`Server is Running on Port ${PORT}`);
});
