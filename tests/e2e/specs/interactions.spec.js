describe("Editor page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.getByText(/^get started$/i).click();
    cy.getByText("Select A Demo File").click();
    cy.getByText("md-components-cards-welcome-back").click();
  });

  it("when loading a design file, the left sidebar should render and shows the correct layers structure", () => {
    cy.getByText("Welcome back").then((subject) => {
      cy.wrap(subject).click();
      cy.wrap(subject).get("mat-tree").children().then((subjects) => {
        cy.wrap(subjects[0]).contains("Welcome back");
        cy.wrap(subjects[1]).contains("card");
        cy.wrap(subjects[2]).contains("Welcome Back!");
        cy.wrap(subjects[3]).contains("It’s been a while, h");
        cy.wrap(subjects[4]).children().then((subject) => {
          cy.wrap(subject[3]).contains("YES");
        });
        cy.wrap(subjects[5]).children().then((subject) => {
          cy.wrap(subject[3]).contains("NO");
        });
      });
    });
  });

  it("when selecting a layer in the left sidebar, the design should highlight the correct layer in the canvas are", () => {
    cy.get("xly-viewer-canvas").then((subject) => {
      cy.wrap(subject).click();
      cy.wrap(subject).contains("YES").click();
    });
    cy.get("mat-tree-node.selected").contains("YES");

    cy.get("xly-viewer-canvas").then((subject) => {
      cy.wrap(subject).click();
      cy.wrap(subject).contains("NO").click();
    });
    cy.get("mat-tree-node.selected").contains("NO");
  });
});
