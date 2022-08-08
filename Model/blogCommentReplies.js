import mongoose from "mongoose";

const { Schema } = mongoose;

const blogCommentReplies = new Schema({
  text: {
    type: String,
    required: [true, "Comment Reply cannot be empty"],
    maxlength: [500, "Comment Reply cannot be more than 500 Characters"],
  },
  creatorId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    maxlength: [30, "Invalid ID"],
    required: true,
  },
  commentId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "BlogComments",
    maxlength: [30, "Invalid ID"],
    required: [true, "Comment ID cannot be Empty"],
  },
  likes: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      maxlength: [30, "User ID is invalid"],
    },
  ],
  createdAt: {
    type: Date,
    default: () => Date.now(),
    maxlength: [100, "Invalid Creation Date"],
  },
  updatedAt: {
    type: Date,
    value: null,
    maxlength: [100, "Invalid Creation Date"],
  },
});

blogCommentReplies.pre("findOneAndUpdate", function (next) {
  this.options.runValidators = true;
  this.updatedAt = Date.now();
  next();
});

const BlogCommentReplies = mongoose.model(
  "BlogCommentReplies",
  blogCommentReplies
);

export default BlogCommentReplies;
