import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { dispayDate } from '../../../../Helpers/date'
import { deleteBlogAsync } from "../../../../Redux-Toolkit/features/Blogs/blogsActions"
import Modal from "../../../Modal/Modal"
import "./short-blog-card.css"
const ShortBlogCard = ({ data, index }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [deleteModal, setDeleteModal] = useState(false)
    const handleDelete = (blogId) => {
        dispatch(deleteBlogAsync({ blogId, navigate, setDeleteModal }))
    };
    return (
        <div className='short-blog-card'>
            <Link to={`/blog/${data._id}`} className="short-blog-link">
                <h3>{`${index + 1}. ${data.title}`}</h3>
            </Link>
            <div className='short-blog-action'>
                <p className="action-text action-date">Published : <span>{dispayDate(data.createdAt)}</span></p>
                <i className="fa-solid fa-pen-to-square edit-icon blog-action-icon" onClick={() => navigate(`/blog/edit/${data._id}`)}></i>
                <i className="fa-solid fa-trash delete-icon blog-action-icon" onClick={() => setDeleteModal(true)}></i>
            </div>
            {deleteModal && <Modal title="Confirmation" text="Are You Sure You Want To Delete this Blog?" setDisplayModal={setDeleteModal} onAgree={() => handleDelete(data._id)} />}
        </div>

    )
}

export default ShortBlogCard