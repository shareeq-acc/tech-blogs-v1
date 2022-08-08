import axios from "axios";

// Create a Private Instance of Axios 
const axiosPrivate = axios.create({
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach JWT Token From LocalSorage before Every Private Request
axiosPrivate.interceptors.request.use(
  config => {
    if (!config.headers['Authorization']) {
      // Attach Token
      const token = localStorage.getItem("token")
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  }, (error) => Promise.reject(error)
);

// Refresh Access Token (if Expired)
axiosPrivate.interceptors.response.use(
  response => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true; // Only Request for Refreshing the Token Once 

      // Refresh The AccessToken
      const refreshResponse = await axios.post(
        `/auth/refresh`,
        {},
        { withCredentials: true }
      );

      // Attach Token
      prevRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.token}`;

      // Set Token to localStorage
      localStorage.setItem("token", refreshResponse.data.token);

      // Back to the original Request
      return axiosPrivate(prevRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosPrivate;
