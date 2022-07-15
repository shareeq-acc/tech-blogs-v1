import mongoose from "mongoose";
// import { isEmail, isAlpha, isAlphanumeric } from "validator/lib";
import validator from "validator";
import bcrypt from "bcrypt";
const { Schema } = mongoose;
const userSchema = new Schema({
  fname: {
    type: String,
    required: [true, "First Name cannot be empty"],
    trim: true,
    minlength: [3, "First Name Should be atleast 3 Alphabets "],
    maxlength: [10, "First Name Should not be more than 10 Alphabets"],
    validate: [validator.isAlpha, "First Name must contain only Alphabets"],
  },
  lname: {
    type: String,
    required: [true, "Last Name Cannot be Empty"],
    trim: true,
    minlength: [3, "Last Name Should be atleast 3 Alphabets "],
    maxlength: [10, "Last Name Should not be more than 10 Alphabets"],
    validate: [validator.isAlpha, "Last Name must contain only Alphabets"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter an email"],
    trim: true,
    validate: [validator.isEmail, "Invalid Email"],
  },
  username: {
    type: String,
    required: [true, "Please enter User Name"],
    trim: true,
    minlength: [3, "Username Should be atleast 3 Characters"],
    maxlength: [10, "Username Should not be more than 10 Characters"],
    validate: [
      validator.isAlphanumeric,
      "User Name must only contain Alphabets and Numbers",
    ],
  },
  password: {
    type: String,
    required: [true, "Password Cannot be Empty"],
    minlength: [7, "Password Should be atleast 7 Characters"],
    maxlength: [20, "Password cannot exceed 20 Characters"],
    validate: [
      validator.isAlphanumeric,
      "Password must contain Numbers and Alphabets",
    ],
  },
  gender: {
    type: String,
    required: [true, "Please Select Your Gender"],
  },
  DOB: {
    type: String,
    required: [true, "Please Enter your Date of Birth"],
    maxlength: [10, "Please Re-Enter Your Date of Birth"],
  },
  imageUrl: {
    type: String,
    minlength: [59, "Invalid Url"],
    maxlength: [120, "Invalid Url"],
    trim: true,
    default: null,
  },
  description: {
    type: String,
    default: "",
    maxlength: [200, "Description must not exceed 200 Characters"],
    trim: true,
    required: false
  },
  expertise: {
    type: String,
    default: "",
    maxlength: [50, "Expertise Field must not exceed 50 Characters"],
    trim: true,
    required: false
  },
  emailValidation: {
    validated:{
      type: Boolean,
      default:false,
      required: false
    },
    validationTime: {
      type: Number,
      required: false
    },
    nextValidationTime: {
      type: Number,
      required: false
    }
  }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// userSchema.pre("findOneAndUpdate", function (next) {
//   this.options.runValidators = true;
//   next();
// });
const User = mongoose.model("User", userSchema);
export default User;
