import axiosPrivate from "../Api/axios/axiosInterceptors";
import axiosPublic from "../Api/axios/axios";



export const auth = async () => {
    return await axiosPrivate.post(`/auth`, {});
};

export const register = async (user) => {
    return await axiosPublic.post(`/user/register`, user);
};

export const login = async (user) => {
    return await axiosPublic.post(`/user/login`, user);
};

export const logout = async () => {
    return await axiosPublic.delete(`/user/logout`);
};

export const confirmationEmail = async (id) => {
    return await axiosPublic.post(`/user/setup/email`, { id: id });
};

export const activateAccount = async (token) => {
    return await axiosPublic.get(`/user/activate/${token}`);
};

export const setupUser = async (data) => {
    return await axiosPrivate.post(`/user/setup/data`, data);
}

export const getUser = async (id) => {
    return await axiosPrivate.post(`/user`, { id });
}
export const changePass = async (id, data) => {
    return await axiosPrivate.put(`/user/new-password/${id}`, data);
}