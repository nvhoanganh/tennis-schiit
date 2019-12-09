import React, { useEffect } from "react";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrog } from "@fortawesome/free-solid-svg-icons";
import { LinkContainer } from "react-router-bootstrap";

export const App: React.SFC<any> = ({ route, user, ownP }) => {
  useEffect(() => {
    console.log(user);
    console.log(ownP);
  }, []);
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          <FontAwesomeIcon icon={faFrog} /> Tennis-Schiit
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="More" id="collasible-nav-dropdown">
              <LinkContainer to="/home">
                <NavDropdown.Item>Home</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/leaderboard">
                <NavDropdown.Item>Leaderboard</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin">
                <NavDropdown.Item>Admin</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
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
