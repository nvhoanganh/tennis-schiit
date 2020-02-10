import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  useToast,
  DrawerFooter,
  Alert,
  AlertIcon,
  Spinner
} from "@chakra-ui/core";
import { faBars, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  appLoad,
  getAppLoaded,
  getCurrentUser,
  getLoadingLeaderboard,
  getPendingRequests,
  loadGroups,
  signOut,
  registerPwaHandle
} from "@tennis-score/redux";
import "firebase/auth";
import "firebase/firestore";
import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { renderRoutes } from "react-router-config";
import "../app.scss";
import AppIcon from "../../assets/icons/icon-96x96.png";
import { AppLoader } from "../components/AppLoader";
import { usePwaInstallPrompt } from "../hooks/usePwaInstallPrompt";
import Headroom from "react-headroom";
import useServiceWorker from "../hooks/useServiceWorker";
import { version } from "../../assets/version";
import Confirm from "../components/Confirm";
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
  registerPwaHandle,
  signOutHandler
}) => {
  const toast = useToast();
  const [showInstalling, isInstalled] = useServiceWorker(registerPwaHandle);
  const [show, setShow] = useState(false);
  usePwaInstallPrompt();

  useEffect(() => {
    appLoad();
    loadGroups();
  }, []);

  useEffect(() => {
    if (isInstalled) {
      setShow(true);
    }
  }, [isInstalled]);

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
    if (user && user.loaded && !user.profileUpdated) {
      history.push("/account-details/edit");
    }
    if (!user || (user && user.profileUpdated)) {
      setShowNav(true);
    }
  }, [user]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showNav, setShowNav] = useState(false);
  if (appLoadError) return <AppLoader hideSpinner={true} />;
  return appLoaded ? (
    <div>
      {showInstalling && (
        <Alert status="info" style={{ zIndex: 1000 }} className="sticky first">
          <Spinner color="blue.500" className="mr-3" />
          Installing new version..
        </Alert>
      )}
      {showNav && (
        <Headroom>
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
              <Navbar.Brand
                style={{ paddingLeft: "0.9rem", padding: "0.6rem" }}
              >
                <img
                  width="30"
                  src={AppIcon}
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
        </Headroom>
      )}
      <div>{renderRoutes(route.routes)}</div>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <div className="text-center">
              <img
                style={{
                  width: 54
                }}
                src={AppIcon}
                className="d-inline-block align-top pl-4"
              />
              Tennis score
              {user && (
                <button
                  onClick={() =>
                    signOutHandler().then(_ => window.location.reload())
                  }
                  type="button"
                  className="btn btn-danger btn-sm float-right"
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                </button>
              )}
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
          <DrawerFooter>
            <p className="text-muted small py-1 d-block text-center">
              v0.1.{version}
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Confirm
        title="Reload now?"
        message="New version has been successfully installed. Do you want to reload now?"
        close="Maybe later"
        mainAction="OK"
        mainActionClass="blue"
        onCancelAction={() => setShow(false)}
        onConfirmAction={() => window.location.reload()}
        show={show}
      ></Confirm>
    </div>
  ) : (
    <AppLoader />
  );
};

const mapStateToProps = state => ({
  user: getCurrentUser(state),
  pendingRequests: getPendingRequests(state),
  appLoaded: getAppLoaded(state),
  loading: getLoadingLeaderboard(state)
});

const mapDispatchToProps = dispatch => ({
  appLoad: _ => dispatch(appLoad()),
  registerPwaHandle: reg => dispatch(registerPwaHandle(reg)),
  signOutHandler: () => dispatch(signOut()),
  loadGroups: _ => dispatch(loadGroups())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
