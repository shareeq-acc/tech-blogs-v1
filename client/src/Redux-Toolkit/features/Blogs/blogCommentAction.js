import { toast } from "react-toastify";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { commentBlog, deleteComment, deleteCommentReply, getBlogComments, getCommentReplies, likeComment, likeCommentReply, postReply, updateComment, updateCommentReply } from "../../../Redux-Api/BlogApi"
import { addComment, addReply, commentErrorWithMessage, commentReplyError, commentReplyLikeSuccess, commentsError, commentValidationError, likeCommentAction, removeComment, removeCommentReply, setInitialValueForEdit, setLoadingCommentIndex, updateComments } from "./blogsSlice"

// Comment
export const createNewCommentAsync = createAsyncThunk("blog/comment/create", async ({ id, text, navigate, setCommentText, setRows }, thunkAPI) => {
    try {
        // Comment Validation
        if (text.length > 500) {
            thunkAPI.dispatch(commentValidationError({ maxRange: true, update: false }))
            return
        }
        if (text.length < 1) {
            thunkAPI.dispatch(commentValidationError({ minRange: true, update: false }))
            return
        }
        // Create Comment
        const response = await commentBlog(id, text)
        // Add Comment to the Comments Array
        thunkAPI.dispatch(addComment(response?.data?.comment))
        // Clear Comment Text Field
        setCommentText("")
        // Set Comment Field Row to 1
        setRows(1)
    } catch (error) {
        if (error?.response?.data?.auth === false) {
            // If User Not Logged In
            navigate("/login")
            return
        }
        if (error?.response?.message) {
            // If Comment Error with Custom Message (from Server)
            thunkAPI.dispatch(commentErrorWithMessage({ message: error.response.message }))
            return
        }
        if (error?.response?.serverError) {
            // If Internal Server Error
            thunkAPI.dispatch(commentErrorWithMessage({ message: "Something Went Wrong!" }))
            return
        }
    }
})
export const updateExistingComment = createAsyncThunk("blog/comment/update", async ({ id, text, navigate }, thunkAPI) => {
    try {
        // Comment Validation 
        if (text.length > 500) {
            thunkAPI.dispatch(commentValidationError({ maxRange: true, update: true }))
            return
        }
        if (text.length < 1) {
            thunkAPI.dispatch(commentValidationError({ minRange: true, update: true }))
            return
        }
        // Update Comment
        const response = await updateComment(id, text)
        // Replace Updated Comment with the previous older one
        thunkAPI.dispatch(updateComments(response?.data?.comment))
        // Clear Edit Comment id and Text
        thunkAPI.dispatch(setInitialValueForEdit())
    } catch (error) {
        if (error?.response?.data?.auth === false) {
            // User Not Logged In
            navigate("/login")
            return
        }
        if (error?.response?.message) {
            // Custom Error Message 
            thunkAPI.dispatch(commentErrorWithMessage({ message: error.response.message, update: true }))
            return
        }
        if (error?.response?.serverError) {
            // Internal Server Error
            thunkAPI.dispatch(commentErrorWithMessage({ message: "Something Went Wrong!", update: true }))
            return
        }
    }
})
export const getCommentsAsync = createAsyncThunk("blog/comment", async ({id, start}, thunkAPI) => {
    try {
        const response = await getBlogComments(id, start) // Pagination Implemented
        return response?.data
    } catch (error) {
        if (error?.response?.data?.serverError) {
            thunkAPI.dispatch(commentsError("Something Went Wrong Please Try Again"))
            return
        }
        if (error?.response?.data?.message) { // Custom Error Message
            thunkAPI.dispatch(commentsError(error.response.data.message))
            return
        }
    }
})
export const deleteCommentAsync = createAsyncThunk("blog/comment/delete", async ({ id, navigate }, thunkAPI) => {
    try {
        toast.loading("Deleting Comment")
        const response = await deleteComment(id)
        toast.dismiss()
        // Remove Comment from state
        thunkAPI.dispatch(removeComment(id))
        toast.success("Comment Deleted!")
    } catch (error) {
        toast.dismiss()
        if (error?.response?.data?.auth === false) {
            // User Not Logged in
            toast.error("Please Login")
            navigate("/login")
            return
        }
        if (error?.response?.data?.unAuthorizedUser) {
            // Unauthorized User
            toast.warning("Please Login Again")
            navigate("/")
            return
        }
        if (error?.response?.data?.serverError) {
            // Internal Server error
            toast.error("Failed To Delete Comment, Please Refresh Before Trying Again")
            return
        }
        if (error?.response?.data?.message) {
            // Custom Error Message
            toast.error(error.response.message)
            return
        }
    }
})
export const commentLikeAction = createAsyncThunk("comment/like", async ({ id }, thunkAPI) => {
    try {
        const response = await likeComment(id)
        if (response?.data?.liked) {
            thunkAPI.dispatch(likeCommentAction({ liked: true, comment: id, user: response.data?.user }))
            toast.success("You Liked This Comment")
        } else {
            thunkAPI.dispatch(likeCommentAction({ liked: false, comment: id, user: response.data?.user }))
            toast.dismiss()
            toast.success("Liked Removed")
        }
    } catch (error) {
        if (error?.response?.data?.auth === false) {
            toast.error("Please Login To Like This Comment")
            return
        }
        if (error?.response?.message) {
            toast.error("Comment Does Not Exists, It May be Deleted")
            return
        }
        if (error?.response?.serverError) {
            toast.error("Something Went Wrong!, Please Try Again")
            return
        }
    }
})

// Replies
export const commentReplyAsync = createAsyncThunk("blog/comment/reply/create", async ({ id, text, commentIndex, navigate, setCommentText, setRows }, thunkAPI) => {
    try {
        // Reply Validation
        if (text.length > 500) {
            thunkAPI.dispatch(commentReplyError("Comment cannot Exceed 500 Characters"))
            return
        }
        if (text.length < 1) {
            thunkAPI.dispatch(commentReplyError("Please Enter Comment"))
            return
        }
        // Create Reply
        const response = await postReply(id, text)
        // Add Reply to Comment's Reply in State
        thunkAPI.dispatch(addReply({
            comment: response?.data?.comment,
            index: commentIndex
        }))
        // Clear Reply Field Text
        setCommentText("")
        setRows(1)
    } catch (error) {
        if (error?.response?.data?.auth === false) {
            navigate("/login")
            return
        }
        if (error?.response?.message) {
            thunkAPI.dispatch(commentReplyError(error.response.message))
            return
        }
        if (error?.response?.serverError) {
            thunkAPI.dispatch(commentReplyError("Something Went Wrong!"))
            return
        }
    }
})
export const findRepliesAsync = createAsyncThunk("blog/comment/reply", async ({ id, commentIndex }, thunkAPI) => {
    try {
        // Set Loding for Comment Replies
        thunkAPI.dispatch(setLoadingCommentIndex(commentIndex))
        // Get Replies
        const response = await getCommentReplies(id)
        return {
            id,
            replies: response?.data?.replies
        }
    } catch (error) {
        if (error?.response?.message) {
            // Custom Error Message
            toast.error(error.response.message)
            return
        }
        if (error?.response?.serverError) {
            // Internal Server Error
            toast.error("Could Not Fetch Replies, Please Reload The Page")
            return
        }
    }
})
export const deleteReplyAsync = createAsyncThunk("blog/comment/reply/delete", async ({ id, index, navigate }, thunkAPI) => {
    try {
        toast.loading("Deleting Reply")
        const response = await deleteCommentReply(id)
        toast.dismiss()
        // Remove Reply from state
        thunkAPI.dispatch(removeCommentReply({ id, index }))
        toast.success("Comment Deleted!")
    } catch (error) {
        toast.dismiss()
        if (error?.response?.data?.auth === false) {
            // User Not Logged In
            toast.error("Please Login")
            navigate("/login")
            return
        }
        if (error?.response?.data?.message) {
            // Custom Error Message
            toast.error(error.response.message)
            return
        }
        if (error?.response?.data?.serverError) {
            // Internal Server Error
            toast.error("Failed To Delete Reply, Please Refresh Before Trying Again")
            return
        }

    }
})
export const updateReplyAsync = createAsyncThunk("blog/comment/reply/update", async ({ id, commentIndex, text, navigate }, thunkAPI) => {
    try {
        // Text Validation
        if (text.length > 500) {
            thunkAPI.dispatch(commentReplyError("Comment cannot Exceed 500 Characters"))
            return
        }
        if (text.length < 1) {
            thunkAPI.dispatch(commentReplyError("Please Enter Comment"))
            return
        }
        const response = await updateCommentReply(id, text)

        // Replace Comment with newer(updated one)
        return {
            reply: response?.data?.reply,
            index: commentIndex
        }
    } catch (error) {
        if (error?.response?.data?.auth === false) {
            // User Not Logged In
            navigate("/login")
            return
        }
        if (error?.response?.message) {
            // Custom Error Messages
            thunkAPI.dispatch(commentReplyError(error.response.message))
            return
        }
        if (error?.response?.serverError) {
            // Internal Server Error
            thunkAPI.dispatch(commentErrorWithMessage("Something Went Wrong!"))
            return
        }
    }
})
export const likeReplyAsync = createAsyncThunk("comment/reply/like", async ({ id, commentIndex }, thunkAPI) => {
    try {
        const response = await likeCommentReply(id)
        if (response?.data?.liked) {
            // If Reply Likes 
            thunkAPI.dispatch(commentReplyLikeSuccess({ liked: true, reply: id, user: response.data?.user, commentIndex }))
            toast.success("You Liked This Comment")
        } else {
            // If Reply Unliked
            thunkAPI.dispatch(commentReplyLikeSuccess({ liked: false, reply: id, user: response.data?.user, commentIndex }))
            toast.dismiss()
            toast.success("Liked Removed")
        }
    } catch (error) {
        if (error?.response?.data?.auth === false) {
            // User Not Logged Inn
            toast.error("Please Login To Like This Comment")
            return
        }
        if (error?.response?.message) {
            // Custom Error Message
            toast.error(error.response.message)
            return
        }
        if (error?.response?.serverError) {
            // Internal Server Error
            toast.error("Something Went Wrong!, Please Try Again")
            return
        }
    }
})