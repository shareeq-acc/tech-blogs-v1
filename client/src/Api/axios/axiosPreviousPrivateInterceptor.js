// axiosPrivate.interceptors.request.use((config) => {
//   console.log("Header before ", config.headers.Authorization)
//   // if (!config.headers.Authorization) {
//   //   let token = localStorage.getItem("token");
//   //   if (token) {
//   //     config.headers["Authorization"] = `Bearer ${token}`;
//   //   }
//   // }
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   console.log("Header after ", config.headers.Authorization)
//   return config;
// });

// let refresh = false;
// axiosPrivate.interceptors.response.use(
//   (resp) => resp,
//   async (error) => {
//     console.log("Axios Interceptor, Error:");
//     console.log(error.response.status, " ", refresh)
//     if (error.response.status === 401 && !refresh) {
//       refresh = true;
//       console.log("Sending Request to url")
//       const refreshResponse = await axios.post(
//         `${url}/auth/refresh`,
//         {},
//         { withCredentials: true }
//       );
//       console.log("Response after Error", refreshResponse?.data.token);
//       if (refreshResponse.status === 200) {
//         console.log("Refreshed Success")
//         // setUser(response.data)
//         // console.log(refreshResponse.data.token)
//         axiosPrivate.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${refreshResponse.data.token}`;
//         localStorage.setItem("token", refreshResponse.data.token);
//         // console.log(error.config);
//         return axiosPrivate(error.config);
//       }
//     }
//     refresh = false;
//     return error;
//   }
// );