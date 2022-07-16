import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout, auth, confirmationEmail, activateAccount, setupUser, getUser, changePass } from "../../../Redux-Api/userApi";
import { toast } from "react-toastify";

import setToken from "../../../Redux-Api/setToken";
import { formServerError, formError, loginUser, formFulfilled, registerUser, setValidation, alreadyValidated, serverFailedSetup, setupPending, setupValidationFailed, setProfile, emailPending, setUserId, emailError, failedToLoadProfile } from "./userSlice";

export const loginUserAsync = createAsyncThunk(
    'user/login',
    async ({ loginDetails, navigate }, thunkAPI) => {
        try {
            const response = await login(loginDetails)
            setToken(response.data?.token)
            thunkAPI.dispatch(loginUser(response.data))
            thunkAPI.dispatch(formFulfilled())
            // console.log(response.data)
            if (response.data.setup === false) {
                navigate("/user/account-setup")
            } else {
                navigate("/")
            }
        } catch (error) {
            // console.log(error?.response.data)
            if (error?.response?.data) {
                if (error.response.data?.formErrors) {
                    thunkAPI.dispatch(formError(error.response.data))
                    return
                }
                if (error.response.data?.validated === false) {
                    thunkAPI.dispatch(setUserId(error.response.data?.userId))
                    thunkAPI.dispatch(sendEmail(error.response.data?.userId))
                    return
                }
            } else {
                thunkAPI.dispatch(formServerError())
            }
        }
    }
);
export const registerUserAsync = createAsyncThunk(
    'user/register',
    async ({ userDetails, navigate }, thunkAPI) => {
        try {
            const response = await register(userDetails)
            // console.log(response.data)
            thunkAPI.dispatch(registerUser(response.data))
            const verificationEmail = confirmationEmail(response?.data?.id)
            toast.promise(
                verificationEmail,
                {
                    pending: 'Sending Email',
                    success: 'Successfully Sent Email',
                    error: 'Failed to Send Email'
                }
            )
            thunkAPI.dispatch(formFulfilled())
            thunkAPI.dispatch(setValidation(verificationEmail?.data?.nextValidation))
        } catch (error) {
            // console.log(error.response.data)
            if (error?.response?.data) {
                if (error.response.data?.formErrors) {
                    thunkAPI.dispatch(formError(error.response.data))
                    return
                }
            } else {
                thunkAPI.dispatch(formServerError())
            }
        }
    }
);
export const logoutUserAsync = createAsyncThunk(
    'user/logout',
    async (navigate, { rejectWithValue }) => {
        try {
            const response = await logout()
            if (response?.response) {
                // There is an error from the Server but does not go to the catch Blog
                // It May be a 404 or any other Error
                // the Response from the Server is in the response.response.data
                return rejectWithValue(response.response.data)
            }
            localStorage.removeItem("token")
            navigate("/login")
            return response.data
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
);

export const checkUserAsync = createAsyncThunk(
    'user/check-auth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await auth()
            return response.data
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
);

export const sendEmail = createAsyncThunk(
    'user/send/email',
    async (id, thunkAPI) => {
        try {
            thunkAPI.dispatch(emailPending())
            const response = confirmationEmail(id)
            toast.promise(
                response,
                {
                    pending: 'Sending Email',
                    success: 'Successfully Sent Email',
                    error: 'Failed to Send Email'
                }
            )
            thunkAPI.dispatch(setValidation(response?.data?.nextValidation))
            thunkAPI.dispatch(formFulfilled())
        } catch (error) {
            // console.log(error.response.data)
            if (error?.response?.data?.alreadyValidated) {
                thunkAPI.dispatch(alreadyValidated())
            }
            if (!error?.response || error?.response?.data?.serverError) {
                thunkAPI.dispatch(emailError())
            }
        }
    }
);

export const emailConfirmation = createAsyncThunk(
    'user/activate',
    async ({ token, navigate }, thunkAPI) => {
        try {
            const response = await activateAccount(token)
            thunkAPI.dispatch(alreadyValidated())
        } catch (error) {
            // console.log(error.response.data)
            if (error?.response?.data?.invalidRequest) {
                navigate("/login")
            }
            if (!error?.response || error?.response?.data?.serverError) {
                // Server Error
            }
        }
    }
);
export const storeSetupInfo = createAsyncThunk(
    'user/setup',
    async ({ data, navigate }, thunkAPI) => {
        try {
            thunkAPI.dispatch(setupPending())
            const response = await setupUser(data)
            if (response?.data?.profileImage) {
                thunkAPI.dispatch(setProfile(response.data.profileImage))
            }
            navigate("/")
            return response.data
        } catch (error) {
            // console.log(error.response.data)
            if (error?.response?.data) {
                if (!error.response || error.response.data?.serverError) {
                    thunkAPI.dispatch(serverFailedSetup())
                    return
                }
                if (error.response.data?.login === false) {
                    navigate("/login")
                    return
                }
                if (error.response.data?.formError) {
                    thunkAPI.dispatch(setupValidationFailed(error.response.data))
                    return
                }
            }
        }
    }
);

export const showUserProfileData = createAsyncThunk(
    'user/setup',
    async ({ id, navigate }, thunkAPI) => {
        try {
            const response = await getUser(id)
            return response.data
        } catch (error) {
            // console.log(error?.response?.data)
            if (error?.response?.data?.permission === false) {
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
export const changeUserPasswordAsync = createAsyncThunk(
    'user/change-password',
    async ({ id, data, navigate, setPassValues, initialValues }, thunkAPI) => {
        try {
            const response = await changePass(id, data)
            // console.log(response.data)
            setPassValues(initialValues)
            toast.success("Successfully Updated Password")
        } catch (error) {
            // console.log(error?.response?.data)
            if (error?.response?.data?.permission === false) {
                thunkAPI.dispatch(logoutUserAsync(navigate))
            }
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
);



