import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import ErrorField from "../../Components/ErrorField/ErrorField"
import { storeSetupInfo } from "../../Redux-Toolkit/features/User/userActions"
import { setStage } from "../../Redux-Toolkit/features/User/userSlice"
import Loader from "../../Components/Loader/Loader"
import "./setup.css"
const Setup = () => {
  const step = useSelector(state => state.user.data.setupStage)
  const errors = useSelector(state => state.user.errors.setup)
  const status = useSelector(state => state.user.status.setup)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [setupInput, setSetupInput] = useState({ expertise: "", description: "" })
  const handleSetupSubmit = () => {
    const formData = new FormData()
    formData.append("expertise", setupInput.expertise)
    formData.append("description", setupInput.description)
    if (file) {
      formData.append("file", file)
    }
    dispatch(storeSetupInfo({ data: formData, navigate }))
  }
  return (
    <div className="setup-main-wrapper">
      {status === "pending" &&
        <div className="loader-back">
          <Loader />
        </div>
      }
      <div className="setup-wrap">
        {status === "rejected" && errors.serverError && <div>Something Went Wrong Please Try Again</div>}
        <span className="next-icon" onClick={() => {
          if (step === 1) {
            dispatch(setStage(2))
          }
        }}><i className={`fa-solid fa-angles-right move-icons ${step === 2 ? "disable-btn" : ""}`}></i></span>
        <span className="previous-icon" onClick={() => {
          if (step === 2) {
            dispatch(setStage(1))
          }
        }}><i className={`fa-solid fa-angles-left move-icons ${step === 1 ? "disable-btn" : ""}`}></i></span>
        <h1 className="setup-title">Complete Your Profile</h1>
        {step === 1 && <div className="setup-first-stage">
          <input className="setup-input form-input" placeholder="Please Enter Your Expertise e.g Software Developer" onChange={(e) => setSetupInput({ ...setupInput, expertise: e.target.value })} value={setupInput.expertise} />
          {errors.expertise && <ErrorField text={errors.expertise} />}
          <textarea className="setup-input form-input setup-text" rows="3" placeholder="Please Enter description about yourself" onChange={(e) => setSetupInput({ ...setupInput, description: e.target.value })} value={setupInput.description}></textarea>
          {/* <input className="setup-input form-input" placeholder="Please Enter description about yourself" onChange={(e) => setSetupInput({ ...setupInput, description: e.target.value })} value={setupInput.description}/> */}
          {errors.description && <ErrorField text={errors.description} />}
        </div>}
        {step === 2 &&
          <div className="step-second-stage">
            <div className="file-upload-wrap">
              <h2 className="setup-instruction">Upload Profile Image <span className="fade-text">(optional)</span></h2>
              <div className="profile-upload-wrap">
                <input className="file-upload-input" type='file' accept="image/*" onChange={(e) => {
                  setFile(e.target.files[0])
                }} />
                <div className="file-message-wrap">
                  <h3 className="file-message">Choose A File</h3>
                </div>
              </div>
              {file && <p className="file-name">{file.name}</p>}
              {errors.file && <ErrorField text={errors.file} />}
            </div>
            <button className="modal-btn setup-btn" onClick={handleSetupSubmit}>Submit</button>
          </div>
        }
      </div>

    </div>
  )
}

export default Setup