import { faFrog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
          <FontAwesomeIcon icon={faFrog} /> Tennis-Schiit
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          style={{ marginRight: "0.4rem" }}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer style={linkStyle} to="/home">
              <NavDropdown.Item className="text-white">Home</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer style={linkStyle} to="/leaderboard">
              <NavDropdown.Item className="text-white">
                Leaderboard
              </NavDropdown.Item>
            </LinkContainer>
            <LinkContainer style={linkStyle} to="/admin">
              <NavDropdown.Item className="text-white">Admin</NavDropdown.Item>
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
    <h4>Loading...</h4>
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
