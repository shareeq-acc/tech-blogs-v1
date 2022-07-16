import User from "../Model/userSchema.js";
import mongoose from "mongoose";
import formErrors from "../Common/formErrors.js";

export const findOneUser = async (field, data) => {
  let filterData = {};
  try {
    filterData[field] = data;
    const user = await User.findOne(filterData);
    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
    // return {
    //   serverError: true,
    // };
    throw new Error("Server Error");
  }
};

export const createUser = async (user) => {
  try {
    const userDetails = await user.save();
    return {
      error: false,
      id: userDetails._id
    };
  } catch (error) {
    // console.log(error.message);
    if (error.message.includes("User validation failed")) {
      const errData = formErrors(Object.values(error.errors));
      return {
        error: true,
        formErrors: errData,
      };
    } else {
      // return {
      //   error: true,
      //   serverError: true,
      // };
      throw new Error("Server Error");
    }
  }
};

export const findUser = async (id) => {
  try {
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return false;
    }
    const userExists = await User.findById(id);
    if (userExists) {
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
    // throw new Error("Server Error");
  }
};

export const storeUserSetupInfo = async (id, { expertise, description, fileUrl }) => {
  try {
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return {
        error: true,
        success: false
      }
    }
    if (fileUrl) {
      await User.findByIdAndUpdate(id, { expertise, description, imageUrl: fileUrl })
    } else {
      await User.findByIdAndUpdate(id, { expertise, description })
    }
    return {
      error: false,
      success: true
    }

  } catch (error) {
    throw new Error("Server Error");
  }
}
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
    return {
      nextTimer
    }
  } catch (error) {
    console.log(error.message)
    return false
  }
}

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

export const getUser = async (id) => {
  try {
    const checkID = mongoose.Types.ObjectId.isValid(id);
    if (!checkID) {
      return false;
    }
    const response = await User.findById(id)
    const { password, emailValidation, ...data } = response.toObject()
    return data
  } catch (error) {
    return false
  }
}