import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { emailConfirmation } from "../../Redux-Toolkit/features/User/userActions"
import "./activation.css"
const Activation = () => {
  const dispatch = useDispatch()
  const { token } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(emailConfirmation({token, navigate}))
  }, [])

  return (
    <div className="activation-wrap">
      <div className="activation-success">
        <div className="activation-icon-wrap"><i className="fa-solid fa-circle-check activation-icon"></i></div>
        <div className="activation-content">
          <p className="activation-text">Congratulation! Your Account is Activated. Please Click Below To Login</p>
          <Link to="/login" className="modal-btn activation-btn">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Activation