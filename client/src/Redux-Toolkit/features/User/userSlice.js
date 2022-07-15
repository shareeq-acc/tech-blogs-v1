import { createSlice } from '@reduxjs/toolkit';
import { logoutUserAsync, loginUserAsync, registerUserAsync, checkUserAsync, showUserProfileData, changeUserPasswordAsync } from './userActions';
const initialState = {
    status: {
        Form: "idle",
        userLogin: "idle",
        userRegister: false,
        setup: "idle",
        emailValidation: "idle",
        accountDetails: "idle",
        passwordChange: "idle",
        authCheck: "idle"
    },
    data: {
        login: false,
        profileImage: null,
        id: null,
        fname: null,
        lname: null,
        role: null,
        description: null,
        validation: {
            validated: null,
            nextValidation: null

        },
        setupStage: 1,
        accountDetails: {}
    },
    errors: {
        formErrors: {},
        setup: {
            serverError: false,
            expertise: null,
            description: null,
            profilePicture: null
        },
        emailValidation: null,
        accountDetails: null,
        passwordChange: {
            oldPassword: null,
            newPassword: null,
            cpassword: null
        }
    }
}
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authCheck: (state) => {
            state.status.authCheck = "completed"
        },
        resetState: (state) => {
            state = initialState
        },
        resetFormState: (state) => {
            state.errors.formErrors = {}
            state.status.Form = "idle"
        },
        setProfile: (state, action) => {
            state.data.profileImage = action?.payload
        },
        removeUserFormErrors: (state) => {
            state.errors.formErrors = {}
        },
        formFulfilled: (state) => {
            state.status.Form = "completed"
            state.errors.formErrors = {}
        },
        formError: (state, action) => {
            state.status.Form = "rejected"
            state.errors.formErrors = action?.payload.formErrors

        },
        formServerError: (state) => {
            state.status.Form = "rejected"
            state.errors.formErrors = { main: "Something Went Wrong, Please Try Again" }
        },
        loginUser: (state, action) => {
            state.data.login = true
            state.data.profileImage = action.payload?.profileImage
            state.data.id = action.payload?.userId
            state.status.userLogin = "completed"
            // state.data.emailValidated = action.payload?.emailValidated
        },
        setUserId: (state, action) => {
            state.data.id = action.payload
        },
        registerUser: (state, action) => {
            state.status.userRegister = true
            state.data.id = action?.payload?.id
            state.data.validation.validated = false
        },
        emailPending: (state) => {
            state.status.emailValidation = "pending"
        },
        setValidation: (state, action) => {
            state.data.validation.validated = false
            state.data.validation.nextValidation = action.payload
            state.status.emailValidation = "completed"
        },
        alreadyValidated: (state) => {
            state.validation.validated = true
            state.validation.nextValidation = null
            state.status.emailValidation = "completed"
        },
        emailError: (state) => {
            state.validation.validated = false
            state.validation.nextValidation = null
            state.status.emailValidation = "rejected"
        },
        setStage: (state, action) => {
            state.data.setupStage = action.payload
        },
        setupPending: (state) => {
            state.status.setup = "pending"
            state.errors.setup = initialState.errors.setup
        },
        serverFailedSetup: (state) => {
            state.status.setup = "rejected"
            state.errors.setup.serverError = true
        },
        setupValidationFailed: (state, action) => {
            state.status.setup = "rejected"
            state.errors.setup = {
                serverError: false,
                expertise: action?.payload?.formError?.expertise,
                description: action?.payload?.formError?.description,
                profilePicture: action?.payload?.formError?.file
            }
            state.data.setupStage = action?.payload?.stage
        },
        setupSuccess: (state) => {
            state.status.setup = "completed"
            state.errors.setup = initialState.errors.setup
            state.data.setupStage = 1
        },
        failedToLoadProfile: (state) => {
            state.errors.accountDetails = "Something Went Wrong, Please Try Again"
        },
        removePasswordErrors: (state) => {
            state.errors.passwordChange = initialState.errors.passwordChange
        }
    },
    extraReducers: (builder) => {
        builder
            // Check USER
            .addCase(checkUserAsync.pending, (state) => {
                state.status.userLogin = 'pending';
            })
            .addCase(checkUserAsync.fulfilled, (state, action) => {
                state.status.userLogin = 'idle';
                if (action?.payload) {
                    state.data.login = true
                    state.data.profileImage = action.payload?.profileImage
                    state.data.id = action.payload?.userId
                }
            })
            .addCase(checkUserAsync.rejected, (state) => {
                state.status.userLogin = 'idle';
                state.data = initialState.data
            })
            // lOGOUT USER
            .addCase(logoutUserAsync.pending, (state) => {
                state.status.userLogin = 'pending';
            })
            .addCase(logoutUserAsync.fulfilled, (state) => {
                state.status.userLogin = 'idle';
                state.data = initialState.data
            })
            // lOGIN USER
            .addCase(loginUserAsync.pending, (state) => {
                state.status.Form = "pending"
            })
            // Register USER
            .addCase(registerUserAsync.pending, (state) => {
                state.status.Form = "pending"
            })

            // Account
            .addCase(showUserProfileData.pending, (state) => {
                state.status.accountDetails = "pending"
            })
            .addCase(showUserProfileData.rejected, (state) => {
                state.status.accountDetails = "rejected"
            })
            .addCase(showUserProfileData.fulfilled, (state, action) => {
                state.status.accountDetails = "completed"
                state.data.accountDetails = action?.payload?.data
            })

            // Password Change
            .addCase(changeUserPasswordAsync.pending, (state) => {
                state.status.passwordChange = "pending"

            })
            .addCase(changeUserPasswordAsync.fulfilled, (state) => {
                state.status.passwordChange = "completed"
                state.errors.passwordChange = initialState.errors.passwordChange
            })
            .addCase(changeUserPasswordAsync.rejected, (state, action) => {
                state.status.passwordChange = "rejected"
                if (action?.payload?.message) {
                    state.errors.passwordChange = action.payload.message
                }
                if (action?.payload?.serverError) {
                    state.errors.passwordChange = {
                        serverError: true
                    }
                }
            })
    }


})
export const { authCheck, loginUser, registerUser, setUserId, removeUserFormErrors, setProfile, formFulfilled, formError, formServerError, setValidation, alreadyValidated, emailPending, emailError, resetFormState, resetState, setStage, serverFailedSetup, setupPending, setupValidationFailed, setupSuccess, failedToLoadProfile, removePasswordErrors } = userSlice.actions;
export default userSlice.reducer;