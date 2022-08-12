import { createSlice } from '@reduxjs/toolkit';
import { commentReplyAsync, createNewCommentAsync, deleteCommentAsync, findRepliesAsync, getCommentsAsync, updateExistingComment, updateReplyAsync } from './blogCommentAction';
import { fetchBlogsAsync, fetchSingleBlogAsync, createBlogAsync, updateBlogAsync, fetchUserBlogsAsync, deleteBlogAsync } from './blogsActions';
const initialState = {
    status: {         // Status can either be idle/pending/completed
        Blogs: "idle",
        CurrentBlog: "idle",
        BlogForm: "idle",
        BlogDeletion: "idle",
        comments: "idle",
        commentField: "idle",
        commentEdit: "idle", // Comment Edit Field
        replies: "idle",
        replyField: "idle",
    },
    data: {
        Blogs: [],
        CurrentBlog: null,
        comments: [],
        editComment: {
            id: null,    // Id for the comment to be edited
            text: ""
        },
        commentReply: {
            commentId: null   // Comment Id for Reply Field
        },
        pendingCommentReplyIndex: null,  // Which Comment's Replies are pending - Comment Index that is fetching Replies
        commentReplyEdit: {
            text: "",
            replyId: null   // Reply Id and Text to be edited
        },
        commentPagination: {
            start: 0,
            end: false  // end true mean no more comments to be loaded
        }
    },
    errors: {
        Blogs: null,
        CurrentBlog: null,
        comments: null,
        BlogForm: {
            message: null,
            formError: {}
        },
        BlogAction: null,
        currentComment: null,
        editComment: null,
        commentReply: null
    }
}
export const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        addBlogFormError: (state, action) => {
            state.errors.BlogForm = {
                // Set Blog Form Error
                message: action.payload?.message,
                formError: {
                    [action?.payload?.field]: action?.payload?.message
                }
            }
        },
        // Clear Blog Errors
        removeBlogFormError: (state) => {
            state.errors.BlogForm = initialState.errors.BlogForm
        },
        // Remove Blog Like
        dislikeBlog: (state) => {  // Unlike Blog - Remove Like
            state.data.CurrentBlog.liked = false
            if (state.data.CurrentBlog.likesCount >= 0) {    // Decrement Likes (if greator than 0)
                state.data.CurrentBlog.likesCount = state.data.CurrentBlog.likesCount - 1
            }
        },
        // Add Blog Like
        likeBlogAction: (state) => {
            // Like Blog & increment Likes Count
            state.data.CurrentBlog.liked = true
            state.data.CurrentBlog.likesCount = state.data.CurrentBlog.likesCount + 1

        },

        // Error for Comments 
        commentsError: (state, action) => {
            // Add Comments error(s) to State - Error for Comments Array
            state.errors.comments = action.payload
            state.status.comments = "rejected"
        },

        // Add Comment Validation Error
        commentValidationError: (state, action) => {
            if (action.payload?.update) {
                // Comment is being Updated - Handle Comment Update Errors
                state.status.commentEdit = "rejected"
                state.errors.editComment = action.payload?.maxRange ? "Comment Should Not Exceed 500 characters" : "Please Enter Comment"
            } else {
                // Comment is being created - Handle Comment Creation Errors
                state.status.commentField = "rejected"
                state.errors.currentComment = action.payload?.maxRange ? "Comment Should Not Exceed 500 characters" : "Please Enter Comment"

            }
        },
        // Add a custom Error to the Comment Field (for both creating and editing comment)
        commentErrorWithMessage: (state, action) => {
            // Custom Message Error for Comment
            if (action.payload?.update) {      // Comment being Updated
                state.errors.editComment = action.payload?.message
            } else {                // Comment being Created
                state.errors.currentComment = action.payload?.message
            }
        },
        // Remove a Comment
        removeComment: (state, action) => {
            // Remove Comment from Comment's Array
            state.data.comments = state.data.comments.filter(comment => comment._id !== action.payload)
            // Remove Comment Id from Blog Comment's Array
            state.data.CurrentBlog.comments = state.data.CurrentBlog.comments.filter(comment => comment !== action.payload)
            if (state.data.commentPagination.end === false) {
                // More Pagination left - Decrement
                state.data.commentPagination.start = state.data.commentPagination.start - 1
            }
        },
        // Add a Comment
        addComment: (state, action) => {
            state.errors.currentComment = null
            // Add Comment Id to Blog's Comment Array
            state.data.CurrentBlog.comments.push(action.payload?._id)
            // Add Comment Object to Comment's Array (add it to the start of the Array)
            state.data.comments.unshift(action.payload)

            if (state.data.commentPagination.end === false) {
                // More Pagination left - Increment
                state.data.commentPagination.start = state.data.commentPagination.start + 1
            }
            state.status.commentField = "completed"
        },
        // Update a Comment
        updateComments: (state, action) => {
            let commentFound = false
            let i = 0

            // Iterate through the Comments Array 
            while (commentFound === false && i < state.data.comments?.length) {
                // If Comment Id Matches the Id in the Payload - Replace that Comment with a Newer(updated Comment)
                if (state.data.comments[i]._id === action.payload._id) {
                    state.data.comments[i] = action.payload
                    commentFound = true
                }
                i = i + 1
            }
            state.errors.editComment = null
            state.status.commentEdit = "completed"

        },
        // Add/Remove Like on a Comment
        likeCommentAction: (state, action) => {
            let commentFound = false
            let i = 0

            // Iterate through the Comments Array 
            while (commentFound === false && i < state.data.comments?.length) {

                // If Comment Id Matches the Id in the Payload 
                if (state.data.comments[i]._id === action.payload?.comment) {

                    // If Like is True - Add userId to the likes Array - Else Remove UserId from likes Array
                    if (action?.payload?.liked) {
                        state.data.comments[i].likes.push(action?.payload?.user)
                    } else {
                        state.data.comments[i].likes = state.data.comments[i].likes.filter(like => like !== action?.payload?.user)

                    }
                    commentFound = true
                }
                i = i + 1
            }
        },
        // Add/Remove Like on a Comment Reply
        commentReplyLikeSuccess: (state, action) => {
            let commentFound = false
            let i = 0

            // Iterate through the Replies in the Comment Array - Comment Index is provided in the payload - repliesData has All the Replies of that Comment
            while (commentFound === false && i < state.data.comments[action.payload?.commentIndex]?.repliesData.length) {

                // If Reply Id Matches the Id Provided in Payload
                if (state.data.comments[action.payload?.commentIndex].repliesData[i]._id === action.payload?.reply) {

                    // If Likes is set to true, add userId to the likes Array - Else Remove UserId from the likes Array
                    if (action?.payload?.liked) {
                        state.data.comments[action.payload?.commentIndex].repliesData[i].likes.push(action?.payload?.user)
                    } else {
                        state.data.comments[action.payload?.commentIndex].repliesData[i].likes = state.data.comments[i].likes.filter(like => like !== action?.payload?.user)
                    }
                    commentFound = true
                }
                i = i + 1
            }
        },
        // Set Comment Id and Text in the State for Comment Edit
        setCommmentForEdit: (state, action) => {
            state.data.editComment = {
                id: action?.payload?.id,
                text: action?.payload?.text
            }
        },
        // Clear Comment Id and Text in State for Edit Comment
        removeCommmentForEdit: (state) => {
            state.data.editComment = initialState.data.editComment
        },
        setInitialValueForEdit: (state) => {
            state.data.editComment = initialState.data.editComment
        },
        // Set Loading for Comments'Reply
        setLoadingCommentIndex: (state, action) => {
            state.data.pendingCommentReplyIndex = action.payload
        },
        // Set Reply Id for Reply Edit on a comment
        setReplyIdForEdit: (state, action) => {
            state.data.commentReply.commentId = action.payload
        },
        // Set Error for Reply Field
        commentReplyError: (state, action) => {
            state.status.replyField = "rejected"
            state.errors.commentReply = action.payload
        },
        // Remove Error on Reply Field
        removeCommentReplyError: (state) => {
            state.errors.commentReply = initialState.errors.commentReply
        },
        // Add Reply to a Particualar Comments Array
        addReply: (state, action) => {
            // Comment Index is provided in payload
            // Add Reply Id to comment's replies array
            state.data.comments[action.payload?.index]?.replies.push(action.payload?.comment?._id)

            // If Comment's RepliesData is empty or does not exists
            if (!state.data.comments[action.payload?.index].repliesData) {
                state.data.comments[action.payload?.index].repliesData = [action.payload?.comment]
            } else {
                // Else Push New Reply to repliesData Array
                state.data.comments[action.payload?.index]?.repliesData.push(action.payload?.comment)
            }
            // Clear Comment Reply Id from State
            state.data.commentReply = initialState.data.commentReply
            state.status.replyField = "completed"
        },
        removeCommentReply: (state, action) => {
            // Comment Index is provided in payload
            // Remove Reply Id from Comment's replies Array and Reply Object from Comment's RepliesData Array
            state.data.comments[action.payload?.index].repliesData = state.data.comments[action.payload?.index].repliesData.filter(reply => reply._id !== action?.payload?.id)
            state.data.comments[action.payload?.index].replies = state.data.comments[action.payload?.index].replies.filter(reply => reply !== action?.payload?.id)
        },
        // Set Reply Id and Text to State
        setReplyForEdit: (state, action) => {
            state.data.commentReplyEdit = {
                replyId: action?.payload?.id,
                text: action?.payload?.text
            }
        },
        // Clear Reply Id and Text from state
        removeReplyForEdit: (state) => {
            state.data.commentReplyEdit = initialState.data.commentReplyEdit
        },
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
                // Add Blogs (recieved from sever to State)
                state.data.Blogs = action.payload?.blogs
                // Remove Blogs Error from State
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
                // If recieved empty Blogs Array
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
                    // Revieved a Response from Server
                    if (action.payload?.serverError) {
                        // Internal Server Error
                        state.errors.BlogForm = {
                            message: "Something Went Wrong!"
                        }
                        return
                    } else if (action.payload?.formError || action.payload?.message) {
                        // Validation Error
                        state.errors.BlogForm = {
                            message: action.payload?.message ? action.payload.message : Object.values(action.payload?.formError)[0],  // Add the First Form Validation error Recieved to the message field - For Displaying it in Blog Form
                            formError: action.payload?.formError ? action.payload?.formError : {}
                        }

                    }
                } else {
                    // Server Error
                    state.errors.BlogForm = {
                        message: "Something Went Wrong!"
                    }
                }
            })
            .addCase(createBlogAsync.fulfilled, (state, action) => {
                state.status.BlogForm = 'completed';
                state.errors.BlogForm = null
            })

            // Edit a Blog - Excactly Same as Creating a New Blog
            .addCase(updateBlogAsync.pending, (state) => {
                state.status.BlogForm = 'pending';
            })

            .addCase(updateBlogAsync.rejected, (state, action) => {
                state.status.BlogForm = 'rejected'
                if (action?.payload) {
                    // Revieved a Response from Server
                    if (action.payload?.serverError) {
                        state.errors.BlogForm = {
                            message: "Something Went Wrong!"
                        }
                        return
                    } else if (action.payload?.formError || action.payload?.message) {
                        state.errors.BlogForm = {
                            message: action.payload?.message ? action.payload.message : Object.values(action.payload?.formError)[0], // Add the First Form Validation error Recieved to the message field - For Displaying it in Blog Form
                            formError: action.payload?.formError ? action.payload?.formError : {}
                        }

                    }
                } else {
                    state.errors.BlogForm = {
                        message: "Something Went Wrong!"
                    }
                }
            })
            .addCase(updateBlogAsync.fulfilled, (state) => {
                state.status.BlogForm = 'completed';
                state.errors.BlogForm = null
            })

            // Set States for Single Blog Fetch
            .addCase(fetchSingleBlogAsync.pending, (state) => {
                state.data.comments = []
                state.data.commentPagination = initialState.data.commentPagination // When Fetching a Blog, Reset Pagination for Comments.
                state.status.CurrentBlog = 'pending';
                state.errors.CurrentBlog = null
            })
            .addCase(fetchSingleBlogAsync.rejected, (state, action) => {
                state.status.CurrentBlog = 'rejected'
                state.data.CurrentBlog = null
                if (action?.payload) {
                    // Add Error to state
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
                    // If no Blog recieved
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

            // Load Comments
            .addCase(getCommentsAsync.fulfilled, (state, action) => {
                console.log(action.payload)
                // If Recieved Comments Array is not Empty
                if (action?.payload?.comments?.length > 0) {
                    if (state.data?.comments?.length > 0) {
                        // If there are already Comments Present - Add more Comments - Pagination Implemented
                        state.data.comments = state.data.comments.concat(action.payload?.comments)
                    } else {
                        state.data.comments = action.payload?.comments
                    }
                }
                if (action.payload.end) {
                    // If End is true than no more comments are to be loaded - Pagination End
                    state.data.commentPagination.end = true
                }
                if(action.payload?.nextStart){
                    state.data.commentPagination.start = action.payload.nextStart
                }

                state.status.comments = "completed"
            })
            .addCase(getCommentsAsync.pending, (state) => {
                state.status.comments = "pending"
            })

            // Creating Comment
            .addCase(createNewCommentAsync.pending, (state) => {
                state.status.commentField = "pending"
            })
            .addCase(createNewCommentAsync.rejected, (state) => {
                state.status.commentField = "rejected"
            })

            // Update Comment
            .addCase(updateExistingComment.pending, (state) => {
                state.status.commentEdit = "pending"
            })
            .addCase(updateExistingComment.rejected, (state) => {
                state.status.commentEdit = "rejected"
            })

            // Delete Comment
            .addCase(deleteCommentAsync.rejected, (state) => {
                state.status.commentDelete = "rejected"
            })
            .addCase(deleteCommentAsync.pending, (state) => {
                state.status.commentDelete = "pending"
            })

            // Add Reply
            .addCase(commentReplyAsync.pending, (state) => {
                state.status.replyField = "pending"
            })
            .addCase(commentReplyAsync.fulfilled, (state) => {
                state.status.replyField = "completed"
            })

            // Fetch Reply
            .addCase(findRepliesAsync.pending, (state) => {
                state.status.replies = "pending"
            })
            .addCase(findRepliesAsync.rejected, (state) => {
                state.status.replies = "rejected"

            })
            .addCase(findRepliesAsync.fulfilled, (state, action) => {
                // Load Specific Comment replies
                let found = false
                let i = 0
                while (found === false && i < state.data.comments?.length) {
                    // If Comment's id matches payload id
                    if (state.data.comments[i]._id === action.payload?.id) {
                        // Add replies to that Comment's Replies Data
                        state.data.comments[i].repliesData = action.payload?.replies
                        found = true
                    }
                    i = i + 1
                }
                state.data.pendingCommentReplyIndex = null
                state.status.replies = "completed"
            })

            // Update Reply 
            .addCase(updateReplyAsync.pending, (state) => {
                state.status.replyField = "pending"
            })
            .addCase(updateReplyAsync.rejected, (state) => {
                state.status.replyField = "rejected"
            })
            .addCase(updateReplyAsync.fulfilled, (state, action) => {
                // Update a Specific Comment's Reply - Comment's index iss proivded in the Payload
                let commentFound = false
                let i = 0
                // Iterate over that Comment's Replies
                while (commentFound === false && i < state.data.comments[action.payload?.index]?.repliesData?.length) {
                    // If that Reply's id matches the payload id - Replace the Reply with the newer(updated) reply
                    if (state.data.comments[action.payload?.index]?.repliesData[i]._id === action.payload?.reply?._id) {
                        state.data.comments[action.payload?.index].repliesData[i] = action.payload?.reply
                        commentFound = true
                    }
                    i = i + 1
                }
                state.data.commentReplyEdit = initialState.data.commentReplyEdit
                state.status.replyField = "completed"
            })


    },
})

export const {
    addBlogFormError, removeBlogFormError,
    likeBlogAction, dislikeBlog, commentsError,
    commentValidationError, commentErrorWithMessage,
    addComment, setInitialValueForEdit, likeCommentAction,
    setLoadingCommentIndex, setCommmentForEdit,
    removeCommmentForEdit, updateComments, removeComment,
    setReplyIdForEdit, setReplyForEdit,
    commentReplyError, addReply, removeCommentReply,
    removeReplyForEdit, removeCommentReplyError, commentReplyLikeSuccess
} = blogSlice.actions;
export default blogSlice.reducer;