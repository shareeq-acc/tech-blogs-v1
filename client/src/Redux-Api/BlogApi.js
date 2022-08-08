import axiosPublic from "../Api/axios/axios.js"
import axiosPrivate from "../Api/axios/axiosInterceptors.js"

// Blog
export const newBlog = async (formData) => {
    return await axiosPrivate.post(`/blog/create`, formData);
};
export const getUserBlogs = async (userId) => {
    return await axiosPrivate.get(`/blog/user/${userId}`);
};
export const getBlog = async (blogId, strict) => {
    return await axiosPrivate.post(`/blog/view/${blogId}`, strict ? { strict: true } : {});
};
export const getBlogs = async () => {
    return await axiosPublic.get(`/blog`);
};
export const deleteBlog = async (blogId) => {
    return await axiosPrivate.delete(`/blog/delete/${blogId}`);
};
export const editBlog = async (blogId, blog) => {
    return await axiosPrivate.put(`/blog/update/${blogId}`, blog);
};
export const likeBlog = async (id) => {
    return await axiosPrivate.put(`/blog/like/${id}`);
}

// Comments
export const commentBlog = async (id, text) => {
    return await axiosPrivate.post(`/blog/comment/create/${id}`, { text });
}
export const updateComment = async (commentId, text) => {
    return await axiosPrivate.put(`/blog/comment/update/${commentId}`, { text });
}
export const getBlogComments = async (id, start) => {
    return await axiosPublic.get(`/blog/comment/${id}?start=${start}`);
}
export const deleteComment = async (id) => {
    return await axiosPrivate.delete(`/blog/comment/delete/${id}`);
}
export const likeComment = async (id) => {
    return await axiosPrivate.put(`/blog/comment/like/${id}`);
}

// Replies
export const postReply = async (id, reply) => {
    return await axiosPrivate.post(`/blog/comment/reply/create/${id}`, { text: reply });
}
export const getCommentReplies = async (id) => {
    return await axiosPublic.get(`/blog/comment/reply/${id}`);
}
export const deleteCommentReply = async (id) => {
    return await axiosPrivate.delete(`/blog/comment/reply/delete/${id}`);
}
export const updateCommentReply = async (id, text) => {
    return await axiosPrivate.put(`/blog/comment/reply/update/${id}`, { text });
}
export const likeCommentReply = async (id) => {
    return await axiosPrivate.put(`/blog/comment/reply/like/${id}`);
}