import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { commentReplyAsync, createNewCommentAsync, updateExistingComment, updateReplyAsync } from "../../Redux-Toolkit/features/Blogs/blogCommentAction"
import { useNavigate } from "react-router-dom"
import "./publish-comment.css"
import ButtonLoader from "../ButtonLoader/ButtomLoader.js"
import Button from "../Button/Button.js"
import { removeCommmentForEdit, removeReplyForEdit, setInitialValueForEdit } from "../../Redux-Toolkit/features/Blogs/blogsSlice"

const PublishComment = ({ id, update, text, commentId, index, reply, replyUpdate }) => {
    const user = useSelector(state => state.user.data)
    const error = useSelector(state => state.blogs.errors.currentComment)
    const updateFieldErrors = useSelector(state => state.blogs.errors.editComment)
    const replyError = useSelector(state => state.blogs.errors.commentReply)
    const status = useSelector(state => state.blogs.status.commentField)
    const replyStatus = useSelector(state => state.blogs.status.replyField)
    const updateStatus = useSelector(state => state.blogs.status.commentEdit)

    const dispatch = useDispatch()
    const [commentText, setCommentText] = useState("")
    const [rows, setRows] = useState(1)
    const navigate = useNavigate()

    const increaseRows = (e) => {
        // Increase Input Rows if Enter is Pressed
        if (e.key === "Enter") {
            setRows(rows + 1)
        }
    }
    const setPendingStatus = () => {
        // For Loading
        if (update) {
            return updateStatus
        }
        else if (reply) {
            return replyStatus
        }
        else {
            return status
        }

    }
    
    const handleCommentSubmit = () => {
        if (replyUpdate) {
            // If Reply Update Prop is Passed Reply Update Reply
            if (text !== commentText) {
                dispatch(updateReplyAsync({ id: commentId, text: commentText, commentIndex: index, navigate }))
            } else {
                dispatch(setInitialValueForEdit())
            }
        }
        else if (update) {
            // If Only Update is Passed, Update Comment
            if (text !== commentText) {
                dispatch(updateExistingComment({ id: commentId, text: commentText, navigate }))
            } else {
                dispatch(setInitialValueForEdit())
            }
        }
        else if (reply) {
            // If Only Reply Prop is Passed, Create a New Reply
            dispatch(commentReplyAsync({ id: commentId, text: commentText, commentIndex: index, navigate, setCommentText, setRows }))
        }
        else {
            // Create a New Comment
            dispatch(createNewCommentAsync({ id, text: commentText, navigate, setCommentText, setRows }))
        }
    }

    const removeEdit = () => {
        // Remove Edit Comment/Reply
        if (reply) {
            dispatch(removeReplyForEdit())
        } else {
            dispatch(removeCommmentForEdit())
        }
    }

    const handleShowError = () => {
        // Return Error 
        if (update) {
            return updateFieldErrors // Comment Edit Error
        } else if (replyUpdate || reply) {
            return replyError 
        } else {
            return error // Comment Error
        }
    }
    useEffect(() => {
        if (update || replyUpdate) {
            setCommentText(text)
        }
    }, [update])

    return (
        <div className="publish-comment">
            <div className="blog-comment-img-wrap">
                {
                    user?.profileImage ?
                    // If Profile Image is Present
                        <div style={{ background: `url(${user.profileImage})` }} className="comment-bg-image"></div>
                        :
                    // Else Displaya Custom Profile 
                        <img
                            src="https://static-exp1.licdn.com/sc/h/244xhbkr7g40x6bsu4gi6q4ry"
                            alt="Profile"
                            className="comment-img"
                        />
                }
            </div>
            <div className="blog-publish-comment-main">
                <textarea
                    className="comment-text"
                    name="comment"
                    placeholder="Add a Comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={rows}
                    onKeyPress={increaseRows}
                ></textarea>
                {<p className="comments-error">{handleShowError()}</p>}

                <div className="comment-btn-container">
                    {/* Cancel */}
                    {update && <Button className={"cancel-btn"} text={"Cancel"} color={"#909090"} onClick={removeEdit} />}
                    {replyUpdate && <Button className={"cancel-btn"} text={"Cancel"} color={"#909090"} onClick={removeEdit} />}
                    {/* Submit */}
                    <ButtonLoader status={setPendingStatus()} text={"Publish"} className={"comment-btn"} onClick={handleCommentSubmit} />
                </div>
            </div>
        </div>
    )
}

export default PublishComment