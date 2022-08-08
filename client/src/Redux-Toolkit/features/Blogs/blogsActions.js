import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteBlog, editBlog, getBlog, getBlogs, getUserBlogs, likeBlog, newBlog } from "../../../Redux-Api/BlogApi";
import { toast } from "react-toastify";
import { likeBlogAction, dislikeBlog } from "./blogsSlice";
import { getCommentsAsync } from "./blogCommentAction";

// Fetch Blog for Home Page
export const fetchBlogsAsync = createAsyncThunk(
    'get/blogs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getBlogs()
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

// Fetch All BLogs Based on UserId
export const fetchUserBlogsAsync = createAsyncThunk(
    'get/blogs/user',
    async (blogId, { rejectWithValue }) => {
        try {
            const response = await getUserBlogs(blogId)
            if (response?.response) {
                // There is an error from the Server but does not go to the catch Blog
                // It is most likely a  404 Status Error
                // the Response from the Server is in the response.response.data
                return rejectWithValue(response.response.data)

            }
            // console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

// Fetch a Single BLog
export const fetchSingleBlogAsync = createAsyncThunk(
    'get/blog/:id',
    async ({ blogId, strict, navigate, start }, thunkAPI) => {
        try {
            const response = await getBlog(blogId, strict)
            // console.log(response)
            if (response?.response) {
                // There is an error from the Server but does not go to the catch Blog
                // It is most likely a  404 Status Error
                // the Response from the Server is in the response.response.data
                return thunkAPI.rejectWithValue(response.response.data)

            }
            // Get Comments - Pagination Implemented
            thunkAPI.dispatch(getCommentsAsync({ id: blogId, start }))
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
);

// Create a New Blog
export const createBlogAsync = createAsyncThunk(
    'blog/create',
    async ({ blog, navigate }, { rejectWithValue }) => {
        try {
            const response = await newBlog(blog)
            if (response?.response) {
                // There is an error from the Server but does not go to the catch Blog
                // It is most likely a  404 Status Error
                // the Response from the Server is in the response.response.data
                return rejectWithValue(response.response.data)
            }
            if (response?.data?.creator) {
                navigate(`/blog/user/${response.data.creator}`)
            }
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

// Update an Existing Blog
export const updateBlogAsync = createAsyncThunk(
    'blog/update',
    async ({ blogId, blog, navigate }, { rejectWithValue }) => {
        try {
            const response = await editBlog(blogId, blog)
            if (response?.response) {
                // There is an error from the Server but does not go to the catch Blog
                // It is most likely a  404 Status Error
                // the Response from the Server is in the response.response.data
                return rejectWithValue(response.response.data)

            }

            if (response?.data?.creator) {
                navigate(`/blog/user/${response.data.creator}`)
            }
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

// Delete an Existing BLog
export const deleteBlogAsync = createAsyncThunk("blog/delete", async ({ blogId, setDeleteModal }, { rejectWithValue }) => {
    try {
        const response = deleteBlog(blogId)
        //  Toast 
        toast.promise(
            response,
            {
                pending: 'Deleting Blog',
                success: 'Blog Deleted Successfully',
                error: 'Failed to Delete Blog'
            }
        )
        if (response?.response) {
            // There is an error from the Server but does not go to the catch Blog
            // It is most likely a  404 Status Error
            // the Response from the Server is in the response.response.data
            return rejectWithValue(response.response.data)

        }
        // Set Delete Modal to False
        setDeleteModal(false)
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Like/Unlike an Existing Blog
export const blogLikeAction = createAsyncThunk("blog/like", async ({ id }, thunkAPI) => {
    try {
        const response = await likeBlog(id)
        if (response?.data?.liked) {
            // User Liked This Blog
            thunkAPI.dispatch(likeBlogAction({ likesCount: response.data?.likesCount }))
            toast.success("You Liked This Blog")
        } else {
            // User unliked This Blog
            thunkAPI.dispatch(dislikeBlog({ likesCount: response.data?.likesCount }))
            toast.dismiss()
            toast.success("You Disliked This Blog")
        }
    } catch (error) {
        if (error?.response?.data?.auth === false) {
            // User Not Loggedd In
            toast.error("Please Login To Like This Blog")
            return
        }
        if (error?.response?.message) {
            // If Blog is deleted
            toast.error("Blog Does Not Exists, It May be Deleted")
            return
        }
        if (error?.response?.serverError) {
            // Internal Server Error
            toast.error("Something Went Wrong!, Please Try Again")
            return
        }
    }
})
