import "./comment.css"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { displayTimePassed } from "../../Helpers/date"
import { useNavigate } from "react-router-dom"
import { commentLikeAction, deleteCommentAsync, deleteReplyAsync, findRepliesAsync, likeReplyAsync } from "../../Redux-Toolkit/features/Blogs/blogCommentAction"
import { removeCommentReplyError, setCommmentForEdit, setReplyForEdit, setReplyIdForEdit } from "../../Redux-Toolkit/features/Blogs/blogsSlice"
import { toast } from "react-toastify"

const Comment = ({ blogId, comment, reply, showReplies, setShowReplies, commentIndex }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userId = useSelector(state => state.user.data.id)
    const user = useSelector(state => state.user.data.login)
    const blogCreator = useSelector(state => state.blogs.data.CurrentBlog?.creator)
    const currentComment = useSelector(state => state.blogs.data.comments[commentIndex])

    const [showDropdown, setShowDropdown] = useState(false)

    const handleDeleteComment = (id) => {
        if (reply) {
            // If Reply prop is Passed to the Component - Delete Reply
            dispatch(deleteReplyAsync({ id, navigate, index: commentIndex }))
        } else {
            // Delete Comment
            dispatch(deleteCommentAsync({ id, navigate }))
        }
        setShowDropdown(false)
    }
    const handleCommentLikes = (id) => {
        // If Reply prop is Passed to the Component 
        if (reply) {
            dispatch(likeReplyAsync({ commentIndex, id }))
        } else {
            dispatch(commentLikeAction({ id }))
        }
    }
    const handleSetCommentEdit = (id, text) => {
        // If Reply prop is Passed to the Component 
        if (reply) {
            dispatch(setReplyForEdit({ id, text }))
        } else {
            dispatch(setCommmentForEdit({ id, text }))
        }
        setShowDropdown(false)
    }

    const handleReplyComment = (id) => {
        if(user){
            // If User Logged in
            dispatch(setReplyIdForEdit(id))
            setShowReplies(true)
        }else{
            toast.warning("Please Login To Reply")
        }
    }
    const loadReplies = (id) => {
        dispatch(removeCommentReplyError())
        setShowReplies(showReplies ? false : true)

        // If there are No Replies Already in Comment's RepliesData
        if (!currentComment?.repliesData) {
            dispatch(findRepliesAsync({ id, commentIndex }))
        }
    }
    return (
        <div className="comment">
            <div className="blog-comment-img-wrap">
                {
                    comment?.creatorId?.imageUrl ? <div style={{ background: `url(${comment.creatorId.imageUrl})` }} className="comment-bg-image"></div> :
                        <img
                            src="https://static-exp1.licdn.com/sc/h/244xhbkr7g40x6bsu4gi6q4ry"
                            alt="Profile"
                            className="comment-img"
                        />
                }
            </div>
            <div className="blog-comment-main">
                <h4 className="blog-comment-name">{`${comment?.creatorId?.fname} ${comment?.creatorId?.lname}`}</h4>
                <p className="comment-time">{displayTimePassed(comment?.createdAt)} {comment?.updatedAt && <span className="comment-edit-span">{`(edited)`}</span>}</p>
                
                {/* Show Delete/Edit Option if the CreatorId MAtches the UserId Logged in */}
                {comment?.creatorId?._id === userId && <div className="comment-action-wrap">
                    <i className="fa-solid fa-ellipsis comment-action-icon" onClick={() => setShowDropdown(showDropdown ? false : true)}></i>
                    {showDropdown && <ul className="comment-action-list">
                        <li className="comment-action-item" onClick={() => handleSetCommentEdit(comment._id, comment?.text)}>Edit</li>
                        <li className="comment-action-item" onClick={() => handleDeleteComment(comment._id)}>Delete</li>
                    </ul>}
                </div>}

                {/* Show Author if the CreatorId Matches the blog CreatorId */}
                {blogCreator?._id === comment?.creatorId?._id && <div className="comment-original-author">Author</div>}
                <div className="comment-content">
                    {comment?.text}
                </div>

                <div className="likes-icon-container">
                    <div>
                        <i className={`fa-solid fa-thumbs-up like comment-like-icon ${comment?.likes.includes(userId) ? "comment-liked" : ""}`} onClick={() => handleCommentLikes(comment._id)}></i><span className="comment-like-count">{comment?.likes.length}</span>
                    </div>
                    {!reply && <span className="comment-reply-span" onClick={() => handleReplyComment(comment._id)}>REPLY</span>}
                </div>
                {!reply && <div className="load-replies-wrap" onClick={() => loadReplies(comment._id)}>
                    {comment.replies?.length > 0 &&
                        <div>
                            <i className={`fa-solid ${showReplies ? "fa-caret-up" : "fa-caret-down"} reply-view-icon`}></i>
                            <span className="replies-count">
                                {`${showReplies ? "Hide" : "View"} ${comment.replies.length} ${comment.replies.length > 1 ? "Replies" : "Reply"}`}
                            </span>
                        </div>}
                </div>}
            </div>

        </div>
    )
}

export default Comment