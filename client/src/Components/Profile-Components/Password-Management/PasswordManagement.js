import "./password-management.css"
import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { changeUserPasswordAsync } from "../../../Redux-Toolkit/features/User/userActions"
import Button from "../../Button/Button.js"
import Loader from "../../Loader/Loader.js"
import { removePasswordErrors } from "../../../Redux-Toolkit/features/User/userSlice"
export const PasswordManagement = () => {
  const errors = useSelector(state => state.user.errors.passwordChange)
  const id = useSelector(state => state.user.data.id)
  const status = useSelector(state => state.user.status.passwordChange)
  const dispatch = useDispatch()
  const initialValues = {
    oldPassword: "", newPassword: "", cpassword: ""
  }
  const [passValues, setPassValues] = useState(initialValues)
  const [showPassword, setShowPassword] = useState({ newPassword: false, cpassword: false })
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(changeUserPasswordAsync({ id, data: passValues, navigate, setPassValues, initialValues }))
  }
  const handleShowPasswords = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: showPassword[field] ? false : true
    })
  }
  useEffect(() => {
    dispatch(removePasswordErrors())
  }, [])

  return (
    <div className="password-management-wrapper">
      {
        status === "pending" && <Loader />
      }
      <h1 className="profile-title">Change Password</h1>
      <form className="change-pass-form" onSubmit={handleSubmit}>
        <div className="pass-input-wrap">
          <input
            type="password"
            className={`form-input pass-input ${errors.oldPassword ? "form-error-input" : ""}`}
            placeholder="Enter Current Password"
            name="oldPassword"
            value={passValues?.oldPassword}
            onChange={(e) => setPassValues({ ...passValues, [e.target.name]: e.target.value })}
          />
          <i className="fa-solid fa-key form-icon"></i>
          {errors?.oldPassword && <p className="error-field-text">{`*${errors.oldPassword}*`}</p>}
        </div>
        <div className="pass-input-wrap">
          <input
            type={showPassword.newPassword ? "text" : "password"}
            className={`form-input pass-input ${errors.newPassword ? "form-error-input" : ""}`}
            placeholder="Enter New Password"
            name="newPassword"
            value={passValues?.newPassword}
            onChange={(e) => setPassValues({ ...passValues, [e.target.name]: e.target.value })}
          />
          <i className="fa-solid fa-lock form-icon"></i>
          <i className={`fa-solid password-icon ${showPassword.newPassword ? " fa-eye-slash" : " fa-eye"}`} onClick={(e) => handleShowPasswords("newPassword")}></i>
          {errors?.newPassword && <p className="error-field-text">{`*${errors.newPassword}*`}</p>}
        </div>
        <div className="pass-input-wrap">
          <input
            type={showPassword.cpassword ? "text" : "password"}
            className={`form-input pass-input ${errors.cpassword ? "form-error-input" : ""}`}
            placeholder="Re-enter New Password"
            name="cpassword"
            value={passValues?.cpassword}
            onChange={(e) => setPassValues({ ...passValues, [e.target.name]: e.target.value })}
          />
          <i className="fa-solid fa-lock form-icon"></i>
          <i className={`fa-solid password-icon ${showPassword.cpassword ? " fa-eye-slash" : " fa-eye"}`} onClick={(e) => handleShowPasswords("cpassword")}></i>
          {errors?.cpassword && <p className="error-field-text">{`*${errors.cpassword}*`}</p>}
        </div>
        <Button theme={"var(--primary-orange)"} color={"white"} text={"Submit"} type={"submit"} className="submit-btn">Submit</Button>
      </form>
    </div>
  )
}

export default PasswordManagement
