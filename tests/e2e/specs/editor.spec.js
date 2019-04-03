describe("Editor page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.getByText(/^get started$/i).click();
  });

  it("the editor should open demo file", () => {
    cy.getByText("Select A Demo File").click();
    cy.getByText("md-components-cards-welcome-back").click();
    cy.location("hash").should("eq", "#/editor/preview");
  });

  it("the editor should open input file", () => {
    cy.fixture('md-components.sketch', 'base64').then(fileContent => {
      cy.wait(500);
      cy.getByText("Upload A Design From Your Computer").debug().upload(
        { fileContent, fileName: 'md-components.sketch', mimeType: 'image/png' },
        { subjectType: 'input' },
      ).debug();
    });
    cy.location("hash").should("eq", "#/editor/preview");
  });
});
