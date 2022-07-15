import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux"
const RequireAuth = () => {
    const location = useLocation();
    const userStatus = useSelector(state => state.user.status.userLogin)
    const authStatus = useSelector(state => state.user.status.authCheck)
    const login = useSelector(state => state.user.data.login)
    return (
        userStatus !== "pending" && !login && authStatus === "completed" ? <Navigate to="/login" state={{ from: location }} replace /> : <Outlet />
    )
}

export default RequireAuth