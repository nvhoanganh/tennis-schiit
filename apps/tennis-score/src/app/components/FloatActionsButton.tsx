import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Button, Link } from "react-floating-action-button";
import { LinkContainer } from "react-router-bootstrap";
function FloatActionsButton({ icon, urls }) {
  return (
    <Container
      className="color-dark"
      styles={{
        zIndex: 1000,
        right: 6,
        bottom: 10
      }}
    >
      {urls.map(url => (
        <Link key={url.url} href={url.url} tooltip={url.tooltip} icon={icon}>
          <LinkContainer to={url.url}>
            <FontAwesomeIcon icon={url.icon} />
          </LinkContainer>
        </Link>
      ))}

      <Button icon="fas fa-plus" rotate={false}>
        <FontAwesomeIcon icon={icon} />
      </Button>
    </Container>
  );
}
export default FloatActionsButton;
