import { useState } from "react"
import { useSelector } from "react-redux"
import Comment from "../../Components/Comment/Comment"
import PublishComment from "../../Components/PublishComment/PublishComment"
import Loader from "../../Components/Loader/Loader.js"
import "./comment-container.css"


const CommentContainer = ({ comment, commentIndex, blogId }) => {
    const repliesStatus = useSelector(state => state.blogs.status.replies)
    const editReply = useSelector(state => state.blogs.data.commentReplyEdit)
    const commentReply = useSelector(state => state.blogs.data.commentReply)
    const commentLoadingIndex = useSelector(state => state.blogs.data.pendingCommentReplyIndex)
    const user = useSelector(state => state.user.data.login)
    const [showReplies, setShowReplies] = useState(false)
    return (
        <div className="comment-container" key={commentIndex}>
            {/* Comment */}
            <Comment comment={comment} blogId={blogId} showReplies={showReplies} setShowReplies={setShowReplies} commentIndex={commentIndex} />
            {/* Comment replies */}
            {showReplies && <div className="reply-container" style={{ padding: `${commentLoadingIndex == commentIndex ? "1rem" : 0}` }}>
                {/* Replies Loader */}
                {repliesStatus === "pending" && commentLoadingIndex == commentIndex && <Loader className={"reply-loader"} />}
                {/* Replies */}
                {
                    commentLoadingIndex != commentIndex && comment?.repliesData?.length > 0 &&
                    // if Comment Edit Id is Set in State - Show Publish Comment Component (for Updating Reply) - Else Display Comment
                    comment?.repliesData?.map((reply, index) => (
                        reply?._id === editReply?.replyId ? <PublishComment commentId={reply._id} reply={true} index={commentIndex} text={editReply?.text} replyUpdate={true}/> : <Comment comment={reply} blogId={blogId} reply={true} key={index} commentIndex={commentIndex} />
                    ))
                }
                {/* New Reply Field */}
                {commentReply?.commentId === comment._id && user && <PublishComment commentId={comment._id} reply={true} index={commentIndex} />}
            </div>}
        </div >
    )
}

export default CommentContainer