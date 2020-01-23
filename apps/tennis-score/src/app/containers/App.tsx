import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  useToast
} from "@chakra-ui/core";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appLoad, loadGroups, signOut } from "@tennis-score/redux";
import "firebase/auth";
import "firebase/firestore";
import React, { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { renderRoutes } from "react-router-config";
import "../app.scss";
import { AppLoader } from "../components/AppLoader";

const linkStyle = {
  lineHeight: "2rem"
};

const App = ({
  route,
  user,
  appLoad,
  loadGroups,
  appLoadError,
  appLoaded,
  history,
  signOutHandler
}) => {
  const toast = useToast();

  useEffect(() => {
    appLoad();
    loadGroups();
  }, []);

  useEffect(() => {
    if (appLoadError) {
      const offline = appLoadError.toString().indexOf("offline") > 0;
      toast({
        title: offline
          ? "Oh no! Your connection seems off.."
          : "Something went wrong",
        description: "Please reload to try again",
        status: "error",
        duration: null,
        isClosable: false
      });
    }
  }, [appLoadError]);

  useEffect(() => {
    if (user && !user.displayName) {
      history.push("/account-details/edit");
    }
  }, [user]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (appLoadError) return <AppLoader hideSpinner={true} />;
  return appLoaded ? (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        className="sticky first"
        variant="dark"
        style={{
          padding: 0,
        }}
      >
        <LinkContainer to={"/"}>
          <Navbar.Brand style={{ paddingLeft: "0.9rem", padding: "0.6rem" }}>
            <img
              width="30"
              src="https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/assets%2Fapplogo.png?alt=media"
              height="30"
              className="d-inline-block align-top"
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
              />
              Tennis score
            </div>
          </DrawerHeader>
          <DrawerBody>
            <LinkContainer style={linkStyle} to="/home">
              <a className="h5 py-1 d-block">Home</a>
            </LinkContainer>
            {!user ? (
              <LinkContainer style={linkStyle} to="/signin">
                <a className="h5 py-1 d-block">Sign In</a>
              </LinkContainer>
            ) : (
              <LinkContainer style={linkStyle} to="/account-details">
                <a className="h5 py-1 d-block">My Profile</a>
              </LinkContainer>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  ) : (
    <AppLoader />
  );
};

const mapStateToProps = ({
  app: { lastError, pendingRequests, user, appLoaded, appLoadError }
}) => ({
  lastError,
  appLoadError,
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
