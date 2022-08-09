import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout, auth, confirmationEmail, activateAccount, setupUser, getUser, changePass } from "../../../Redux-Api/userApi";
import { toast } from "react-toastify";
import setToken from "../../../Redux-Api/setToken";
import { formServerError, formError, loginUser, formFulfilled, registerUser, setValidation, alreadyValidated, serverFailedSetup, setupPending, setupValidationFailed, setProfile, emailPending, setUserId, emailError, failedToLoadProfile } from "./userSlice";

// User Login
export const loginUserAsync = createAsyncThunk(
    'user/login',
    async ({ loginDetails, navigate }, thunkAPI) => {
        try {
            const response = await login(loginDetails)
            // Set Token if Login Successfull
            setToken(response.data?.token)
            thunkAPI.dispatch(loginUser(response.data))
            // Form Action Completed
            thunkAPI.dispatch(formFulfilled())
            // If User Setup is not completed(false) redirect to Setup
            if (response.data.setup === false) {
                navigate("/user/account-setup")
            } else {
                // Redirect to Home Page
                navigate("/")
            }
        } catch (error) {
            if (error?.response?.data) {
                // Form Validation Errors
                if (error.response.data?.formErrors) {
                    thunkAPI.dispatch(formError(error.response.data))
                    return
                }
                // If User's Email is Not validated
                if (error.response.data?.validated === false) {
                    thunkAPI.dispatch(setUserId(error.response.data?.userId)) // Set User Id to State
                    thunkAPI.dispatch(sendEmail(error.response.data?.userId))  // Send Email
                    return
                }
            } else {
                // Internal Server Error
                thunkAPI.dispatch(formServerError())
            }
        }
    }
);

// User Register
export const registerUserAsync = createAsyncThunk(
    'user/register',
    async ({ userDetails, initialData, setFormData }, thunkAPI) => {
        try {
            const response = await register(userDetails)
            thunkAPI.dispatch(registerUser(response.data))

            // Form Action Completed
            thunkAPI.dispatch(formFulfilled())

            // Clear Form Fields on Success
            setFormData(initialData)

            // Send Confirmation Email
            thunkAPI.dispatch(sendEmail(response?.data?.id))


        } catch (error) {
            if (error?.response?.data) {
                // Validation Errors
                if (error.response.data?.formErrors) {
                    thunkAPI.dispatch(formError(error.response.data))
                    return
                }
            } else {
                // Internal Server Error
                thunkAPI.dispatch(formServerError())
            }
        }
    }
);

// User Logout
export const logoutUserAsync = createAsyncThunk(
    'user/logout',
    async (navigate, { rejectWithValue }) => {
        try {
            const response = await logout()
            if (response?.response) {
                // There is an error from the Server but does not go to the catch Block
                // It is mostly a  404 
                // the Response from the Server is in the response.response.data
                return rejectWithValue(response.response.data)
            }
            // Remove AccessToken
            localStorage.removeItem("token")
            // Redirect to Login
            navigate("/login")
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

// Check for User
export const checkUserAsync = createAsyncThunk(
    'user/check-auth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await auth()
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

// Send Verification Email
export const sendEmail = createAsyncThunk(
    'user/send/email',
    async (id, thunkAPI) => {
        try {
            thunkAPI.dispatch(emailPending())
            toast.loading("Sending Email")
            const response = await confirmationEmail(id)

            // Set Timer for Next Validation Request
            thunkAPI.dispatch(setValidation(response?.data?.nextValidation))
            // Form Process Completed
            thunkAPI.dispatch(formFulfilled())
            toast.dismiss()
            toast.success("Email Sent")
        } catch (error) {
            toast.dismiss()
            toast.error("Failed To Send Email")
            if (error?.response?.data?.alreadyValidated) {   // User Already Validated
                toast.info("You Are Already Validated")
                thunkAPI.dispatch(alreadyValidated())
            }
            if (!error?.response || error?.response?.data?.serverError) { // Internal Server Error
                thunkAPI.dispatch(emailError())
            }
        }
    }
);

// Email Confirmation
export const emailConfirmation = createAsyncThunk(
    'user/activate',
    async ({ token, navigate }, thunkAPI) => {
        try {
            const response = await activateAccount(token)
            thunkAPI.dispatch(alreadyValidated())
        } catch (error) {
            if (error?.response?.data?.invalidRequest) {
                navigate("/login")
            }
            if (!error?.response || error?.response?.data?.serverError) {
                // Server Error
            }
        }
    }
);

// User Setup data
export const storeSetupInfo = createAsyncThunk(
    'user/setup',
    async ({ data, navigate }, thunkAPI) => {
        try {
            thunkAPI.dispatch(setupPending())
            const response = await setupUser(data)

            // If User Uploaded a Profile Image - Set to State
            if (response?.data?.profileImage) {
                thunkAPI.dispatch(setProfile(response.data.profileImage))
            }
            navigate("/")
            return response.data
        } catch (error) {
            // console.log(error.response.data)
            if (error?.response?.data) {
                if (!error.response || error.response.data?.serverError) {
                    // Internal Server Error
                    thunkAPI.dispatch(serverFailedSetup())
                    return
                }
                if (error.response.data?.login === false) {
                    // User Not Logged Inn
                    navigate("/login")
                    return
                }
                if (error.response.data?.formError) {
                    // Validation Errors
                    thunkAPI.dispatch(setupValidationFailed(error.response.data))
                    return
                }
            }
        }
    }
);

// Set User Data to State- For Profile page
export const showUserProfileData = createAsyncThunk(
    'user/setup',
    async ({ id, navigate }, thunkAPI) => {
        try {
            const response = await getUser(id)
            return response.data
        } catch (error) {
            if (error?.response?.data?.permission === false) {
                // Unauthorized User - Logout Current User
                thunkAPI.dispatch(logoutUserAsync(navigate))
                return
            }
            if (error?.response?.data?.serverError) {
                thunkAPI.dispatch(failedToLoadProfile())
                return
            }

        }
    }
);

// Change User Password
export const changeUserPasswordAsync = createAsyncThunk(
    'user/change-password',
    async ({ id, data, navigate, setPassValues, initialValues }, thunkAPI) => {
        try {
            const response = await changePass(id, data)
            // Reset Password Field Values to initial (if success)
            setPassValues(initialValues)
            toast.success("Successfully Updated Password")
        } catch (error) {
            if (error?.response?.data?.permission === false) {
                // Unauthorized User - Logout Current User
                thunkAPI.dispatch(logoutUserAsync(navigate))
            }
            // Internal Server Error
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
);



