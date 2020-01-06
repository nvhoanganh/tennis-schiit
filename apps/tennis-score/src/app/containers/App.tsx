import { appLoad, loadGroups } from "@tennis-score/redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { faSyncAlt, faBars } from "@fortawesome/free-solid-svg-icons";

const linkStyle = {
  lineHeight: "2rem"
};

const App = ({ route, user, appLoad, loadGroups, appLoaded, history }) => {
  useEffect(() => {
    appLoad();
    loadGroups();
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
        <LinkContainer to={"/"}>
          <Navbar.Brand style={{ paddingLeft: "0.9rem", padding: "0.6rem" }}>
            <img
              width="30"
              src="https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/assets%2Fapplogo.png?alt=media"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />{" "}
            Tennis Score
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          style={{ marginRight: "0.4rem" }}
          children={<FontAwesomeIcon icon={faBars} />}
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
              <NavDropdown.Item className="text-white">Home</NavDropdown.Item>
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
      <div>{renderRoutes(route.routes)}</div>
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
  appLoad: _ => dispatch(appLoad()),
  loadGroups: _ => dispatch(loadGroups())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
