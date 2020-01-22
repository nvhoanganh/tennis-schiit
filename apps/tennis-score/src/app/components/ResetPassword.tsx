import React, { useEffect, useState } from "react";
import { maxContainer } from "./common";
import UpdateButton from "./LoadingButton";
import RouteNav from "./RouteNav";
import TextInput from "./TextInput";
import { useToast } from "@chakra-ui/core";

const ResetPassword = ({
  loading,
  history,
  resetPassword,
  lastError,
  resetError
}) => {
  const toast = useToast();
  const [state, setState] = useState({
    email: "",
    emailValid: false
  });

  const setValue = (field, value) => {
    setState(curr => ({ ...curr, [field]: value }));
  };

  useEffect(() => {
    setState(current => {
      return {
        ...current,
        emailValid: !!state.email
      };
    });
  }, [state.email]);

  useEffect(() => {
    resetError();
  }, []);

  const validateAndSubmit = e => {
    e.preventDefault();
    if (state.emailValid) {
      resetPassword(state.email).then(
        toast({
          title: "Password reset email sent",
          status: "success",
          duration: 3000,
          isClosable: true
        })
      );
    }
  };

  return (
    <>
      <RouteNav history={history} center="Password Reset"></RouteNav>
      <div {...maxContainer}>
        {lastError && (
          <div className="alert alert-danger">Email address not found.</div>
        )}
        <form noValidate onSubmit={validateAndSubmit}>
          <TextInput
            type="email"
            name="email"
            label="Email Address"
            value={state.email}
            placeholder="Email address"
            errorMessage="Email address is required"
            setValue={setValue}
            isValid={state.emailValid}
          ></TextInput>

          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <UpdateButton
                  loading={loading}
                  value="Reset Password"
                  type="submit"
                  disabled={!state.emailValid || loading}
                  className="btn btn-primary btn-sm btn-block"
                ></UpdateButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
