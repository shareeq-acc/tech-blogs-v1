import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import timer from "../../Helpers/timer"
import { sendEmail } from "../../Redux-Toolkit/features/User/userActions"
import "./verification-modal.css"
const VerificationModal = () => {
    const [displayModal, setDisplayModal] = useState(true)
    const id = useSelector(state => state.user.data.id)
    const dispatch = useDispatch()
    const timePeriod = useSelector(state => state.user.data.validation.nextValidation)
    const [timeDifference, setTimeDifference] = useState(timePeriod ? Math.floor((timePeriod - Date.now()) / 1000) : 0)
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeDifference(Math.floor((timePeriod - Date.now()) / 1000))
            // console.log("time difference is ", timePeriod - Date.now())
            if (timePeriod <= Date.now()) {
                // console.log("cleared")
                clearInterval(interval)
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [timePeriod])
    const resendEmail = () => {
        dispatch(sendEmail(id))
    }
    return (
        <div className={`modal verification-modal ${displayModal ? "" : "hide-element"}`}>
            <div className="modal-wrap">
                {/* {status === "pending" && <div className="status-message"><p>Resending...</p></div>}
                {status === "rejected" && <div className="status-message error-message"><p>Something Went Wrong!</p></div>} */}
                <div className="modal-icon-close-wrap" onClick={() => setDisplayModal(false)}>
                    <i className="fa-solid fa-xmark modal-icon-close"></i>
                </div>
                <div className="modal-icon-wrap">
                    {/* <i className="fa-solid fa-circle-envelope"></i> */}
                    <i className="fa-solid fa-envelope modal-icon"></i>
                </div>
                <p className="modal-text">Almost there! We have sent an Activation email to your Account. You need to Activate your Account to Login in to our Website. Next Confirmation Email After <span className="modal-counter">{timer(timePeriod)}</span></p>

                <button className={`modal-btn ${timeDifference > 0 ? "diabled-modal-btn" : ""}`} disabled={timeDifference <= 0 ? false : true} onClick={resendEmail}>Resend Email</button>
            </div>
        </div>
    )
}
export default VerificationModal
