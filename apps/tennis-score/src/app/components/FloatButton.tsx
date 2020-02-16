import React from "react";
import { Button, Container } from "react-floating-action-button";
import { LinkContainer } from "react-router-bootstrap";
function FloatButton({ icon, url, tooltip }) {
  return (
    <Container
      className="color-dark"
      styles={{
        zIndex: 1000,
        right: 6,
        bottom: 10
      }}
    >
      <LinkContainer to={url}>
        <Button tooltip={tooltip} icon="fas fa-plus" rotate={false}>
          {icon}
        </Button>
      </LinkContainer>
    </Container>
  );
}
export default FloatButton;
