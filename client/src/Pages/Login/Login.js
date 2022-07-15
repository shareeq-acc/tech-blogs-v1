import { React, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Form from "../../Components/Form/Form";
import Loader from "../../Components/Loader/Loader";
import VerificationModal from "../../Components/VerificationModal/VerificationModal.js";
import "./login.css";
const Login = () => {
  const navigate = useNavigate();
  const validation = useSelector(state => state.user.data.validation)
  const formStatus = useSelector(state => state.user.status.Form)
  const user = useSelector(state => state.user.data.login)
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Form title={"Login To Your Account"} method={"login"} />
      {formStatus === "pending" && <Loader/>}
      {formStatus === "completed" && !validation.validated && validation.nextValidation && <VerificationModal />}
    </div>
  );
};

export default Login;
