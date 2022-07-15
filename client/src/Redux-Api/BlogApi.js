import axiosPublic from "../Api/axios/axios.js"
import axiosPrivate from "../Api/axios/axiosInterceptors.js"


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
