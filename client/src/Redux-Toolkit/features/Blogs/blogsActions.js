import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteBlog, editBlog, getBlog, getBlogs, getUserBlogs, newBlog } from "../../../Redux-Api/BlogApi";
import { toast } from "react-toastify";

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
export const fetchUserBlogsAsync = createAsyncThunk(
    'get/blogs/user',
    async (blogId, { rejectWithValue }) => {
        try {
            const response = await getUserBlogs(blogId)
            if (response?.response) {
                // There is an error from the Server but does not go to the catch Blog
                // It May be a 404 or any other Error
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

export const fetchSingleBlogAsync = createAsyncThunk(
    'get/blog/:id',
    async ({ blogId, strict, navigate }, { rejectWithValue }) => {
        try {
            const response = await getBlog(blogId, strict)
            // console.log(response)
            if (response?.response) {
                // There is an error from the Server but does not go to the catch Blog
                // It May be a 404 or any other Error
                // the Response from the Server is in the response.response.data
                return rejectWithValue(response.response.data)

            }
            return response.data
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
);

export const createBlogAsync = createAsyncThunk(
    'blog/create',
    async ({ blog, navigate }, { rejectWithValue }) => {
        try {
            const response = await newBlog(blog)
            if (response?.response) {
                // There is an error from the Server but does not go to the catch Blog
                // It May be a 404 or any other Error
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

export const updateBlogAsync = createAsyncThunk(
    'blog/update',
    async ({ blogId, blog, navigate }, { rejectWithValue }) => {
        try {
            const response = await editBlog(blogId, blog)
            if (response?.response) {
                // There is an error from the Server but does not go to the catch Blog
                // It May be a 404 or any other Error
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

export const deleteBlogAsync = createAsyncThunk("blog/delete", async ({ blogId, navigate, setDeleteModal }, { rejectWithValue }) => {
    try {
        const response = deleteBlog(blogId)
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
            // It May be a 404 or any other Error
            // the Response from the Server is in the response.response.data
            return rejectWithValue(response.response.data)

        }
        setDeleteModal(false)
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})