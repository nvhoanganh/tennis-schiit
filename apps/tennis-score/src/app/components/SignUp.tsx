import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { strongPassword, isValidEmail } from "@tennis-score/core";
import TextInput from "./TextInput";
import UpdateButton from "./LoadingButton";
import { maxContainer } from "./common";
import { Link } from "./Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const SignUp = ({ loading, resetError, signupHandler, signInHandler }) => {
  const [state, setState] = useState({
    email: "",
    emailValid: false,
    password: "",
    passwordValid: false,
    confirmPass: "",
    confirmPassValid: false,
    formValid: false
  });

  const [validated, setValidated] = useState(false);
  const setValue = (field, value) =>
    setState(curr => ({ ...curr, [field]: value }));

  useEffect(() => {
    setState(current => {
      const newS = {
        ...current,
        passwordValid: strongPassword(state.password),
        emailValid: isValidEmail(state.email),
        confirmPassValid: state.confirmPass === state.password
      };
      return {
        ...newS,
        formValid:
          newS.passwordValid && newS.emailValid && newS.confirmPassValid
      };
    });
  }, [state.email, state.password, state.confirmPass, validated]);

  const validateAndSubmit = e => {
    setValidated(true);
    e.preventDefault();
    if (state.formValid) {
      signupHandler({ email: state.email, password: state.password });
    }
  };

  useEffect(() => {
    resetError();
  }, []);
  return (
    <div {...maxContainer}>
      <h4 className="card-title mb-4 mt-1">Sign Up</h4>
      <p className="text-center py-3">
        <Link
          onClick={() => {
            signInHandler({ isGmail: true });
          }}
          className="btn btn-outline-danger"
        >
          <FontAwesomeIcon icon={faUserCircle} className="text-danger mr-2" />
          Signup using Google
        </Link>
      </p>
      <hr />
      <form noValidate onSubmit={validateAndSubmit}>
        <TextInput
          type="email"
          name="email"
          label="Username"
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
          errorMessage="Min 8 chars,1 number,1 special"
          setValue={setValue}
          isValid={state.passwordValid}
        ></TextInput>

        <TextInput
          type="password"
          name="confirmPass"
          label="Confirm Password"
          value={state.confirmPass}
          placeholder="Confirm Password"
          errorMessage="Password doesn't match"
          setValue={setValue}
          isValid={state.confirmPassValid}
        ></TextInput>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <UpdateButton
                loading={loading}
                value="Sign up"
                type="submit"
                disabled={!state.formValid || loading}
                className="btn btn-primary btn-sm btn-block"
              ></UpdateButton>
            </div>
          </div>
          <div className="col-md-6 text-right">
            <LinkContainer to={`/signin`}>
              <Link title="Sign In" href="" className="small">
                Already have an account? Sign in
              </Link>
            </LinkContainer>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
