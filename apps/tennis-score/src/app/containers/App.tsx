import { appLoad } from "@tennis-score/redux";
import "firebase/auth";
import "firebase/firestore";
import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { renderRoutes } from "react-router-config";
import "../app.scss";
import { AppLoader } from "../components/AppLoader";
import { maxContainer } from '../components/common';
const linkStyle = {
  lineHeight: "2rem"
};

const App = ({ route, user, appLoad, appLoaded, history }) => {
  useEffect(() => {
    appLoad();
  }, []);

  useEffect(() => {
    if (user && !user.displayName) {
      console.log("user has not profile name");
      history.push("/account-details/edit");
    }
  }, [user]);

  return appLoaded ? (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        style={{
          padding: 0
        }}
      >
        <Navbar.Brand
          href="#home"
          style={{ paddingLeft: "0.9rem", padding: "0.6rem" }}
        >
          Tennis-Sheet
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          style={{ marginRight: "0.4rem" }}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {user && user.lastGroup ? (
              <LinkContainer style={linkStyle} to="/leaderboard">
                <NavDropdown.Item className="text-white">
                  Leaderboard
                </NavDropdown.Item>
              </LinkContainer>
            ) : null}
            <LinkContainer style={linkStyle} to="/home">
              <NavDropdown.Item className="text-white">Groups</NavDropdown.Item>
            </LinkContainer>
            {!user ? (
              <LinkContainer style={linkStyle} to="/signin">
                <NavDropdown.Item className="text-white">
                  Sign In
                </NavDropdown.Item>
              </LinkContainer>
            ) : (
              <LinkContainer style={linkStyle} to="/account-details">
                <NavDropdown.Item className="text-white">
                  User Profile
                </NavDropdown.Item>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div {...maxContainer}>{renderRoutes(route.routes)}</div>
    </div>
  ) : (
    <AppLoader />
  );
};

const mapStateToProps = ({
  app: { lastError, pendingRequests, user, appLoaded }
}) => ({
  lastError,
  user,
  appLoaded,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  appLoad: _ => dispatch(appLoad())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
