import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  findOneUser,
  createUser,
  findUser,
  updateUser,
  storeUserSetupInfo,
  setupEmail,
  verifyEmail,
  getUser,
} from "../Services/userServices.js";
import User from "../Model/userSchema.js";
import { getAge } from "../Common/date.js";
import validateUserInfo from "../Common/validateUserSetupInfo.js";
import uploadFile from "../Common/upload.js";
import sendEmail from "../Utility/mail.js";


// Only for Production Purpose
export const getUsers = async (req, res) => {
  const allusers = await User.find();
  res.send(allusers);
};

export const registerUser = async (req, res) => {
  const { fname, lname, username, email, password, cpassword, gender, DOB } =
    req.body;
  if (cpassword !== password) {
    return res.status(400).json({
      message: "Passwords do not Match",
      formErrors: {
        password: "Passwords do not match",
        cpassword: "Passwords do not match",
      },
      success: false,
    });
  }
  const calcAge = getAge(DOB);
  if (calcAge < 16) {
    return res.status(400).json({
      error: true,
      formErrors: {
        DOB: "You Must be Atleast 16 to Create an Account",
      },
      success: false,
    });
  }
  const existingUserEmail = await findOneUser("email", email);
  const existingUserUsername = await findOneUser("username", username);
  if (existingUserEmail) {
    return res.status(400).json({
      message: "User with this email already exists",
      formErrors: {
        email: "User with this email already exists",
      },
      success: false,
    });
  }
  if (existingUserUsername) {
    return res.status(400).json({
      message: "User with this Username already exists",
      formErrors: {
        username: "User with this Username already exists",
      },
      success: false,
    });
  }
  if (existingUserEmail.serverError || existingUserUsername.serverError) {
    return res.status(500).json({ message: "Server Error", success: false });
  }

  const newUser = new User({
    fname,
    lname,
    email,
    username,
    password,
    gender,
    DOB,
  });
  const createNewUser = await createUser(newUser);
  if (createNewUser?.serverError) {
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
  if (createNewUser?.formErrors) {
    return res.status(400).json({
      message: "Form Error",
      formErrors: createNewUser.formErrors,
      success: false,
    });
  }
  // console.log(createNewUser)
  res.status(201).json({
    success: true,
    error: false,
    id: createNewUser.id
  })
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        formErrors: {
          main: "Please Fill All the Fields"
        },
        success: false,
      });
    }
    const validUser = await findOneUser("email", email);
    if (!validUser) {
      return res.status(400).json({
        formErrors: {
          main: "Invalid Email or Password"
        },
        success: false,
      });
    }
    if (validUser.serverError) {
      return res.status(500).json({
        serverError: true,
      });
    }

    const validUserPass = await bcrypt.compare(password, validUser.password);
    if (!validUserPass) {
      return res.status(400).json({
        formErrors: {
          main: "Invalid Email or Password"
        },
        success: false,
      });
    }
    if (!validUser.emailValidation?.validated) {
      return res.status(403).json({
        error: true,
        success: false,
        validated: false,
        userId: validUser._id
      })
    }
    let profileSetup = false
    if (validUser.description != "" || validUser.expertise != "") {
      profileSetup = true
    }
    const accessToken = jwt.sign(
      {
        // exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: validUser._id,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      {
        data: validUser._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // console.log(token)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });
    res.status(200).json({
      messsage: "User Login Success",
      success: true,
      token: accessToken,
      profileImage: validUser.imageUrl,
      userId: validUser._id,
      setup: profileSetup
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      serverError: true,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      serverError: true,
      success: false,
      message: "Failed to logout User",
    });
  }
};

export const setUpUser = async (req, res) => {
  const userId = req.user
  const { expertise, description } = req.body
  const file = req.file
  try {
    if (!userId) {
      return res.status(401).json({
        error: true,
        success: false,
        "message": "Please Login",
        login: false
      })
    }
    const validInfo = validateUserInfo({ expertise, description, file })
    if (validInfo.error) {
      return res.status(400).json({
        error: true,
        success: false,
        formError: validInfo.form,
        message: validInfo.message,
        stage: validInfo.stage
      })
    }
    let fileUrl;
    if (file) {
      const fileUpload = await uploadFile(file.path, process.env.USER_IMAGE_PRESET_CLOUDINARY)
      if (fileUpload.serverError) {
        return res.status(500).json({
          success: false,
          serverError: true,
          stage: 2
        });
      }
      fileUrl = fileUpload.url
    }
    const storeUserSetup = await storeUserSetupInfo(userId, { expertise, description, fileUrl })
    if (storeUserSetup.error) {
      return res.status(500).json({
        serverError: true,
        success: false,
      })
    }
    res.status(200).json({
      error: false,
      success: true,
      profileImage: file ? fileUrl : false
    })
  } catch (error) {
    res.status(500).json({
      serverError: true,
      success: false,
    });

  }

}
export const emailUser = async (req, res) => {
  const id = req.body?.id
  // console.log(id)
  try {
    if (!id) {
      return res.status(403).json({
        error: true,
        success: false,
        user: false
      })
    }
    const validateId = await findUser(id)
    if (!validateId) {
      return res.status(403).json({
        error: true,
        success: false,
        user: false,
      })
    }
    if (validateId?.emailValidation?.validated) {
      return res.status(403).json({
        error: true,
        success: false,
        message: 'You Are Already Validated',
        alreadyValidated: true
      })
    }
    if (Date.now() < validateId?.emailValidation?.nextValidation) {
      // Spamming Request
      return res.status(400).json({
        error: true,
        success: false,
        message: "Wait before Sending another Request"
      })
    }
    const emailToken = jwt.sign(
      {
        data: id,
      },
      process.env.EMAIL_TOKEN_SECRET,
      {
        expiresIn: "1200s",    //20 Minutes Expiry
      }
    );
    const emailResponse = await sendEmail(validateId.fname, validateId.email, emailToken)
    if (!emailResponse) {
      return res.status(500).json({
        serverError: true,
        success: false,
        message: "Could Not Send Email, Please Try Again"
      });
    }
    const setTimer = await setupEmail(id)
    if (!setTimer) {
      res.status(500).json({
        serverError: true,
        success: false,
      });
    }
    res.status(200).json({
      error: false,
      success: true,
      nextValidation: setTimer?.nextTimer
    })

  } catch (error) {
    // console.log(error.message)
    res.status(500).json({
      serverError: true,
      success: false,
    });
  }
}

export const activateAcount = async (req, res) => {
  try {
    const { token } = req.params
    let payload;
    if (!token) {
      return res.status(400).json({
        error: true,
        success: false,
        invalidRequest: true
      })
    }
    jwt.verify(
      token,
      process.env.EMAIL_TOKEN_SECRET,
      (error, data) => {
        if (data) {
          payload = data.data; //User ID
        }
        if (error) {
          return res.status(400).json({
            success: false,
            error: true,
            invalidRequest: true,
          });
        }
      }
    );

    const verifyId = await findUser(payload)
    if (!verifyId) {
      return res.status(400).json({
        success: false,
        error: true,
        invalidRequest: true
      });
    }
    const activateUser = await verifyEmail(payload)

    if (!activateUser) {
      return res.status(400).json({
        success: false,
        error: true,
        invalidRequest: true
      });
    }
    return res.status(200).json({
      error: false,
      success: true,
      message: "Email Validated"
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      serverError: true,
      success: false
    })
  }
}

export const getUserInfo = async (req, res) => {
  try {
    const { id } = req.body
    // console.log(id)
    if (id != req.user || !id) {
      return res.status(403).json({
        error: true,
        success: false,
        permission: false
      })
    }
    const response = await getUser(id)
    if (!response) {
      return res.status(500).json({
        serverError: true,
        success: false,
      })
    }

    res.status(200).json({
      error: false,
      success: true,
      data: response
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      serverError: true,
      success: false,
    })
  }
}
export const newPass = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    // console.log(user);
    const { oldPassword, newPassword, cpassword } = req.body;
    const userExists = await findUser(id);
    if (!userExists) {
      return res.status(400).json({
        error: true,
        success: false,
        permission: false
      });
    }
    if (id !== user) {
      return res.status(401).json({
        error: true,
        success: false,
        permission: false
      });
    }
    if (userExists.serverError) {
      return res.status(500).json({
        success: false,
        serverError: true,
      });
    }
    if (cpassword !== newPassword) {
      return res.status(400).json({
        error: true,
        success: false,
        message: {
          newPassword: "Passwords do not match",
          cpassword: "Passwords do not match"
        }
      })
    }
    const validOldPass = await bcrypt.compare(oldPassword, userExists.password);
    if (!validOldPass) {
      return res.status(400).json({
        error: true,
        success: false,
        message: {
          oldPassword: "Invalid Password"
        }
      });
    }
    if (newPassword.length > 20 || newPassword.length < 7) {
      return res.status(400).json({
        error: true,
        success: false,
        message: {
          newPassword: "Password Must be between 7-20 Characters"
        },
        length: newPassword
      });
    }
    const hashedPass = await bcrypt.hash(newPassword, 10);
    const updatedUser = updateUser(id, { password: hashedPass });
    if (updatedUser.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }
    return res.status(200).json({
      error: false,
      success: true,
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      serverError: true,
      success: false
    });
  }
};