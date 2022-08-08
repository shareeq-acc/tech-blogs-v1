import User from "../Model/userSchema.js";
import mongoose from "mongoose";
import formErrors from "../Common/formErrors.js";

// This Function finds a user based on the field and it's value provided
export const findOneUser = async (field, data) => {
  let filterData = {};
  try {
    filterData[field] = data;
    const user = await User.findOne(filterData);
    if (user) {
      // User Found
      return user;
    } else {
      // No User Found
      return false;
    }
  } catch (error) {
    console.log(error.message);
    return {
      serverError: true
    }
  }
};

// This Function Creates a New User
export const createUser = async (user) => {
  try {
    const userDetails = await user.save();
    return {
      error: false,
      id: userDetails._id
    };
  } catch (error) {

    // Check for validation Error
    if (error.message.includes("User validation failed")) {
      const errData = formErrors(Object.values(error.errors));

      // Return response  with validation errors
      return {
        error: true,
        formErrors: errData,
      };
    } else {
      return {
        serverError: true,
      };
    }
  }
};

// This Function Finds a user Based on the Id provided
export const findUser = async (id) => {
  try {

    // Check if it is valid mongoose Id
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return false;
    }

    // Find User
    const userExists = await User.findById(id);
    if (userExists) {
      // return user data
      return userExists;
    } else {
      return false;
    }
  } catch (error) {
    return {
      serverError: true,
    };
  }
};

// This Function Updated User's info
export const updateUser = async (id, data) => {
  try {
    const updatedSuccess = await User.findByIdAndUpdate(id, data);
    if (updatedSuccess) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message)
    return {
      serverError: true,
    };
  }
};

// This Function Stores the user's setup data into database
export const storeUserSetupInfo = async (id, { expertise, description, fileUrl }) => {
  try {

    // Check if Id provided is a Valid Mongoose Id
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return {
        error: true,
        success: false
      }
    }

    // File Url is the user's profile image url
    // If File Url is present then Store the Setup Data and User's image
    if (fileUrl) {
      await User.findByIdAndUpdate(id, { expertise, description, imageUrl: fileUrl })
    } else {
      // Else just store Setup data without image
      await User.findByIdAndUpdate(id, { expertise, description })
    }
    return {
      error: false,
      success: true
    }

  } catch (error) {
    return{
      error:true,
      success:false,
      serverError:true
    }
  }
}

// This Function Stores the Timer and email validation Status 
export const setupEmail = async (id) => {
  try {
    const nextTimer = Date.now() + 120000 
    await User.findByIdAndUpdate(id, {
      emailValidation: {
        validated: false,
        validationTime: Date.now(),
        nextValidationTime: nextTimer
      }
    })
  
    // Return the timer for next request
    return {
      nextTimer
    }
  } catch (error) {
    console.log(error.message)
    return {
      serverError:true
    }
  }
}

// This Function Activates User's account
export const verifyEmail = async (id) => {
  try {
    await User.findByIdAndUpdate(id, {
      emailValidation: {
        validated: true
      }
    })
    return true
  } catch (error) {
    return false
  }
}

// This Function Fetches Specific User Data for the frontend
export const getUser = async (id) => {
  try {
    // Verify if it is a valid mongoose Id
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return false;
    }
    // Find User
    const response = await User.findById(id)

    // Filter the required fields 
    const { password, emailValidation, ...data } = response.toObject() 

    return data
  } catch (error) {
    return {
      serverError:true
    }
  }
}