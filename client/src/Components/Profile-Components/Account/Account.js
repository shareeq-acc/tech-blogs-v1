import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { showUserProfileData } from "../../../Redux-Toolkit/features/User/userActions"
import "./account.css"
import ErrorMessage from "../../Error/ErrorMessage.js"
import Loader from "../../Loader/Loader.js"
import AccountField from "./AccountField/AccountField"

const Account = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const id = useSelector(state => state.user.data.id)
    const error = useSelector(state => state.user.errors.accountDetails)
    const status = useSelector(state => state.user.status.accountDetails)
    const data = useSelector(state => state.user.data.accountDetails)

    useEffect(() => {
        dispatch(showUserProfileData({ id, navigate }))
    }, [dispatch])

    return (
        <div className="account-container">
            {
                status === "rejected" && error && <ErrorMessage error={error} />
            }
            {
                status === "pending" && <Loader />
            }
            <h1 className="profile-title">Account Information</h1>
            {
                data && status != "pending" &&
                <div className="acc-details-wrap">
                    <AccountField fieldname={"Name"} fieldData={`${data.fname} ${data.lname}`} />
                    <AccountField fieldname={"Username"} fieldData={data.username} />
                    <AccountField fieldname={"Email"} fieldData={data.email} />
                    <AccountField fieldname={"Expertise"} fieldData={data.expertise} />
                    <AccountField fieldname={"Gender"} fieldData={data?.gender?.toUpperCase()} />
                    <AccountField fieldname={"Date of Birth"} fieldData={data.DOB} />
                </div>
            }
        </div>
    )
}

export default Account