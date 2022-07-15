import axios from "axios"

const setToken = (token) => {
    if (token) {
        localStorage.setItem("token", token)
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;
    }
}

export default setToken