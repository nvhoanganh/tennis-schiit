import React, { useEffect, useState } from "react";
import { strongPassword, isValidEmail } from "@tennis-score/core";
import TextInput from "./TextInput";

const SignUp: React.SFC<{
  signupHandler();
}> = ({ signupHandler }) => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);

  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);

  const [confirmPass, setConfirmPass] = useState("");
  const [confirmPassValid, setConfirmPassValid] = useState(true);

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setPasswordValid(strongPassword(password) || !validated);
  }, [password, validated]);

  useEffect(() => {
    setEmailValid(isValidEmail(email) || !validated);
  }, [email, validated]);

  useEffect(() => {
    setConfirmPassValid(confirmPass === password);
  }, [confirmPass, password]);

  const validateAndSubmit = e => {
    setValidated(true);
    e.preventDefault();
    e.stopPropagation();
    if (signupHandler && emailValid && passwordValid && confirmPassValid) {
      signupHandler();
    }
  };

  return (
    <div className="mt-4 mx-4">
      <h4 className="card-title mb-4 mt-1">Sign Up</h4>
      <form noValidate onSubmit={validateAndSubmit}>
        <TextInput
          type="email"
          name="username"
          label="Username"
          value={email}
          placeholder="Email address"
          errorMessage="Valid email is required"
          setValue={setEmail}
          isValid={emailValid}
        ></TextInput>

        <TextInput
          type="password"
          name="password"
          label="Password"
          value={password}
          placeholder="Password"
          errorMessage="Min 8 chars,1 number,1 special"
          setValue={setPassword}
          isValid={passwordValid}
        ></TextInput>

        <TextInput
          type="password"
          name="confirm"
          label="Confirm Password"
          value={confirmPass}
          placeholder="Confirm Password"
          errorMessage="Password doesn't match"
          setValue={setConfirmPass}
          isValid={confirmPassValid}
        ></TextInput>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default SignUp;
