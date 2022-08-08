import mongoose from "mongoose";
const { Schema } = mongoose;

const BlogCommentsSchema = new Schema({
  text: {
    type: String,
    required: [true, "Comment cannot be empty"],
    minlength: [1, "Please Enter Comment"],
    maxlength: [500, "Comment cannot be more than 500 Characters"],
  },
  blogID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Blog",
    maxlength: [30, "Invalid Blog ID"],
    required: true,
    trim: true,
  },
  creatorId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    maxlength: [30, "Comment CreatorID cannot be more than 30 Characters"],
    required: true,
    trim: true,
  },
  likes: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      maxlength: [30, "User ID is invalid"],
    },
  ],
  replies: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "BlogCommentReplies",
      maxlength: [30, "Reply ID is invalid"],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    maxlength: [100, "Date cannot not be more than 100 Characters"],
  },
  updatedAt: {
    type: Date,
    maxlength: [100, "Date cannot not be more than 100 Characters"],
  },
});

BlogCommentsSchema.pre("findOneAndUpdate", function (next) {
  this.options.runValidators = true;
  this.updatedAt = Date.now();
  next();
});

const BlogComments = mongoose.model("BlogComments", BlogCommentsSchema);
export default BlogComments;
