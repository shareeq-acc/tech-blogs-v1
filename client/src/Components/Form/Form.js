import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";



import { formatToCurrentDate } from "../../Helpers/date";
import Button from "../Button/Button";

import "./form.css";
import { loginUserAsync, registerUserAsync } from "../../Redux-Toolkit/features/User/userActions";
import { removeUserFormErrors, resetFormState } from "../../Redux-Toolkit/features/User/userSlice";
// import { formErrors } from "../../Redux-Toolkit/features/User/userSlice";

const Form = ({ title, method }) => {
  const dispatch = useDispatch();
  let errors = useSelector((state) => state.user.errors.formErrors);
  const status = useSelector((state) => state.user.status.Form);
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState(null);
  const initialData = {
    fname: "",
    lname: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
    gender: "",
    DOB: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [showPassword, setShowPassword] = useState({ password: false, cpassword: false })
  useEffect(() => {
    dispatch(resetFormState())
    setShowPassword({
      password: false, cpassword: false
    })
    if (method === "register") {
      setLoginForm(false);
    } else {
      setLoginForm(true);
    }
  }, []);

  const setFormValues = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleShowPasswords = (field) => {
    if (field === "cpassword") {
      setShowPassword({
        ...showPassword,
        cpassword: showPassword.cpassword ? false : true
      })
    }
    if (field === "password") {
      setShowPassword({
        ...showPassword,
        password: showPassword.password ? false : true
      })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Dispatching actions based on Register & Login State
    if (status !== "pending") {
      if (method === "register") {
        dispatch(registerUserAsync({ userDetails: formData, navigate }));
      } else {
        const loginObj = {
          email: formData.email,
          password: formData.password,
        };
        dispatch(loginUserAsync({ loginDetails: loginObj, navigate }));
      }
    }
  };
  return (
    <div className="form-wrap">
      <form className="form" autocomplete="off">
        <h1 className="form-title">{title}</h1>
        {status !== "pending" && errors.main && (
          <div className="form-errors form-message form-field-wrap">
            <p>{errors.main}</p>
          </div>
        )}
        {status === "pending" && (
          <div className="form-loading form-message form-field-wrap">
            <p>Submitting Please Wait</p>
          </div>
        )}
        {!loginForm && (
          <div className="form-field-wrap form-double-field">
            <div className="form-double-input">
              <input
                type="text"
                className={`form-input ${errors.fname ? "form-error-input" : ""}`}
                placeholder="First Name"
                name="fname"
                onChange={(e) => setFormValues(e)}
              />
              <i className="fa-solid fa-id-card form-icon"></i>
              {errors?.fname && <p className="error-field-text">{`*${errors.fname}*`}</p>}
            </div>
            <div className="form-double-input">
              <input
                type="text"
                className={`form-input ${errors.lname ? "form-error-input" : ""}`}
                placeholder="Last Name"
                name="lname"
                onChange={(e) => setFormValues(e)}
              />
              <i className="fa-solid fa-id-card form-icon"></i>
              {errors?.lname && <p className="error-field-text">{`*${errors.lname}*`}</p>}
            </div>
          </div>
        )}

        {!loginForm && (
          <div className="form-field-wrap">
            <input
              type="text"
              className={`form-input ${errors.username ? "form-error-input" : ""}`}
              placeholder="Enter a Username"
              name="username"
              onChange={(e) => setFormValues(e)}
            />
            <i className="fa-solid fa-user form-icon"></i>
            {errors?.username && <p className="error-field-text">{`*${errors.username}*`}</p>}
          </div>
        )}
        <div className="form-field-wrap">
          <input
            type="email"
            className={`form-input ${errors.email ? "form-error-input" : ""}`}
            placeholder="Enter your email address"
            name="email"
            onChange={(e) => setFormValues(e)}
          />
          <i className="fa-solid fa-envelope form-icon"></i>
          {errors?.email && <p className="error-field-text">{`*${errors.email}*`}</p>}
          {/* {errors?.email && <div className="error-field-text"><i className="fa-solid fa-circle-exclamation form-warning-icon"></i><p className="">{errors.email}</p></div>} */}
        </div>
        <div className="form-field-wrap">
          <input
            type={showPassword.password ? "text" : "password"}
            className={`form-input password-input ${errors.password ? "form-error-input" : ""}`}
            placeholder="Enter Your Password"
            name="password"
            onChange={(e) => setFormValues(e)}
          />
          <i className="fa-solid fa-lock form-icon"></i>
          <i className={`fa-solid password-icon ${showPassword.password ? " fa-eye-slash" : " fa-eye"}`} onClick={() => handleShowPasswords("password")}></i>
          {errors?.password && <p className="error-field-text">{`*${errors.password}*`}</p>}
        </div>
        {!loginForm && (
          <div className="form-field-wrap">
            <input
              type={showPassword.cpassword ? "text" : "password"}
              className={`form-input password-input ${errors.password ? "form-error-input" : ""}`}
              placeholder="Re-enter Your Password"
              name="cpassword"
              onChange={(e) => setFormValues(e)}
            />
            <i className="fa-solid fa-lock form-icon"></i>
            <i className={`fa-solid password-icon ${showPassword.cpassword ? " fa-eye-slash" : " fa-eye"}`} onClick={() => handleShowPasswords("cpassword")}></i>
            {errors?.cpassword && <p className="error-field-text">{`*${errors.cpassword}*`}</p>}
          </div>
        )}
        {!loginForm && (
          <div className="form-field-wrap">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              className="form-radio-input"
              onChange={(e) => setFormValues(e)}
            />
            <label htmlFor="male" className="form-label">
              Male
            </label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              className="form-radio-input"
              onChange={(e) => setFormValues(e)}
            />
            <label htmlFor="female" className="form-label">
              Female
            </label>
            {errors?.gender && <p className="error-field-text">{`*${errors.gender}*`}</p>}
          </div>

        )}
        {!loginForm && (
          <div className="form-field-wrap">
            <label htmlFor="dob" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="DOB"
              min="1920-01-01"
              max={formatToCurrentDate()}
              onChange={(e) => setFormValues(e)}
            />
            {errors?.DOB && <p className="error-field-text">{`*${errors.DOB}*`}</p>}
          </div>
        )}
        {method === "login" ? <Link to={"/register"} className="form-redirect-link">Do not have an Account? Click here to create one</Link> : <Link to={"/login"} className="form-redirect-link">Already have an Account? Click here to Login</Link>}
        <Button
          className="form-btn"
          theme={"var(--primary-orange)"}
          // theme={"#0EC367"}
          color={"white"}
          text={"Submit"}
          onClick={handleSubmit}
          type="submit"
        />
      </form>
    </div>
  );
};

export default Form;
