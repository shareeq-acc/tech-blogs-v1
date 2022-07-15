import axiosPrivate from "../Api/axios/axiosInterceptors.js";
import axios from "./axios/axios.js";
const url = "http://localhost:8000";

export const auth = async () => {
  try {
    const response = await axiosPrivate.post(`${url}/auth`, {});
    // User did not Login before Making this request and there is no refreshToken
    // console.log(response)
    if (response.name = "AxiosError") {
      return response.response.data
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error.response)
    return error.response.data;
  }
};
export const register = async (user) => {
  try {
    const response = await axios.post(`${url}/user/register`, user);
    return response.data;
  } catch (error) {
    if (error.response.status === 400) {
      // Validation Error
      return error.response.data;
    }
  }
};

export const login = async (user) => {
  try {
    const response = await axios.post(`${url}/user/login`, user);
    // axios.defaults.headers.common[
    //   "Authorization"
    // ] = `Bearer ${response.data["token"]}`;
    // console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response.status === 400) {
      // Validation Error
      return error.response.data;
    }
  }
};

export const logout = async () => {
  try {
    const response = await axios.delete(`${url}/user/logout`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
