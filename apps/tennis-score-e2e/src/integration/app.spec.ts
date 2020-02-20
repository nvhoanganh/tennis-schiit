describe("tennis-score", () => {
  before(() => {
    cy.visit("/");
  });

  it("should display welcome message", () => {
    cy.get(".navbar-brand").contains("Tennis Score");
  });

  it("should display HSV group", () => {
    cy.contains("HSV").click();
  });

  it("click on back should go back", () => {
    cy.get(":nth-child(1) > .btn").click();
  });
});
