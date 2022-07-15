import blogReducer from "../features/Blogs/blogsSlice.js"
import userReducer from "../features/User/userSlice.js"
import { combineReducers } from "redux"

const rootReducer = combineReducers({
    blogs: blogReducer,
    user:userReducer
})

export default rootReducer