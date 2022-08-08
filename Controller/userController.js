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


export const registerUser = async (req, res) => {
  const { fname, lname, username, email, password, cpassword, gender, DOB } =
    req.body;

  if (cpassword !== password) {
    // Confirm Password does not match Password 
    return res.status(400).json({
      message: "Passwords do not Match",
      formErrors: {
        password: "Passwords do not match",
        cpassword: "Passwords do not match",
      },
      success: false,
    });
  }

  // Calculate Age with the Date Format using getAge function
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

  // Check if email and Username Already Exists
  const existingUserEmail = await findOneUser("email", email);
  if (existingUserEmail) {
    return res.status(400).json({
      message: "User with this email already exists",
      formErrors: {
        email: "User with this email already exists",
      },
      success: false,
    });
  }
  const existingUserUsername = await findOneUser("username", username);
  if (existingUserUsername) {
    return res.status(400).json({
      message: "User with this Username already exists",
      formErrors: {
        username: "User with this Username already exists",
      },
      success: false,
    });
  }

  // If there is an internal error while Checking For Email/Username, send a 500 Status to frontend
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

  // If there is an internal error while creating User, send a 500 Status to frontend
  if (createNewUser?.serverError) {
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }

  // Check If there are any Validation Errors that are returned by the createNewUser function
  if (createNewUser?.formErrors) {
    return res.status(400).json({
      message: "Form Error",
      formErrors: createNewUser.formErrors,
      success: false,
    });
  }

  res.status(201).json({
    success: true,
    error: false,
    id: createNewUser.id
  })
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if Both Fields are entered
    if (!email || !password) {
      return res.status(400).json({
        formErrors: {
          main: "Please Fill All the Fields"
        },
        success: false,
      });
    }

    // Check if Email Exists
    const validUser = await findOneUser("email", email);
    if (!validUser) {
      return res.status(400).json({
        formErrors: {
          main: "Invalid Email or Password"
        },
        success: false,
      });
    }

    // If there is an internal Error while checking for email
    if (validUser.serverError) {
      return res.status(500).json({
        serverError: true,
      });
    }

    // Compare the password with the corresponding email's encrypted password
    const validUserPass = await bcrypt.compare(password, validUser.password);

    // If the password does NOT match
    if (!validUserPass) {
      return res.status(400).json({
        formErrors: {
          main: "Invalid Email or Password"
        },
        success: false,
      });
    }

    // Check if the User's email is Validated
    if (!validUser.emailValidation?.validated) {
      return res.status(403).json({
        error: true,
        success: false,
        validated: false,
        userId: validUser._id
      })
    }

    // Check if profile Setup is Completed 
    let profileSetup = false
    if (validUser.description != "" || validUser.expertise != "") {
      // The User has already Entered it's profile Setup Info
      profileSetup = true
    }

    // Sign Access Token for frontend with a short duration
    const accessToken = jwt.sign(
      {
        data: validUser._id,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Sign Acess Token for a longer duration for Refreshing the Access Token
    const refreshToken = jwt.sign(
      {
        data: validUser._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Set the Refresh Token in httpOnlyCookie
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
    // Send a 500 status if Internal Error 
    res.status(500).json({
      success: false,
      serverError: true,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Clear Refresh Token
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
  const userId = req.user // req.user is the userId that is decoded using JWT by Auth Middleware
  const { expertise, description } = req.body
  const file = req.file
  try {
    // Check if the User is logged in - Check if req.user has a userId
    if (!userId) {
      return res.status(401).json({
        error: true,
        success: false,
        message: "Please Login",
        login: false
      })
    }

    // Validate the req.body fields - It is Validated Manually First so that the User Profile Image (if present) could be uploaded to 3rd Party Cloud Storage
    const validInfo = validateUserInfo({ expertise, description, file })

    // Checking for Validation Error 
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

    // Upload Image to Cloudinary (if Present and get the url to Store it in DB)
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

    // Store Setup Data in Database
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
    // Return a 500 Status if Internal Error Occured
    res.status(500).json({
      serverError: true,
      success: false,
    });

  }

}

export const emailUser = async (req, res) => {
  const id = req.body?.id  // UserId
  try {
    if (!id) {
      return res.status(403).json({
        error: true,
        success: false,
        user: false
      })
    }
    // Find User with the Id
    const validateId = await findUser(id)

    // If User Does not Exists
    if (!validateId) {
      return res.status(403).json({
        error: true,
        success: false,
        user: false,
      })
    }

    // If There is an error Finding User
    if (validateId?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      })
    }

    // If User's email is already Validated
    if (validateId?.emailValidation?.validated) {
      return res.status(403).json({
        error: true,
        success: false,
        message: 'You Are Already Validated',
        alreadyValidated: true
      })
    }

    // nextValidation is a Timer Set, before next Request for an email to avoid Spamming Email Requests to the Server
    if (Date.now() < validateId?.emailValidation?.nextValidation) {
      // Spamming Request
      return res.status(400).json({
        error: true,
        success: false,
        message: "Wait before Sending another Request"
      })
    }

    // Sign an Email token for verification
    const emailToken = jwt.sign(
      {
        data: id,
      },
      process.env.EMAIL_TOKEN_SECRET,
      {
        expiresIn: "1200s",    //20 Minutes Expiry
      }
    );

    // Send Email
    const emailResponse = await sendEmail(validateId.fname, validateId.email, emailToken)

    // If Failed to Send Email 
    if (!emailResponse) {
      return res.status(500).json({
        serverError: true,
        success: false,
        message: "Could Not Send Email, Please Try Again"
      });
    }

    // Set Timer for Next Email Request and Store info in Database
    const setTimer = await setupEmail(id)

    // If error occurred while saving info
    if (!setTimer || setTimer?.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false,
      });
    }

    // Success
    res.status(200).json({
      error: false,
      success: true,
      nextValidation: setTimer?.nextTimer
    })

  } catch (error) {
    console.log(error.message)
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

    // If Token is not present
    if (!token) {
      return res.status(400).json({
        error: true,
        success: false,
        invalidRequest: true
      })
    }

    // Verify Token
    jwt.verify(
      token,
      process.env.EMAIL_TOKEN_SECRET,
      (error, data) => {
        if (data) {
          payload = data.data; //User ID
        }
        if (error) {
          // Invalid Token
          return res.status(400).json({
            success: false,
            error: true,
            invalidRequest: true,
          });
        }
      }
    );
    
    // Find User by the Id from the payload of the jwt token
    const verifyId = await findUser(payload)

    // If no user found with the provided Id
    if (!verifyId) {
      return res.status(400).json({
        success: false,
        error: true,
        invalidRequest: true
      });
    }

    // If there is an error finding user
    if (verifyId?.serverError) {
      return res.status(500).json({
        success: false,
        serverError: true,
      });
    }

    // Activate User Account and update it's Email Verfication Status
    const activateUser = await verifyEmail(payload)

    // if error occurred while updating user's Activation Status
    if (!activateUser) {
      return res.status(400).json({
        success: false,
        error: true,
        invalidRequest: true
      });
    }
    // Success
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
    const { id } = req.body  // UserId

    // AccessToken (jwt token) is decoded by Auth Middleware to get the userId and is attached to req.user
    if (id != req.user || !id) {
      return res.status(403).json({
        error: true,
        success: false,
        permission: false
      })
    }

    // Find User with the provided Id
    const response = await getUser(id)

    // If no user Exists with the id provided
    if (!response) {
      return res.status(500).json({
        serverError: true,
        success: false,
      })
    }

    // If there is an error finding user
    if (response?.serverError) {
      return res.status(500).json({
        success: false,
        serverError: true,
      });
    }

    // Success
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
    const { id } = req.params; // UserId
    const user = req.user;   // req.user contains the userId that was decoded by an Auth Middleware
    const { oldPassword, newPassword, cpassword } = req.body;

    // If password field and confirm PAssword Field do not match
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

    // If the UserId in the parametre is not the same as the decoded User Id from the AccessToken(JWT Token)
    if (id !== user) {
      return res.status(401).json({
        error: true,
        success: false,
        permission: false
      });
    }

    // Find User based on the Id Provided
    const userExists = await findUser(id);

    // If User does not exists
    if (!userExists) {
      return res.status(400).json({
        error: true,
        success: false,
        permission: false
      });
    }

     // If there is an error finding User Id, send a 500 Status
     if (userExists.serverError) {
      return res.status(500).json({
        success: false,
        serverError: true,
      });
    }

    // Compare the encrypted User Password with the password provided in the req.body
    const validOldPass = await bcrypt.compare(oldPassword, userExists.password);

    // If passwords do not match
    if (!validOldPass) {
      return res.status(400).json({
        error: true,
        success: false,
        message: {
          oldPassword: "Invalid Password"
        }
      });
    }

    // Validating New Password
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

    // Hash the New Password
    const hashedPass = await bcrypt.hash(newPassword, 10);

    // Update the User password
    const updatedUser = updateUser(id, { password: hashedPass });

    // if there is an error updating user's password
    if (updatedUser.serverError) {
      return res.status(500).json({
        serverError: true,
        success: false
      });
    }

    // Success
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