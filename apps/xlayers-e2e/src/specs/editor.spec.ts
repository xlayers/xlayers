describe('Editor page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.icon_wrapper').spread((firstFramework) => {
      firstFramework.click();
    });
  });

  it('the editor should open demo file', () => {
    cy.contains('Select A Demo File').click();
    cy.contains('md-components-cards-welcome-back').click();
    cy.location('hash').should('eq', '#/editor/preview');
  });
});
