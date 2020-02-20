import { cleanup, getByText, render } from "@testing-library/react";
import React from "react";
import { Button } from "../app/components/Button";

describe("App", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render successfully", () => {
    const { baseElement } = render(<Button>Hello</Button>);
    getByText(baseElement, "Hello");
  });
});
