import axios from "axios";
import setUser from "../../Helpers/setUser";

const axiosPrivate = axios.create({
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(
  config => {
    if (!config.headers['Authorization']) {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  }, (error) => Promise.reject(error)
);


axiosPrivate.interceptors.response.use(
  response => response,
  async (error) => {
    // console.log("Axios Interceptor, Error:");
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      // console.log("Sending Request to url")
      const refreshResponse = await axios.post(
        `/auth/refresh`,
        {},
        { withCredentials: true }
      );
      prevRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.token}`;
      localStorage.setItem("token", refreshResponse.data.token);
      return axiosPrivate(prevRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosPrivate;
