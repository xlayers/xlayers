describe("Editor page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.getByText(/^get started$/i).click();
    cy.getByText("Select A Demo File").click();
    cy.getByText("md-components-cards-welcome-back").click();
    cy.wait(500);
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

  it("when selecting a layer of a design file, the right sidebar should show up", () => {
    cy.get('.settings > .mat-drawer-inner-container').should("not.be.visible");
    cy.get("xly-viewer-layer").first().click();
    cy.get('.settings > .mat-drawer-inner-container').should("be.visible");
  });

  context("using toolbar zoom", () => {
    it("when using the toolbar buttons + zoom the design canvas should react accordingly", () => {
      cy.get('[mattooltip="Zoom In"]').click()
      cy.get('[mattooltip="Zoom In"]').then((button) => {
        expect(button).to.have.attr("ng-reflect-color", "warn");
      });
      cy.get('xly-viewer-canvas > div').then((canvas) => {
        expect(canvas).to.have.css("transform", "matrix(1.1, 0, 0, 1.1, 0, 0)");
      });
      cy.get('[mattooltip="Zoom In"]').click()
      cy.get('xly-viewer-canvas > div').then((canvas) => {
        expect(canvas).to.have.css("transform", "matrix(1.2, 0, 0, 1.2, 0, 0)");
      });
    });

    it("when using the toolbar buttons - zoom the design canvas should react accordingly", () => {
      cy.get('[mattooltip="Zoom Out"]').click()
      cy.get('[mattooltip="Zoom Out"]').then((button) => {
        expect(button).to.have.attr("ng-reflect-color", "warn");
      });
      cy.get('xly-viewer-canvas > div').then((canvas) => {
        expect(canvas).to.have.css("transform", "matrix(0.9, 0, 0, 0.9, 0, 0)");
      });
      cy.get('[mattooltip="Zoom Out"]').click()
      cy.get('xly-viewer-canvas > div').then((canvas) => {
        expect(canvas).to.have.css("transform", "matrix(0.8, 0, 0, 0.8, 0, 0)");
      });
    });

    it("when using the toolbar buttons reset zoom the design canvas should react accordingly", () => {
      cy.get('[mattooltip="Zoom Out"]').click()
      cy.get('[mattooltip="Zoom Out"]').then((button) => {
        expect(button).to.have.attr("ng-reflect-color", "warn");
      });
      cy.get('xly-viewer-canvas > div').then((canvas) => {
        expect(canvas).to.have.css("transform", "matrix(0.9, 0, 0, 0.9, 0, 0)");
      });
      cy.get('[mattooltip="Zoom Reset"]').click()
      cy.get('xly-viewer-canvas > div').then((canvas) => {
        expect(canvas).to.have.css("transform", "matrix(1, 0, 0, 1, 0, 0)");
      });
    });
  });

  it("when using the toolbar buttons show layer the design canvas should react accordingly", () => {
    cy.get('[mattooltip="Toggle Preview Mode"]').click()
    cy.get('[mattooltip="Toggle Preview Mode"]').then((button) => {
      expect(button).to.have.attr("ng-reflect-color", "warn");
    });
    cy.get('xly-viewer-layer').first().then((canvas) => {
      expect(canvas).to.have.class("wireframe");
    });
    cy.get('[mattooltip="Zoom Reset"]').click()
  });

  it("when using the toolbar buttons 3d the design canvas should react accordingly", () => {
    cy.get('[mattooltip="Toggle 3D – Hold SHIFT to rotate"]').click()
    cy.get('[mattooltip="Toggle 3D – Hold SHIFT to rotate"]').then((button) => {
      expect(button).to.have.attr("ng-reflect-color", "warn");
    });
    cy.wait(1000);
    cy.get('[data-id="6D287BF2-0FE7-43CC-AA85-84EB6F8B4ED2"]').then((layer) => {
      expect(layer).to.have.css("transform", "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 60, 1)");
    });
  });
});
