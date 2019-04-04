describe("Editor page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.getByText(/^get started$/i).click();
    cy.getByText("Select A Demo File").click();
    cy.getByText("md-components-cards-welcome-back").click();
  });

  it("when loading a design file, the left sidebar should render and shows the correct layers structure", () => {
    cy.getByText("Welcome back").click();
    cy.get("xly-tree-layout mat-tree").children().then((welcomeBackTree) => {
      cy.wrap(welcomeBackTree[0]).contains("Welcome back");
      cy.wrap(welcomeBackTree[1]).contains("card");
      cy.wrap(welcomeBackTree[2]).contains("Welcome Back!");
      cy.wrap(welcomeBackTree[3]).contains("It’s been a while, h");
    });
    cy.get('.mat-tree > [data-id="E7B1B481-EA1B-449A-A8A1-75F4E84C7B9D"]').click();
    cy.get('.mat-tree > [data-id="3FE0C2A6-A817-47D9-B070-ED2CD9D39D7D"]').contains("YES");
    cy.wait(1000);
    cy.get('.mat-tree > [data-id="A147FF7C-F32C-4E80-B23B-2708FF7B1880"]').click();
    cy.get('.mat-tree > [data-id="B40DD28B-85D6-4D87-A801-0E543573111E"]').contains("NO");
  });

  it("when selecting a layer in the left sidebar, the design should highlight the correct layer in the canvas are", () => {
    cy.get("xly-tree-layout").getByText("Welcome back").click();
    cy.get('.mat-tree > [data-id="A147FF7C-F32C-4E80-B23B-2708FF7B1880"]').click();
    cy.get('.mat-tree > [data-id="B40DD28B-85D6-4D87-A801-0E543573111E"]').contains("NO");
    cy.get(".isCurrentLayer").contains("NO");
  });

  it("when selecting a layer of a design file, the left sidebar should highlight the correct layer", () => {
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
