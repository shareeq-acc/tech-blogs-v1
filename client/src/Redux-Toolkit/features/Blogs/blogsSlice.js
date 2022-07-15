import { createSlice } from '@reduxjs/toolkit';
import { fetchBlogsAsync, fetchSingleBlogAsync, createBlogAsync, updateBlogAsync, fetchUserBlogsAsync, deleteBlogAsync } from './blogsActions';
const initialState = {
    status: {
        Blogs: "idle",
        CurrentBlog: "idle",
        BlogForm: "idle",
        BlogDeletion: "idle"
    },
    data: {
        Blogs: [],
        CurrentBlog: null,
    },
    errors: {
        Blogs: null,
        CurrentBlog: null,
        BlogForm: {
            message: null,
            formError: {}
        },
        BlogAction: null
    }
}
export const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        addBlogFormError: (state, action) => {
            state.errors.BlogForm = {
                message: action.payload?.message, formError: {
                    [action?.payload?.field]: action?.payload?.message
                }
            }
        },
        removeBlogFormError: (state) => {
            state.errors.BlogForm = initialState.errors.BlogForm
        }
    },
    extraReducers: (builder) => {
        builder
            // Set States for Blogs Page
            .addCase(fetchBlogsAsync.pending, (state) => {
                state.status.Blogs = 'pending';
                state.errors.Blogs = null
            })
            .addCase(fetchBlogsAsync.rejected, (state) => {
                state.status.Blogs = 'rejected'
                state.errors.Blogs = "ServerError"
                state.data.Blogs = []
            })
            .addCase(fetchBlogsAsync.fulfilled, (state, action) => {
                state.status.Blogs = 'completed';
                state.data.Blogs = action.payload.data.blogs
                state.errors.Blogs = null
            })

            // Fetch Blogs Based on User
            .addCase(fetchUserBlogsAsync.pending, (state) => {
                state.status.Blogs = 'pending';
                state.errors.Blogs = null
            })
            .addCase(fetchUserBlogsAsync.rejected, (state, action) => {
                state.status.Blogs = 'rejected'
                state.data.Blogs = []
                if (action?.payload?.message) {
                    state.errors.Blogs = action.payload.message
                } else {
                    state.errors.Blogs = "ServerError"
                }
            })
            .addCase(fetchUserBlogsAsync.fulfilled, (state, action) => {
                state.status.Blogs = 'completed';
                state.data.Blogs = action.payload?.blogs
                if (action?.payload?.blogs.length === 0) {
                    state.errors.Blogs = "No Blogs Found"
                } else {
                    state.errors.Blogs = null
                }
            })

            // Create New Blog
            .addCase(createBlogAsync.pending, (state) => {
                state.status.BlogForm = 'pending';
            })
            .addCase(createBlogAsync.rejected, (state, action) => {
                state.status.BlogForm = 'rejected'
                if (action?.payload) {
                    if (action.payload?.serverError) {
                        state.errors.BlogForm = {
                            message: "Something Went Wrong!"
                        }
                        return
                    } else if (action.payload?.formError || action.payload?.message) {
                        state.errors.BlogForm = {
                            message: action.payload?.message ? action.payload.message : Object.values(action.payload?.formError)[0],
                            formError: action.payload?.formError ? action.payload?.formError : {}
                        }

                    }
                } else {
                    state.errors.BlogForm = {
                        message: "Something Went Wrong!"
                    }
                }
            })
            .addCase(createBlogAsync.fulfilled, (state, action) => {
                state.status.BlogForm = 'completed';
                state.errors.BlogForm = null
            })

            // Edit a Blog -> Excactly Same as Creating a New Blog
            .addCase(updateBlogAsync.pending, (state) => {
                state.status.BlogForm = 'pending';
            })
            .addCase(updateBlogAsync.rejected, (state, action) => {
                state.status.BlogForm = 'rejected'
                if (action?.payload) {
                    if (action.payload?.serverError) {
                        state.errors.BlogForm = {
                            message: "Something Went Wrong!"
                        }
                        return
                    } else if (action.payload?.formError || action.payload?.message) {
                        state.errors.BlogForm = {
                            message: action.payload?.message ? action.payload.message : Object.values(action.payload?.formError)[0],
                            formError: action.payload?.formError ? action.payload?.formError : {}
                        }

                    }
                } else {
                    state.errors.BlogForm = {
                        message: "Something Went Wrong!"
                    }
                }
            })
            .addCase(updateBlogAsync.fulfilled, (state, action) => {
                state.status.BlogForm = 'completed';
                state.errors.BlogForm = null
            })

            // Set States for Single Blog Fetch
            .addCase(fetchSingleBlogAsync.pending, (state) => {
                state.status.CurrentBlog = 'pending';
                state.errors.CurrentBlog = null
            })
            .addCase(fetchSingleBlogAsync.rejected, (state, action) => {
                state.status.CurrentBlog = 'rejected'
                state.data.CurrentBlog = null
                if (action?.payload) {
                    if (action.payload?.serverError) {
                        state.errors.CurrentBlog = "ServerError"
                        return
                    }
                    if (action.payload?.message) {
                        state.errors.CurrentBlog = action.payload.message
                    }
                } else {
                    state.errors.CurrentBlog = "ServerError"
                }

            })
            .addCase(fetchSingleBlogAsync.fulfilled, (state, action) => {
                state.status.CurrentBlog = 'completed';
                if (action.payload?.blog) {
                    state.data.CurrentBlog = action.payload.blog
                    state.errors.CurrentBlog = null
                } else {
                    state.data.CurrentBlog = null
                    state.errors.CurrentBlog = "ServerError"
                }
            })


            // Delete Blog
            .addCase(deleteBlogAsync.rejected, (state, action) => {
                state.status.BlogDeletion = "rejected"
                if (action?.payload) {
                    if (action.payload?.serverError) {
                        state.errors.BlogAction = "ServerError"
                        return
                    }
                    if (action.payload?.message) {
                        state.errors.BlogAction = action.payload.message
                    }
                } else {
                    state.errors.BlogAction = "ServerError"
                }

            })
            .addCase(deleteBlogAsync.pending, (state) => {
                state.status.BlogDeletion = "pending"
            })
            .addCase(deleteBlogAsync.fulfilled, (state) => {
                state.status.BlogDeletion = "completed"
            })
    },
})

export const { addBlogFormError, removeBlogFormError } = blogSlice.actions;
export default blogSlice.reducer;