import mongoose from "mongoose";
import User from "./userSchema.js";
const { Schema } = mongoose;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please Enter Blog Title"],
    trim: true,
    minlength: [5, "Blog Title Should be atleast 5 Characters"],
    maxlength: [50, "Blog Title Should not be more than 30 Characters"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Blog Description"],
    trim: true,
    minlength: [20, "Blog Description Should be atleast 20 Characters"],
    maxlength: [140, "Blog Description Should not be more than 140 Characters"],
  },
  content: {
    type: String,
    required: [true, "Please Enter Blog Content"],
    trim: true,
    minlength: [30, "Blog Content Should be atleast 30 Characters"],
    maxlength: [5000, "Blog Content Should not be more than 5000 Characters"],
  },
  category: {
    type: String,
    required: [true, "Please Select Blog Category"],
    trim: true,
    minlength: [2, "Blog Category Should be atleast 2 Characters"],
    maxlength: [10, "Blog Category Should not be more than 10 Characters"],
  },
  otherCategory: {
    type: String,
    trim: true,
    maxlength: [10, "Blog Category Should not be more than 10 Characters"],
  },
  tags: {
    type: [String],
    minlength: [3, "Tags Should be atleast 3 Characters"],
    maxlength: [10, "Tags Should be not be more than 10 Characters"],
    trim: true,
  },
  // tags: [
  //   {
  //     type: String,
  //     minlength: [3, "Tags Should be atleast 3 Characters"],
  //     maxlength: [10, "Tags Should be not be more than 10 Characters"],
  //     trim: true,
  //   },
  // ],
  imageUrl: {
    type: String,
    minlength: [59, "Invalid Url"],
    maxlength: [120, "Invalid Url"],
    trim: true,
  },
  creator: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "Please Enter Blog Creator ID"],
  },
  // likes: [
  //   {
  //     type: mongoose.SchemaTypes.ObjectId,
  //     ref: "User",
  //     maxlength: [15, "User ID is invalid"],
  //     trim: true,
  //     default: () => {
  //       return null;
  //     },
  //   },
  // ],
  likes: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
    maxlength: [15, "User ID is invalid"],
    trim: true,
    required: false,
    default: () => {
      return null;
    },
  },
  comments: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "BlogComments",
    maxlength: [15, "Invalid ID"],
    trim: true,
    required: false,
    default: () => {
      return null;
    },
  },

  // comments: [
  //   {
  //     type: mongoose.SchemaTypes.ObjectId,
  //     ref: "BlogComments",
  //     maxlength: [12, "Invalid ID"],
  //   },
  // ],
  createdAt: {
    type: Date,
    default: Date.now,
    maxlength: [100, "Date cannot not be more than 100 Characters"],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    maxlength: [100, "Date cannot not be more than 100 Characters"],
  },
});

BlogSchema.pre("findOneAndUpdate", function (next) {
  this.options.runValidators = true;
  this.updatedAt = Date.now();
  next();
});

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
