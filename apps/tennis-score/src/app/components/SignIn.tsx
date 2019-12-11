import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import TextInput from "./TextInput";

const SignIn: React.SFC<{
  signInHandler(data);
  history: any;
  user: any;
}> = ({ signInHandler, history, user, ...props }) => {
  const [state, setState] = useState({
    email: "",
    emailValid: false,
    password: "",
    passwordValid: false,
    formValid: false
  });

  const setValue = (field, value) =>
    setState(curr => ({ ...curr, [field]: value }));

  useEffect(() => {
    setState(current => ({
      ...current,
      passwordValid: !!state.password.trim(),
      emailValid: !!state.email.trim(),
      formValid: !!state.password.trim() && !!state.email.trim()
    }));
  }, [state.email, state.password]);

  useEffect(() => {
    if (user) {
      console.log("user is now", user);
      history.push("/home");
    }
  }, [user]);

  const validateAndSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    signInHandler(state);
  };

  return (
    <div className="mt-4 mx-4">
      <LinkContainer to="/signup">
        <a href="" className="float-right btn btn-outline-primary">
          Sign up
        </a>
      </LinkContainer>
      <h4 className="card-title mb-4 mt-1">Sign in</h4>
      <p>
        <a
          onClick={() => {
            console.log("login via google");
          }}
          className="btn btn-block btn-outline-danger"
        >
          <FontAwesomeIcon icon={faUserCircle} className="text-danger mr-2" />
          Login via Google
        </a>
      </p>
      <hr />
      <form noValidate onSubmit={validateAndSubmit}>
        <TextInput
          type="email"
          name="email"
          label="Email"
          value={state.email}
          placeholder="Email address"
          errorMessage="Valid email is required"
          setValue={setValue}
          isValid={state.emailValid}
        ></TextInput>

        <TextInput
          type="password"
          name="password"
          label="Password"
          value={state.password}
          placeholder="Password"
          errorMessage="Password is required"
          setValue={setValue}
          isValid={state.passwordValid}
        ></TextInput>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <button
                disabled={!state.formValid}
                type="submit"
                className="btn btn-primary btn-block"
              >
                Login
              </button>
            </div>
          </div>
          <div className="col-md-6 text-right">
            <a className="small" href="#">
              Forgot password?
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};
export default SignIn;
