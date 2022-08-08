import axios from "axios"

// Sets the JWT Token to Auth Header
const setToken = (token) => {
    if (token) {
        localStorage.setItem("token", token)
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;
    }
}

export default setToken