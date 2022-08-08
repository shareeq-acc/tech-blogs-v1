import { useSelector } from "react-redux";
import Form from "../../Components/Form/Form";
import Loader from "../../Components/Loader/Loader";
import VerificationModal from "../../Components/VerificationModal/VerificationModal.js";
import "./register.css";
const Register = () => {
  const validation = useSelector(state => state.user.data.validation)
  const formStatus = useSelector(state => state.user.status.Form)
  return (
    <div className="register-page">
      <Form title={"Create an Account"} method={"register"} />
      {formStatus === "pending" && <Loader />}

      {/* Email Verification Modal } */}
      {formStatus === "completed" && !validation.validated && validation.nextValidation && <VerificationModal />}
    </div>
  );
};

export default Register;
