import { faFrog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const App = ({ route, user, ownP }) => {
  useEffect(() => {
    console.log(user);
    console.log(ownP);
  }, [user]);
  return (
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
  );
};

const mapStateToProps = ({ app: { lastError, pendingRequests, user } }) => ({
  lastError,
  user,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
