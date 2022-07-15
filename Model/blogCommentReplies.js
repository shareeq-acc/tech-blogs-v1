import mongoose from "mongoose";

const { Schema } = mongoose;

const blogCommentReplies = new Schema({
  text: {
    type: String,
    required: [true, "Comment cannot be empty"],
    minlength: [3, "Comment should be atleast 3 Characters"],
    maxlength: [150, "Comment cannot be more than 150 Characters"],
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
