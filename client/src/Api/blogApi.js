import axios from "../Api/axios/axiosInterceptors.js";
import axiosPublic from "../Api/axios/axios.js";
const url = "http://localhost:8000";

export const newBlog = async (formData) => {
  try {
    const { data } = await axios.post(`${url}/blog/create`, formData);
    return data;
  } catch (error) {
    console.log(error.message);
    return error.response.data;
  }
};

export const getUserBlogs = async (userId) => {
  try {
    const response = await axios.get(`${url}/blog/user/${userId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    return error.response.data;
  }
};

export const getBlog = async (blogId, strict) => {
  try {
    const response = await axios.post(`${url}/blog/view/${blogId}`, strict ? { strict: true } : {});
    return response.data;
  } catch (error) {
    // console.log(error.response.data);
    return error.response.data;
  }
};

export const getBlogs = async () => {
  try {
    const { data } = await axios.get(`${url}/blog`);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const { data } = await axios.delete(`${url}/blog/delete/${blogId}`);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const editBlog = async (blogId, blog) => {
  try {
    console.log("Blog Id is", blogId);
    const { data } = await axios.put(`${url}/blog/update/${blogId}`, blog);
    return data;
  } catch (error) {
    return error.response.data;
  }
};
