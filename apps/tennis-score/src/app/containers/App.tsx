import React, { useEffect } from "react";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrog } from "@fortawesome/free-solid-svg-icons";
import { LinkContainer } from "react-router-bootstrap";

const linkStyle = {
  lineHeight: "2rem"
};

export const App: React.SFC<any> = ({ route, user, ownP }) => {
  useEffect(() => {
    console.log(user);
    console.log(ownP);
  }, []);
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
          style={{ marginRight: '0.4rem' }}
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
            <LinkContainer style={linkStyle} to="/signin">
              <NavDropdown.Item className="text-white">
                Sign In
              </NavDropdown.Item>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div>{renderRoutes(route.routes)}</div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.app,
  ownP: ownProps
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
