
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserBlogsAsync } from "../../../Redux-Toolkit/features/Blogs/blogsActions"
import Loader from "../../Loader/Loader"
import "./blog-management.css"
import ShortBlogCard from "./ShortBlogCard/ShortBlogCard.js"

const BlogManagement = () => {
    const dispatch = useDispatch()
    const id = useSelector(state => state.user.data.id)
    const status = useSelector(state => state.blogs.status.Blogs)
    const error = useSelector(state => state.blogs.errors.Blogs)
    const blogs = useSelector((state) => state.blogs.data.Blogs);
    const deleteStatus = useSelector(state => state.blogs.status.BlogDeletion)
    useEffect(() => {
        dispatch(fetchUserBlogsAsync(id))
    }, [dispatch, deleteStatus])
    return (
        <div className="blog-management-container">
            <div className="user-blogs-container">
                <h1 className="profile-title">Manage Your Blogs</h1>
                <div>
                    {blogs.length > 0 && status !== "pending" ? (
                        blogs.map((blog, index) => {
                            return <ShortBlogCard data={blog} key={index} index={index} />;
                        })
                    ) : (
                        <div className="no-content">
                            {status !== "pending" && <p className="no-content-message">{error}</p>}
                        </div>
                    )}
                </div>
                {status === "rejected" && <p className="no-content-message">{error}</p>}
                {status === "pending" && <Loader />}
            </div>
        </div>
    )
}

export default BlogManagement