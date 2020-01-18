import { appLoad, loadGroups, signOut } from "@tennis-score/redux";
import { Button } from "@chakra-ui/core";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  DrawerHeader,
  DrawerFooter
} from "@chakra-ui/core";
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

const App = ({
  route,
  user,
  appLoad,
  loadGroups,
  appLoaded,
  history,
  signOutHandler
}) => {
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
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          onClick={() => onOpen()}
          style={{ marginRight: "0.4rem", border: "none" }}
          children={<FontAwesomeIcon icon={faBars} />}
        />
      </Navbar>
      <div>{renderRoutes(route.routes)}</div>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <div className="text-center" style={{ marginLeft: -45 }}>
              <img
                style={{
                  width: 54,
                  alignSelf: "center",
                  marginRight: 3
                }}
                src="https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/assets%2Fapplogo.png?alt=media"
                className="d-inline-block align-top pl-4"
                alt="React Bootstrap logo"
              />
              Tennis score
            </div>
          </DrawerHeader>
          <DrawerBody>
            <LinkContainer style={linkStyle} to="/home">
              <a className="h5 py-2 d-block">Home</a>
            </LinkContainer>
            {!user ? (
              <LinkContainer style={linkStyle} to="/signin">
                <a className="h5 py-2 d-block">Sign In</a>
              </LinkContainer>
            ) : (
              <LinkContainer style={linkStyle} to="/account-details">
                <a className="h5 py-2 d-block">My Profile</a>
              </LinkContainer>
            )}
          </DrawerBody>
          {user ? (
            <DrawerFooter borderTopWidth="1px">
              <Button
                size="sm"
                onClick={signOutHandler}
                className="btn-block"
                variantColor="red"
              >
                Sign Out
              </Button>
            </DrawerFooter>
          ) : null}
        </DrawerContent>
      </Drawer>
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
  signOutHandler: () => dispatch(signOut()),
  loadGroups: _ => dispatch(loadGroups())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
